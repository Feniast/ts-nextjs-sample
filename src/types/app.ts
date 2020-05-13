import { NextPageContext } from "next";
import { Store } from "redux";
import { AppContext } from "next/app";

export interface PageComponentContext extends NextPageContext {
  reduxStore?: Store
}

export type AppComponent<P> = React.ComponentType<P> & {
  getInitialProps: (ctx: AppContext) => any
}

export interface EnhancedAppContext extends AppContext {
  ctx: PageComponentContext
}