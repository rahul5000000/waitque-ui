import { useEffect, useState } from 'react';
import { Platform, Linking } from 'react-native';

type QueryParams = Record<string, string | null>;

export function useQueryParams(): QueryParams {
  const [queryParams, setQueryParams] = useState<QueryParams>({});

  const parseQueryParams = (url: string): QueryParams => {
    try {
      if (Platform.OS === 'web') {
        const params = new URLSearchParams(window.location.search);
        const entries: QueryParams = {};
        params.forEach((value, key) => {
          entries[key] = value;
        });
        return entries;
      } else {
        // Mobile: parse the query string from the URL manually
        const queryStart = url.indexOf('?');
        if (queryStart === -1) return {};

        const queryString = url.slice(queryStart + 1);
        const params = new URLSearchParams(queryString);
        const entries: QueryParams = {};
        params.forEach((value, key) => {
          entries[key] = value;
        });
        return entries;
      }
    } catch (err) {
      console.warn('Failed to parse query params:', err);
      return {};
    }
  };

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;
      const params = parseQueryParams(url);
      setQueryParams(params);
    };

    // 1️⃣ Cold start
    if (Platform.OS === 'web') {
      handleUrl(window.location.href);
    } else {
      Linking.getInitialURL().then(handleUrl);
    }

    // 2️⃣ Listen for incoming links (mobile)
    if (Platform.OS !== 'web') {
      const listener = ({ url }: { url: string }) => handleUrl(url);
      const subscription = Linking.addEventListener('url', listener);
      return () => subscription.remove();
    }
  }, []);

  return queryParams;
}
