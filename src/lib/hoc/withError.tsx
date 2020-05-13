import React from 'react';
import ErrorPage from 'next/error';
import { AppComponent } from '@/types/app';
import { AppContext } from 'next/app';

interface ErrorProps {
  statusCode: number;
  errorTitle: string;
};

const withErrorApp = <P,>(App: AppComponent<P>) => {
  return class WithError extends React.Component<P & ErrorProps> {
    static async getInitialProps(appCtx: AppContext) {
      const ctx = appCtx.ctx;
      try {
        let props = {} as ErrorProps;
        if (typeof App.getInitialProps === 'function') {
          props = await App.getInitialProps(appCtx);
        }
        if (props.statusCode && ctx.res) {
          ctx.res.statusCode = props.statusCode;
        }
        return props;
      } catch (e) {
        console.error(e);
        let statusCode = e.statusCode || 500;
        ctx.res && (ctx.res.statusCode = statusCode);
        return {
          statusCode,
          errorTitle: e.message,
        };
      }
    }
    render() {
      if (this.props.statusCode) {
        return (
          <ErrorPage
            statusCode={this.props.statusCode}
            title={this.props.errorTitle}
          />
        );
      }
      return <App {...this.props} />;
    }
  };
};

export default withErrorApp;
