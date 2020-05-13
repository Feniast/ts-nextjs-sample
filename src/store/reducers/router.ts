import { handleActions, Action } from 'redux-actions';
import {
  SET_ROUTE,
  SET_BACK_FLAG,
  SET_HISTORY_ROUTES,
} from '../actions/router';
import { Reducer } from 'redux';

export interface RouterState {
  prevRoute?: string;
  route?: string;
  backFlag?: boolean;
  historyRoutes?: string[];
}

const routerReducer: Reducer<RouterState, Action<any>> = handleActions<RouterState, any>(
  {
    [SET_ROUTE]: (state: RouterState, action: Action<string>) => ({
      ...state,
      prevRoute: state.route,
      route: action.payload,
    }),
    [SET_BACK_FLAG]: (state: RouterState, action: Action<boolean>) => ({
      ...state,
      backFlag: action.payload,
    }),
    [SET_HISTORY_ROUTES]: (state: RouterState, action: Action<string[]>) => ({
      ...state,
      historyRoutes: action.payload,
    }),
  },
  {
    prevRoute: null,
    route: null,
    backFlag: false,
    historyRoutes: [],
  }
);

export default routerReducer;
