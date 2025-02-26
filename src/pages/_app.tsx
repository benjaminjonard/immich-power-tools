import RootLayout from "@/components/layouts/RootLayout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { ENV } from "@/config/environment";
import ConfigContext from "@/contexts/ConfigContext";
import { useEffect, useRef, useState } from "react";
import { getMe } from "@/handlers/api/user.handler";
import { db } from "@/config/db";

interface AppPropsWithProps extends AppProps {
  props: {
    immichURL: string;
    exImmichUrl: string;
  };
}
const App = ({ Component, pageProps, ...props }: AppPropsWithProps) => {
  const intialData = useRef(props.props);

  return (
    <ConfigContext.Provider value={intialData.current}>
      <ThemeProvider attribute="class" storageKey="theme">
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </ThemeProvider>
    </ConfigContext.Provider>
  );
};

App.getInitialProps = async () => {
  return {
    props: {
      exImmichUrl: ENV.EXTERNAL_IMMICH_URL,
      immichURL: ENV.IMMICH_URL,
    },
  };
};

export default App;
