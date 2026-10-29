'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'debuglab-theme';

function read(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Dark by default, following the system setting until the viewer chooses. The
 * initial value is applied before paint by the inline script in app/layout.tsx;
 * this hook only keeps React in sync and handles the toggle.
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(read());
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      if (!document.documentElement.dataset.theme) setTheme(read());
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private windows throw. The toggle still works for this session.
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}
