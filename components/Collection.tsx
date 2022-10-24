import { useWallet } from "@solana/wallet-adapter-react"
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
import { useEffect, useMemo, useState } from "react"
import {
  useProgram,
  useNFTs,
  useMintNFT,
  useSDK,
} from "@thirdweb-dev/react/solana"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

// note minting to collection only works with wallet that is the update authority to the "collection" NFT
// other wallets cannot mint to collection
export default function Collection() {
  const { wallet, publicKey } = useWallet()
  const [image, setImage] = useState()
  const sdk = useMemo(() => useSDK(), [wallet])

  // get "collection" NFT
  const { data: myNftCollectionProgram } = useProgram(
    "88KmLboXkyCj5T4U4Jecn4WtQB9Cp6Dnqn8K5BXKiUC2",
    "nft-collection"
  )

  // get NFTs from "collection"
  const { data: myNfts } = useNFTs(myNftCollectionProgram)

  // mint new NFT to "collection", only works with upgrade authority of "collection" NFT
  const {
    mutate: mintNFT,
    isLoading,
    isSuccess,
    error,
  } = useMintNFT(myNftCollectionProgram)

  // upload image
  const handleImage = async (event: any) => {
    setImage(event.target.files[0])
  }

  return (
    <div>
      {sdk?.wallet.isConnected ? (
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
                // to: sdk?.wallet.getAddress(),
                //@ts-ignore
                to: window.xnft.solana.publicKey || publicKey,
                // to: publicKey,
              })
            }
          >
            Create NFT
          </Button>
        </VStack>
      ) : (
        <WalletMultiButton />
      )}
      {isSuccess ? <Text align={"center"}>Success</Text> : <></>}
    </div>
  )
}
