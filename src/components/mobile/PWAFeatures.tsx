import React, { useEffect, useState } from 'react';

const PWAFeatures = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  useEffect(() => {
    window.addEventListener('offline', () => setIsOffline(true));
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);
  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-2">PWA Features</h2>
      <div>Status: {isOffline ? 'Offline' : 'Online'}</div>
      {deferredPrompt && <button onClick={handleInstall} className="btn btn-primary mt-2">Install App</button>}
      <div className="mt-2">Offline support and background sync enabled.</div>
    </div>
  );
};

export default PWAFeatures; 