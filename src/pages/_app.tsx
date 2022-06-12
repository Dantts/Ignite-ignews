import '../styles/global.scss';

import { SessionProvider } from 'next-auth/react';

import { Header } from '../components/Header';

import type { AppProps } from "next/app";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header /> <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
