
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  syncFromCloud,
  getGeminiApiKeys,
  clearAllLocalData,
  resolveAccessState,
} from '../../services/storage';
import { isAdminUser } from '../../services/admin';
import { startPresence } from '../../services/presence';
import { verifyAccountAccess } from '../../services/accessGate';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isActive: boolean;
  hasApiKey: boolean;
  isSyncing: boolean;
  isLoggingIn: boolean;
  isAdmin: boolean;
  accessMessage: string | null;
  login: () => Promise<void>;
  signout: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A browser can switch Google accounts without emitting a signed-out state
// first. Keep the local cache tied to the Firebase UID so one learner's
// unsynced activity/progress can never be merged into another learner.
const LOCAL_SESSION_UID_KEY = 'lovspeak_session_uid';
const clearLearnerSessionCache = () => {
  clearAllLocalData();
  [
    'lovspeak_state_reading',
    'lovspeak_state_listening',
    'lovspeak_state_vocab',
    'lovspeak_state_games',
    'lovspeak_state_diary',
    'lovelya_recent_assessment_packs',
  ].forEach((key) => localStorage.removeItem(key));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(() => {
    const profile = localStorage.getItem('lovelya_profile');
    if (profile) {
      try {
        return JSON.parse(profile).isActive || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const [hasApiKey, setHasApiKey] = useState(() => getGeminiApiKeys().length > 0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessMessage, setAccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeStatus: (() => void) | null = null;
    let stopPresence: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (unsubscribeStatus) {
        unsubscribeStatus();
        unsubscribeStatus = null;
      }
      if (stopPresence) {
        stopPresence();
        stopPresence = null;
      }
      setUser(firebaseUser);
      setHasApiKey(getGeminiApiKeys().length > 0);
      
      if (firebaseUser) {
        // Seat assignment is server-enforced and runs before any Firestore
        // profile/activity sync. A denied account is signed out immediately,
        // so a Google user can never open the app by bypassing the UI.
        const access = await verifyAccountAccess(firebaseUser).catch(() => ({
          allowed: false,
          reason: 'service_unavailable' as const,
          message: 'Akses LovSpeak belum dapat diverifikasi. Silakan coba lagi beberapa saat kemudian.',
        }));
        if (!access.allowed) {
          setAccessMessage(access.message || 'Akses LovSpeak saat ini sedang penuh. Silakan hubungi admin untuk informasi lebih lanjut.');
          setUser(null);
          setIsAdmin(false);
          setIsActive(false);
          setIsSyncing(false);
          clearLearnerSessionCache();
          localStorage.removeItem(LOCAL_SESSION_UID_KEY);
          try { await logout(); } catch (error) { console.error('Denied account signout failed:', error); }
          setLoading(false);
          return;
        }
        setAccessMessage(null);
        setIsActive(true);
        const previousUid = localStorage.getItem(LOCAL_SESSION_UID_KEY);
        // If the marker is missing (for example after an older app version),
        // reset once before the first cloud sync as well. Firestore then
        // repopulates the cache from this UID only.
        if (previousUid !== firebaseUser.uid) {
          clearLearnerSessionCache();
        }
        localStorage.setItem(LOCAL_SESSION_UID_KEY, firebaseUser.uid);
        // Keep the admin's normal LovSpeak entry point, but do not block a
        // trusted admin account behind the student activation screen.
        // Awaited (not fire-and-forget): granted admins need a Firestore round
        // trip to resolve `isAdminUser`, which is slower than the master
        // admin's email check. If `loading` flipped to false before this
        // settled, AdminPortal briefly rendered with the default isAdmin=false
        // and showed "Akses admin tidak tersedia" — easy to mistake for a
        // real denial and log out from, even though it would self-correct.
        let adminSession = false;
        try {
          const [access, token] = await Promise.all([isAdminUser(firebaseUser.uid, firebaseUser.email), firebaseUser.getIdTokenResult()]);
          adminSession = access || token.claims.adminMaster === true;
          setIsAdmin(adminSession);
          if (adminSession) setIsActive(true);
        } catch {
          setIsAdmin(false);
        }
        startPresence(firebaseUser.uid).then((stop) => { stopPresence = stop; }).catch(console.error);
        setIsSyncing(true);
        // Initial sync
        syncFromCloud().finally(() => {
          setIsSyncing(false);
          setHasApiKey(getGeminiApiKeys().length > 0);
        });

        // Real-time status sync
        unsubscribeStatus = onSnapshot(doc(db, `users/${firebaseUser.uid}`), (snap) => {
          if (snap.exists()) {
            // The server seat check has already granted access. Keep this
            // true even when an older profile has not yet replicated its
            // `isActive` field to this client.
            setIsActive(true);
          } else {
            // New user - minimal doc to ensure it exists
            setDoc(doc(db, `users/${firebaseUser.uid}`), {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              createdAt: new Date().toISOString()
            }, { merge: true })
              .then(() => setIsActive(true))
              .catch(console.error);
          }
        }, (err) => {
          console.error("Status snapshot error:", err);
        });

      } else {
        localStorage.removeItem(LOCAL_SESSION_UID_KEY);
        setIsAdmin(false);
        setIsActive(false);
        setHasApiKey(false);
        setIsSyncing(false);
        if (unsubscribeStatus) unsubscribeStatus();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeStatus) unsubscribeStatus();
      if (stopPresence) stopPresence();
    };
  }, []);

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log("Login popup was closed.");
      } else {
        console.error("Login error:", error);
        const confirmNewTab = window.confirm(
          "Waduh! Sepertinya browser Anda memblokir jendela login (Pop-up).\n\nIngin membuka aplikasi di Tab Baru agar login lebih stabil dan lancar?"
        );
        if (confirmNewTab) {
          window.open(window.location.href, '_blank');
        } else {
          alert("Ops! Sepertinya ada kendala saat masuk. Pastikan popup diizinkan. Error: " + error.message);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signout = async () => {
    try {
      await logout();
      clearLearnerSessionCache();
      localStorage.removeItem(LOCAL_SESSION_UID_KEY);
    } catch (e) {
      console.error("Signout error:", e);
    }
  };

  const checkStatus = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, `users/${uid}`));
      if (snap.exists()) {
        const data = snap.data();
        const localProfile = (() => {
          const raw = localStorage.getItem('lovelya_profile');
          if (!raw) return null;
          try {
            return JSON.parse(raw);
          } catch (e) {
            return null;
          }
        })();
        setIsActive(resolveAccessState(data, localProfile));
      }
    } catch (e) {
      console.error("Manual status check error:", e);
    }
  };

  const refreshStatus = async () => {
    setHasApiKey(getGeminiApiKeys().length > 0);
    if (user) {
      await checkStatus(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isActive, hasApiKey, isSyncing, isLoggingIn, isAdmin, accessMessage, login, signout, refreshStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
