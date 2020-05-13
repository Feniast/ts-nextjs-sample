import React from 'react';
import PropTypes from 'prop-types';
import configureStore, { Store } from '@/store';
import { AppComponent, EnhancedAppContext } from '@/types/app';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState?: any): Store {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return configureStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = configureStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
}

const withReduxStore = <P extends { reduxStore: Store }>(
  WrappedApp: AppComponent<P>
) => {
  type IProps = P & { initialReduxState: object };
  return class WithReduxStoreApp extends React.Component<IProps> {
    private reduxStore: Store;

    static async getInitialProps(appContext: EnhancedAppContext) {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrCreateStore();

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (typeof WrappedApp.getInitialProps === 'function') {
        appProps = await WrappedApp.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      };
    }

    static propTypes = {
      initialReduxState: PropTypes.object,
    };

    constructor(props: IProps) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      return <WrappedApp {...this.props} reduxStore={this.reduxStore} />;
    }
  };
};

export default withReduxStore;
