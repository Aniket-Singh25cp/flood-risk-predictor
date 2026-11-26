/**
 * useApi.js — Generic data-fetching hook.
 * Returns { data, loading, error, refetch }.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * @param {() => Promise<any>} fetcher - async function that returns data
 * @param {any[]} deps - dependency array (re-fetches when these change)
 */
export function useApi(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}
