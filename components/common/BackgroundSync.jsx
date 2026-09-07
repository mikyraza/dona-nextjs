'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function BackgroundSync() {
  const router = useRouter();
  const lastCheckTimeRef = useRef(0);
  const lastKnownModifiedRef = useRef(0);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    // 1. Trigger background refresh safely without cascading renders
    const triggerRefresh = () => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      try {
        router.refresh();
      } finally {
        setTimeout(() => {
          isRefreshingRef.current = false;
        }, 1500);
      }
    };

    // 2. Instant Cross-Tab Sync via BroadcastChannel (0 network overhead, 0ms latency)
    let channel = null;
    try {
      channel = new BroadcastChannel('dona_live_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'CONTENT_UPDATED') {
          triggerRefresh();
        }
      };
    } catch (e) {}

    // 3. Instant Cross-Window Sync via localStorage storage events (0 network overhead)
    const handleStorage = (e) => {
      if (e.key === 'dona_content_updated') {
        triggerRefresh();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. On-demand revalidation ONLY when user refocuses tab after being away (> 60s)
    // No periodic intervals, eliminating repetitive network requests while reading
    const handleFocusOrVisibility = () => {
      if (document.visibilityState === 'hidden') return;

      const now = Date.now();
      // Throttle: at most once every 60 seconds on tab refocus
      if (now - lastCheckTimeRef.current < 60000) return;
      lastCheckTimeRef.current = now;

      fetch('/api/sync-check', { cache: 'no-cache' })
        .then(res => {
          if (res.status === 304) return null;
          return res.json();
        })
        .then(data => {
          if (data?.lastModified) {
            if (lastKnownModifiedRef.current && data.lastModified > lastKnownModifiedRef.current) {
              lastKnownModifiedRef.current = data.lastModified;
              triggerRefresh();
            } else {
              lastKnownModifiedRef.current = data.lastModified;
            }
          }
        })
        .catch(() => {});
    };

    window.addEventListener('focus', handleFocusOrVisibility);
    document.addEventListener('visibilitychange', handleFocusOrVisibility);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocusOrVisibility);
      document.removeEventListener('visibilitychange', handleFocusOrVisibility);
    };
  }, [router]);

  return null;
}
