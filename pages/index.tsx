import type { NextPage } from "next"
import { Flex, Image, VStack, HStack } from "@chakra-ui/react"
import dotenv from "dotenv"
dotenv.config()
import Claim from "../components/Claim"
import DisplayNfts from "../components/DisplayNfts"

import dynamic from "next/dynamic"
const XNft = dynamic(() => import("../components/XNFT"), { ssr: false })

require("@solana/wallet-adapter-react-ui/styles.css")

const Home: NextPage = () => {
  return (
    <Flex
      alignContent="center"
      justifyContent="center"
      width="100%"
      backgroundColor="gray.800"
      minHeight="100vh"
    >
      <VStack>
        <XNft />
        <HStack>
          <Image src="/thirdweb.svg" height={75} width={115} />
          <Image src="/sol.png" width={75} height={75} />
        </HStack>

        <Claim />
        <DisplayNfts />
      </VStack>
    </Flex>
  )
}

export default Home
