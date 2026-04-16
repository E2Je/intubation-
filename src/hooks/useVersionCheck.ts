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
    // Only run in production (GitHub Pages)
    if (import.meta.env.DEV) return;

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

    // First check after 1 minute (give user time to start working)
    const initial = setTimeout(check, 60_000);
    // Then every 3 minutes
    const interval = setInterval(check, 3 * 60_000);

    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  return updateAvailable;
}
