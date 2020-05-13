import { useRef, useEffect, useCallback } from 'react';

export type Fn<T> = (...params: any[]) => T; 

const useFnRef = <T = any>(fn: Fn<T>) => {
  const ref = useRef<Fn<T>>();
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args) => {
    if (ref.current) {
      return ref.current(...args);
    }
  }, []);
};

export default useFnRef;
