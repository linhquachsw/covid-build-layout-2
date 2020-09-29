/* eslint-disable react/jsx-filename-extension */
// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  // static async getInitialProps(ctx) {
  //   const initialProps = await Document.getInitialProps(ctx);
  //   return { ...initialProps };
  // }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Avellino Coronavirus" />

          {/* <link rel="apple-touch-icon" sizes="57x57" href="/fav/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/fav/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/fav/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/fav/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/fav/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/fav/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/fav/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/fav/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/fav/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/fav/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png" /> */}
          <link rel="icon" type="image/png" sizes="80x80" href="/fav/favicon-80x80.png" />

          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-TileImage" content="/fav/ms-icon-144x144.png" />

          {/* manifest.json provides metadata used when your web app is installed on a
              user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/ */}
          <link rel="manifest" href="/manifest.json" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
