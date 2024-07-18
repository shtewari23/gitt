// pages/_app.tsx

import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css'; // Import global styles if you have any

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>My Next.js App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
