/**
 * useHealth.js — Polls GET /health every 30 s.
 * Returns { status: 'online' | 'offline' | 'checking', modelVersion }
 */

import { useState, useEffect, useRef } from 'react';
import { fetchHealth } from '../services/api.js';

const POLL_INTERVAL = 30_000; // 30 s

export function useHealth() {
  const [state, setState] = useState({ status: 'checking', modelVersion: null });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function check() {
      try {
        const data = await fetchHealth();
        if (mounted.current) {
          setState({ status: 'online', modelVersion: data?.model_version ?? null });
        }
      } catch {
        if (mounted.current) {
          setState({ status: 'offline', modelVersion: null });
        }
      }
    }

    check();
    const id = setInterval(check, POLL_INTERVAL);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, []);

  return state;
}
