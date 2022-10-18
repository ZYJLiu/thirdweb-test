import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import type { NextPage } from "next"
import {
  useProgram,
  useNFTs,
  useMintNFT,
  useSDK,
} from "@thirdweb-dev/react/solana"
import {
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Box,
  Text,
  Image,
  VStack,
  HStack,
} from "@chakra-ui/react"
import { useCallback, useState, useMemo } from "react"
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import dotenv from "dotenv"
dotenv.config()
import * as fs from "fs"
import Claim from "../components/Claim"
import Collection from "../components/Collection"

import dynamic from "next/dynamic"
const XNft = dynamic(() => import("../components/XNFT"), { ssr: false })

require("@solana/wallet-adapter-react-ui/styles.css")

const Home: NextPage = () => {
  const [image, setImage] = useState()
  const { wallet } = useWallet()

  const sdk = useMemo(() => useSDK(), [wallet])
  // const sdk = ThirdwebSDK.fromPrivateKey(
  //   "devnet",
  //   process.env.NEXT_PUBLIC_PRIVATE_KEY!
  // )
  // console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY)
  // console.log("test", sdk?.wallet.getAddress())
  // console.log("test", sdk?.wallet.isConnected)
  // console.log("sdk", sdk)
  const { data: myNftCollectionProgram } = useProgram(
    "88KmLboXkyCj5T4U4Jecn4WtQB9Cp6Dnqn8K5BXKiUC2",
    "nft-collection"
  )

  const { data: myNfts } = useNFTs(myNftCollectionProgram)
  console.log("program", myNftCollectionProgram)
  console.log("nfts", myNfts)

  const {
    mutate: mintNFT,
    isLoading,
    isSuccess,
    error,
  } = useMintNFT(myNftCollectionProgram)

  const handleImage = async (event: any) => {
    setImage(event.target.files[0])
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <VStack>
        <XNft />
        <HStack>
          <Image src="/thirdweb.svg" height={75} width={115} />
          <Image width={75} height={75} src="/sol.png" />
        </HStack>
        {/* <WalletMultiButton /> */}
        <Collection />
        <Claim />
        {/* {sdk?.wallet.isConnected ? (
          <VStack>
            <Box position="relative" height="100%" width="100%">
              <Box
                top="0"
                left="0"
                height="100%"
                width="100%"
                display="flex"
                flexDirection="column"
              >
                {image ? (
                  <Image
                    width="200px"
                    borderRadius="25px"
                    src={URL.createObjectURL(image)}
                  />
                ) : (
                  <Stack
                    height="100%"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justify="center"
                    spacing="4"
                  >
                    <Stack p="8" textAlign="center" spacing="1">
                      <Heading fontSize="lg" color="white" fontWeight="bold">
                        Drop image here
                      </Heading>
                      <Text fontWeight="light">or click to upload</Text>
                    </Stack>
                  </Stack>
                )}
              </Box>
              <Input
                type="file"
                height="100%"
                width="100%"
                position="absolute"
                top="0"
                left="0"
                opacity="0"
                aria-hidden="true"
                accept="image/*"
                onChange={handleImage}
              />
            </Box>
            <Button
              variant="solid"
              colorScheme="green"
              rounded="button"
              width="150px"
              mb={2}
              isLoading={isLoading}
              onClick={() =>
                mintNFT({
                  metadata: {
                    name: "name",
                    description: "description",
                    image: image,
                  },
                  to: sdk?.wallet.getAddress(),
                  // to: window.xnft.solana.publicKey,
                })
              }
            >
              Mint
            </Button>
          </VStack>
        ) : (
          <WalletMultiButton />
        )}
        {isSuccess ? <Text>Success</Text> : <></>} */}
      </VStack>
    </Flex>
  )
}

export default Home
