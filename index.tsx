import React from 'react';
import ReactDOM from 'react-dom/client';

// 0. Auto-recover from stale-chunk crashes after a redeploy.
// When a lazy import references a JS chunk that no longer exists (old cached
// index.html / service worker after a new deploy), the dynamic import rejects.
// Instead of crashing to the error screen, purge caches + SW and reload once.
// A sessionStorage guard prevents an infinite reload loop if the failure is real.
const isChunkLoadError = (message?: string) =>
  !!message && /Loading chunk|Importing a module script failed|dynamically imported module|Failed to fetch dynamically/i.test(message);

const recoverFromStaleChunk = async () => {
  const GUARD = 'lovspeak_chunk_recovery_attempted';
  if (sessionStorage.getItem(GUARD)) return; // already tried once — let it surface
  sessionStorage.setItem(GUARD, '1');
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg => reg.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }
    // Firebase Auth persists its session in IndexedDB. If that database is
    // corrupted (interrupted write, browser storage-cleanup bug), auth init
    // can hang forever with no error — wiping it forces a clean re-login
    // instead of leaving the user stuck on the splash screen indefinitely.
    if ('indexedDB' in window && indexedDB.databases) {
      const dbs = await indexedDB.databases();
      await Promise.all(dbs.map(db => db.name ? new Promise(resolve => {
        const req = indexedDB.deleteDatabase(db.name!);
        req.onsuccess = req.onerror = req.onblocked = () => resolve(undefined);
      }) : Promise.resolve()));
    }
  } catch (e) {
    console.error('Stale-state recovery cleanup failed:', e);
  }
  window.location.reload();
};

// If Firebase Auth's IndexedDB persistence never resolves (corrupted profile,
// storage blocked by browser policy/extension), onAuthStateChanged silently
// never fires and the app hangs on the splash screen forever with no error to
// catch. Force a one-time reload past it so users aren't stuck indefinitely.
const STUCK_LOADING_GUARD = 'lovspeak_stuck_loading_recovered';
window.setTimeout(() => {
  const stillOnSplash = document.getElementById('root')?.querySelector('[data-splash]');
  if (!stillOnSplash) return;
  if (sessionStorage.getItem(STUCK_LOADING_GUARD)) return; // already tried once — let it surface
  sessionStorage.setItem(STUCK_LOADING_GUARD, '1');
  void recoverFromStaleChunk();
}, 12000);
window.addEventListener('load', () => {
  window.setTimeout(() => {
    try { sessionStorage.removeItem(STUCK_LOADING_GUARD); } catch { /* ignore */ }
  }, 15000);
});

window.addEventListener('error', (event) => {
  if (isChunkLoadError(event.message)) void recoverFromStaleChunk();
});
window.addEventListener('unhandledrejection', (event) => {
  const reason: any = event.reason;
  if (isChunkLoadError(typeof reason === 'string' ? reason : reason?.message)) void recoverFromStaleChunk();
});

// Clear the recovery guard once the app has loaded cleanly for a moment.
window.addEventListener('load', () => {
  window.setTimeout(() => {
    try { sessionStorage.removeItem('lovspeak_chunk_recovery_attempted'); } catch { /* ignore */ }
  }, 5000);
});

// 1. Mandatory Service Worker Registration (Must be very early)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => console.log('SW Registered with scope:', reg.scope))
      .catch(err => console.log('SW Registration failed:', err));
  });
}

import App from './App';
import { AuthProvider } from './src/contexts/AuthContext';
import ErrorBoundary from './src/components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);