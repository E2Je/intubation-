import { useEffect, useRef, useState } from 'react';

/**
 * Polls version.json every 3 minutes.
 * Returns true when a newer build is available on the server.
 * Reloading the page loads the new JS while localStorage is preserved.
 */
export function useVersionCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const alreadyDetected = useRef(false);

  useEffect(() => {
    // 'dev' means local build without VITE_APP_VERSION — skip entirely
    if (__APP_BUILD__ === 'dev') return;

    const check = async () => {
      if (alreadyDetected.current) return;
      try {
        const res = await fetch(
          `${import.meta.env.BASE_URL}version.json?t=${Date.now()}`,
          { cache: 'no-store' }
        );
        if (!res.ok) return;
        const { v } = await res.json();
        if (v && v !== __APP_BUILD__) {
          alreadyDetected.current = true;
          setUpdateAvailable(true);
        }
      } catch {
        // Offline or network error — silent fail
      }
    };

    // First check after 15 seconds
    const initial = setTimeout(check, 15_000);
    // Then every 90 seconds
    const interval = setInterval(check, 90_000);

    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  return updateAvailable;
}
