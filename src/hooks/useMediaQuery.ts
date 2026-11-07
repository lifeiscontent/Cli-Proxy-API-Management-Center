/**
 * 媒体查询 Hook
 */

import { useCallback, useSyncExternalStore } from 'react';

/** Matches `$breakpoint-mobile` and the `mobile` mixin in src/styles. */
export const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query]
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}
