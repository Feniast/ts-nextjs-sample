import { useEffect, useRef, useCallback } from 'react';
import useFnRef from './useFnRef';

const useDebounceFn = (fn: (...args: any) => any, delay = 5000) => {
  const callback = useFnRef(fn);
  const timer = useRef<number>();

  const debouncedFn = useCallback((...args) => {
    if (timer.current) {
      clearTimeout(timer.current); 
    }
    timer.current = setTimeout(() => {
      callback(...args);
      timer.current = null;
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    }
  }, []);

  return debouncedFn;
};

export default useDebounceFn;
