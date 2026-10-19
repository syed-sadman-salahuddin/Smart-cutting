import { useCallback, useEffect, useRef, useState } from 'react';
import { readJSON, writeJSON, STORAGE_EVENT } from '../services/storage';

export function useStorage(key, fallback) {
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState(() => readJSON(key, fallback));

  useEffect(() => {
    const reload = () => setValue(readJSON(key, fallbackRef.current));
    const onSameTab = (e) => {
      if (e.detail?.key === key) reload();
    };
    const onOtherTab = (e) => {
      if (e.key === key || e.key === null) reload();
    };
    window.addEventListener(STORAGE_EVENT, onSameTab);
    window.addEventListener('storage', onOtherTab);
    return () => {
      window.removeEventListener(STORAGE_EVENT, onSameTab);
      window.removeEventListener('storage', onOtherTab);
    };
  }, [key]);

  const update = useCallback(
    (next) => {
      const current = readJSON(key, fallbackRef.current);
      writeJSON(key, typeof next === 'function' ? next(current) : next);
    },
    [key]
  );

  return [value, update];
}