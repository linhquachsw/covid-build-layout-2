/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-filename-extension */
// @flow
import 'App/styles/style.scss';

import React, { Suspense } from 'react';
import App from 'next/app';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppLayout, AppSecure } from 'App/components/layout/appLayout';
import { withRedux } from '@next-zero/framework/redux';
import makeStore from 'App/redux-flow/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NS_COMMON } from 'App/share/i18next';
// import { NotificationSystem } from 'App/components/layout/notifications';
import { PageLoader } from 'App/components/loader';

class MyApp extends App<AppProps> {
  constructor(props: AppProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // componentDidCatch(error, errorInfo) {
  //   // eslint-disable-next-line no-console
  //   console.log('CUSTOM ERROR HANDLING', error);
  //   // This is needed to render errors correctly in development / production
  //   super.componentDidCatch(error, errorInfo);
  // }

  render() {
    const {
      Component,
      store,
      router: {
        query: { isPrint },
      },
    } = this.props;

    const { noLayout } = Component.getInitialProps ? Component.getInitialProps() : {};

    return (
      <>
        <Head>
          <title>Avellino Coronavirus</title>
        </Head>

        <Provider store={store}>
          <PersistGate persistor={store.__persistor} loading={<PageLoader />}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout noLayout={noLayout || !!isPrint}>
                <AppSecure tag={Component} namespacesRequired={[NS_COMMON]} />
              </AppLayout>

              {/* <NotificationSystem /> */}
            </Suspense>
          </PersistGate>
        </Provider>
      </>
    );
  }
}
// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (ctxPage: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(ctxPage);
//   appProps.namespacesRequired = ['common'];

//   const { tokenEHS } = nextCookie(ctxPage.ctx);

//   // If there's no token, it means the user is not logged in.
//   if (!tokenEHS && !ctxPage.Component.noSecure) {
//     const loginUrl = '/account/sign-in';

//     // if (isServer()) {
//     //   ctxPage.ctx.res.writeHead(302, { Location: loginUrl });
//     //   ctxPage.ctx.res.end();
//     // } else {
//     ctxPage.router.push(loginUrl);
//     // }
//   }

//   if (tokenEHS && isServer()) {
//     // console.log(global.pathnames);
//   }

//   return { ...appProps, namespacesRequired: ['common'] };
// };

export default withRedux(makeStore)(MyApp);
