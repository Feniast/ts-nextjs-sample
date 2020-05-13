import { useCallback } from 'react';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';
import useUnmount from './useUnmount';
import { fetcherFn, keyInterface, ConfigInterface, responseInterface } from 'swr/dist/types';
import { AnyAction } from 'redux';

const useReduxWiredSWR = <S, T>(
  key: keyInterface,
  fetcher: fetcherFn<S>,
  options: ConfigInterface<S, any>,
  selector: (state: T) => S,
  actionCreator: (data: S) => AnyAction
) : responseInterface<S, any> => {
  const initialData = useSelector(selector);
  const dispatch = useDispatch();
  const swrResult = useSWR(key, fetcher, {
    ...options,
    initialData,
  });

  useUnmount(
    useCallback(() => {
      dispatch(actionCreator(swrResult.data));
    }, [swrResult.data])
  );

  return swrResult;
};

export default useReduxWiredSWR;
