"use client";

import "./globals.css";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { apolloClient } from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, fab);
config.autoAddCss = false;

import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

import Header from '@/components/common/header';
import Footer from "@/components/common/footer";

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <SpeedInsights />
      <body>
        <SessionProvider>
          <ApolloProvider client={apolloClient}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Header />
                {children}
                <Footer />
              </PersistGate>
            </Provider>
          </ApolloProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
