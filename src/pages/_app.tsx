import React from 'react';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import flowRight from 'lodash/flowRight';
import withReduxStore from '@/lib/hoc/with-redux-store';
import withError from '@/lib/hoc/withError';
import theme from '@/styles/themes';
import GlobalStyles from '@/styles/global';
import RouteAware from '@/components/RouteAware';
import { Store } from '@/store';
import '../styles/index.scss';

type MyAppProps = { reduxStore: Store } & AppProps;

class MyApp extends App<MyAppProps> {
  static async getInitialProps(appCtx: AppContext) {
    const initialProps = await App.getInitialProps(appCtx);
    return initialProps;
  }

  constructor(props: MyAppProps) {
    super(props);
  }

  render() {
    const { Component, pageProps, reduxStore, router } = this.props;
    return (
      <Provider store={reduxStore}>
        <ThemeProvider theme={theme}>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              onError: (e) => {
                console.error(e);
              },
            }}
          >
            <RouteAware>
              <GlobalStyles />
              <Head>
                <title>TS NextJS Sample App</title>
              </Head>
              <Component {...pageProps} />
            </RouteAware>
          </SWRConfig>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default flowRight([withError, withReduxStore])(MyApp);
