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
  } catch (e) {
    console.error('Chunk recovery cleanup failed:', e);
  }
  window.location.reload();
};

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