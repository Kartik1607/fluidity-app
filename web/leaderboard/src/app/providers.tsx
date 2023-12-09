"use client";

import * as React from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ApolloProvider } from "@apollo/client";
import { client } from "./utils/client";
import { ChainContextProvider } from "./queries/ChainContext";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <ApolloProvider client={client}>
      <ChainContextProvider>
        <WagmiConfig config={config}>{mounted && children}</WagmiConfig>
      </ChainContextProvider>
    </ApolloProvider>
  );
}
