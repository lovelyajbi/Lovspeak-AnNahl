export const requestAppRefresh = async (): Promise<void> => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration('/');
      if (registration) {
        await Promise.race([
          registration.update(),
          new Promise(resolve => window.setTimeout(resolve, 1500)),
        ]);
      }
    }
  } catch (error) {
    console.warn('Unable to check for an app update before refreshing:', error);
  } finally {
    window.location.reload();
  }
};
