import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "../theme"
import type { AppProps } from "next/app"
import WalletContextProvider from "../components/ContextProvider"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
