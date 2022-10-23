import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "../theme"
import type { AppProps } from "next/app"
import WalletContextProvider from "../components/ContextProvider"
import Navbar from "../components/Navbar"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <Navbar />
        <Component {...pageProps} />
      </WalletContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
