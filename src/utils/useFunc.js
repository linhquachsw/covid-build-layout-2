import { useState, useCallback } from 'react';

export function useFunc(fn) {
  const [val, setVal] = useState(() => fn);
  // eslint-disable-next-line no-shadow
  const setFunc = useCallback((fn) => {
    setVal(() => fn);
  }, []);
  return [val, setFunc];
}
