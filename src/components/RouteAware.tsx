import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import {
  setRoute,
  appendHistoryRoute,
  setBackFlag,
} from '@/store/actions/router';

const RouteAware: React.FC = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setRoute(Router.pathname));
  }, []);
  useEffect(() => {
    const onComplete = (url: string) => {
      dispatch(setRoute(url));
      dispatch(appendHistoryRoute());
      dispatch(setBackFlag(false));
    };
    Router.events.on('routeChangeComplete', onComplete);

    return () => {
      Router.events.off('routeChangeComplete', onComplete);
    };
  }, [dispatch]);
  return <>{props.children}</>;
};

export default RouteAware;
