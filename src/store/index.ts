import {
  createStore,
  applyMiddleware,
  compose,
  Reducer,
  StoreEnhancer,
  PreloadedState,
  StoreEnhancerStoreCreator,
  Action,
  AnyAction,
} from 'redux';
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux'; 
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const composeEnhancers: <StoreExt, StateExt>(
  ...funcs: Array<StoreEnhancer<StoreExt>>
) => StoreEnhancer<StoreExt> =
  process.env.NODE_ENV !== 'production' ? composeWithDevTools : compose;

const round = (number: number) => Math.round(number * 100) / 100;

const isServer = typeof window === 'undefined';

const now = () => (isServer ? Date.now() : performance.now());

const monitorReducerEnhancer: StoreEnhancer = (
  createStore: StoreEnhancerStoreCreator
): StoreEnhancerStoreCreator => <S = any, A extends Action = AnyAction>(
  reducer: Reducer<S, A>,
  initialState: PreloadedState<S>
) => {
  const monitoredReducer = (state: S, action: A) => {
    const start = now();
    const newState = reducer(state, action);
    const end = now();
    const diff = round(end - start);

    console.log('reducer process time:', diff);

    return newState;
  };

  return createStore(monitoredReducer, initialState);
};

export default function configureStore(initialState: any) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers: StoreEnhancer[] = [middlewareEnhancer];
  if (process.env.NODE_ENV === 'development') {
    enhancers.unshift(monitorReducerEnhancer);
  }

  const composedEnhancers = composeEnhancers(...enhancers);

  return createStore(rootReducer, initialState, composedEnhancers);
}

export type RootState = ReturnType<typeof rootReducer>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export type Store = ReturnType<typeof configureStore>;
