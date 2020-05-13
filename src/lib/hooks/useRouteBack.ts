import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setBackFlag, setHistoryRoutes } from '@/store/actions/router';
import { useRouter } from 'next/router';
import { useSelector } from '@/store';

const useRouteBack = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const historyRoutes = useSelector(state => state.router.historyRoutes);
  const goBack = useCallback(() => {
    dispatch(setBackFlag(true));
    if (historyRoutes.length > 0) {
      router.back();
      dispatch(setHistoryRoutes(historyRoutes.slice(1)));
    } else {
      router.push('/');
    }
  }, [dispatch, router, historyRoutes]);

  return goBack;
};

export default useRouteBack;
