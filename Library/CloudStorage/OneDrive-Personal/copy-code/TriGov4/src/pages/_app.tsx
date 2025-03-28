import type { AppProps } from 'next/app';
import React from 'react';
import '../app/globals.css'; // Ensure global styles are imported

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />
}

export default MyApp 