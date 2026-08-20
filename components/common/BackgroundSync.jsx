'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function BackgroundSync() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const lastKnownModifiedRef = useRef(0);
  const isRefreshingRef = useRef(false);

  // Trigger seamless background refresh
  const triggerBackgroundRefresh = () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    startTransition(() => {
      router.refresh();
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 1000);
    });
  };

  useEffect(() => {
    // 1. Listen to BroadcastChannel for instant cross-tab / admin notifications
    let channel = null;
    try {
      channel = new BroadcastChannel('dona_live_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'CONTENT_UPDATED') {
          triggerBackgroundRefresh();
        }
      };
    } catch (e) {
      // BroadcastChannel fallback
    }

    // 2. Listen to localStorage storage events
    const handleStorage = (e) => {
      if (e.key === 'dona_content_updated') {
        triggerBackgroundRefresh();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Listen to window focus & visibility changes (e.g. user switching from Admin tab back to User section)
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetch('/api/sync-check', { cache: 'no-store' })
          .then(res => res.json())
          .then(data => {
            if (data?.lastModified) {
              if (lastKnownModifiedRef.current && data.lastModified > lastKnownModifiedRef.current) {
                lastKnownModifiedRef.current = data.lastModified;
                triggerBackgroundRefresh();
              } else {
                lastKnownModifiedRef.current = data.lastModified;
              }
            }
          })
          .catch(() => {});
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    // 4. Lightweight background polling (every 4 seconds)
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'hidden') return;

      fetch('/api/sync-check', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data?.lastModified) {
            if (lastKnownModifiedRef.current === 0) {
              lastKnownModifiedRef.current = data.lastModified;
            } else if (data.lastModified > lastKnownModifiedRef.current) {
              lastKnownModifiedRef.current = data.lastModified;
              triggerBackgroundRefresh();
            }
          }
        })
        .catch(() => {});
    }, 4000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(intervalId);
    };
  }, [router, pathname]);

  return null;
}
