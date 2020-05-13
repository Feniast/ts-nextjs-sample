import { useState, useRef, useCallback } from 'react';

export type GetState<T> = () => T;

export type UpdateState<T> = (
  newState: Partial<T>,
  shouldRerender?: boolean
) => void;

const useStateRef = <S extends { [key: string]: any }>(
  initialState: S
): [GetState<S>, UpdateState<S>] => {
  const [, rerender] = useState();
  const state = useRef(initialState);
  const updateState = useCallback(
    (newState: Partial<S>, shouldRerender: boolean = true) => {
      for (let key in newState) {
        state.current[key] = newState[key];
      }
      if (shouldRerender) rerender({});
    },
    []
  );

  const getState = useCallback(() => state.current, []);

  return [getState, updateState];
};

export default useStateRef;
