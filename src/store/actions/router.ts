import { createAction, Action } from 'redux-actions';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '@/store';

export const SET_ROUTE = 'SET_ROUTE';

export const SET_BACK_FLAG = 'SET_BACK_FLAG';

export const SET_HISTORY_ROUTES = 'SET_HISTORY_ROUTES';

export const setRoute = createAction(SET_ROUTE);

export const setBackFlag = createAction(SET_BACK_FLAG);

export const setHistoryRoutes = createAction(SET_HISTORY_ROUTES);

export const appendHistoryRoute = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<any>
> => (dispatch, getState) => {
  const { historyRoutes, backFlag, prevRoute } = getState().router;
  if (!backFlag) {
    if (historyRoutes[0] !== prevRoute) {
      const newHistoryRoutes = [prevRoute, ...historyRoutes];
      dispatch(setHistoryRoutes(newHistoryRoutes));
    }
  }
};
