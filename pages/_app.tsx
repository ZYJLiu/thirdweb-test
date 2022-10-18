import React, { FC, useMemo } from "react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { ThirdwebProvider } from "@thirdweb-dev/react/solana"
import { Network } from "@thirdweb-dev/sdk/solana"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  BackpackWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "../theme"
import type { AppProps } from "next/app"

// Change the network to the one you want to use: "mainnet-beta", "testnet", "devnet", "localhost" or your own RPC endpoint
const network: Network = "devnet"

const wallets = [new BackpackWalletAdapter(), new PhantomWalletAdapter()]

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider network={network} wallets={wallets} autoConnect>
      <WalletModalProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletModalProvider>
    </ThirdwebProvider>
  )
}

export default MyApp
