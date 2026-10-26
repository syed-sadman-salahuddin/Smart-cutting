import { useCallback } from 'react';
import { useStorage } from './useStorage';

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

export function useCollection(key) {
  const [stored, setStored] = useStorage(key, []);
  const items = asList(stored);

  const add = useCallback(
    (values) => {
      const record = {
        ...values,
        id: makeId(),
        createdAt: new Date().toISOString(),
      };
      setStored((current) => [...asList(current), record]);
      return record;
    },
    [setStored]
  );

  const update = useCallback(
    (id, changes) => {
      setStored((current) =>
        asList(current).map((item) =>
          item.id === id ? { ...item, ...changes, updatedAt: new Date().toISOString() } : item
        )
      );
    },
    [setStored]
  );

  const remove = useCallback(
    (id) => {
      setStored((current) => asList(current).filter((item) => item.id !== id));
    },
    [setStored]
  );

  return { items, add, update, remove };
}