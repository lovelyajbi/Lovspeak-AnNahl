
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  syncFromCloud,
  getGeminiApiKeys,
  clearAllLocalData,
  migrateLegacyAccess,
  resolveAccessState,
  syncScalevAccessByEmail,
} from '../../services/storage';
import { isAdminUser } from '../../services/admin';
import { startPresence } from '../../services/presence';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isActive: boolean;
  hasApiKey: boolean;
  isSyncing: boolean;
  isLoggingIn: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  signout: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  useEffect(() => {
    let unsubscribeStatus: (() => void) | null = null;
    let stopPresence: (() => void) | null = null;
    const readLocalProfile = () => {
      const raw = localStorage.getItem('lovelya_profile');
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setHasApiKey(getGeminiApiKeys().length > 0);
      
      if (firebaseUser) {
        isAdminUser(firebaseUser.uid, firebaseUser.email).then(setIsAdmin).catch(() => setIsAdmin(false));
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
            const data = snap.data();
            const localProfile = readLocalProfile();
            const resolvedAccess = resolveAccessState(data, localProfile);
            setIsActive(resolvedAccess);

            if (!resolvedAccess) {
              syncScalevAccessByEmail({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
              })
                .then((synced) => {
                  if (synced) setIsActive(true);
                })
                .catch(console.error);
            } else if (!data.isActive) {
              setDoc(doc(db, `users/${firebaseUser.uid}`), {
                isActive: true,
              }, { merge: true }).catch(console.error);
            }
          } else {
            // New user - minimal doc to ensure it exists
            setDoc(doc(db, `users/${firebaseUser.uid}`), {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              createdAt: new Date().toISOString()
            }, { merge: true })
              .then(() => syncScalevAccessByEmail({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
              }))
              .then((synced) => {
                if (synced) setIsActive(true);
              })
              .catch(console.error);
          }
        }, (err) => {
          console.error("Status snapshot error:", err);
        });

        migrateLegacyAccess({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        }).catch(console.error);

      } else {
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
      clearAllLocalData();
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
      await syncScalevAccessByEmail({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      await migrateLegacyAccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      await checkStatus(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isActive, hasApiKey, isSyncing, isLoggingIn, isAdmin, login, signout, refreshStatus }}>
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
