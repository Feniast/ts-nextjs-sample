import { useRef } from 'react';
import Router from 'next/router';
import useUnmount from './useUnmount';
import useFnRef from './useFnRef';

const store: { [key: string]: any } = {};

const state = {
  popState: false,
  inited: false,
};

const initRouteHookListeners = () => {
  if (!state.inited && typeof window !== 'undefined') {
    Router.beforePopState(() => {
      state.popState = true;
      return true;
    });

    state.inited = true;
  }
};

const usePersistentScrollState = <T>(key: string, getScrollState: () => T) => {
  initRouteHookListeners();
  const keyRef = useRef(key);
  const getScrollStateRef = useFnRef(getScrollState);
  if (!key) {
    console.error('key cannot be empty');
  }

  keyRef.current = key;

  useUnmount(() => {
    state.popState = false;
    store[keyRef.current] = getScrollStateRef();
  });

  if (!state.popState) return null;
  return store[keyRef.current];
};

export default usePersistentScrollState;
