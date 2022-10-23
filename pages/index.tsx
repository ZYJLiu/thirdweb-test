import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import type { NextPage } from "next"
import { Flex, Image, VStack, HStack } from "@chakra-ui/react"
import dotenv from "dotenv"
dotenv.config()
import Claim from "../components/Claim"
import Collection from "../components/Collection"
import Token from "../components/Token"
import DisplayNfts from "../components/DisplayNfts"
import Test from "../components/Test"

import dynamic from "next/dynamic"
const XNft = dynamic(() => import("../components/XNFT"), { ssr: false })

require("@solana/wallet-adapter-react-ui/styles.css")

const Home: NextPage = () => {
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <VStack>
        <XNft />
        <HStack>
          <Image src="/thirdweb.svg" height={75} width={115} />
          <Image src="/sol.png" width={75} height={75} />
        </HStack>
        {/* <WalletMultiButton /> */}
        {/* <Token /> */}
        {/* <Collection /> */}

        {/* <Claim /> */}
        <DisplayNfts />
        {/* <Test /> */}
      </VStack>
    </Flex>
  )
}

export default Home
