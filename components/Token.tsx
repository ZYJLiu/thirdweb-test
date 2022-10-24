import { useWallet } from "@solana/wallet-adapter-react"
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Container,
  AspectRatio,
  Box,
  BoxProps,
  forwardRef,
  Text,
  Image,
  VStack,
  Link,
} from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  useProgram,
  useNFTs,
  useMintNFT,
  useSDK,
} from "@thirdweb-dev/react/solana"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function Token() {
  const [image, setImage] = useState()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [symbol, setSymbol] = useState("")
  const [amount, setAmount] = useState(0)
  const [decimals, setDecimals] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [mint, setMint] = useState("")
  const { wallet } = useWallet()

  const sdk = useMemo(() => useSDK(), [wallet])
  const { data: myNftCollectionProgram } = useProgram(
    "88KmLboXkyCj5T4U4Jecn4WtQB9Cp6Dnqn8K5BXKiUC2",
    "nft-collection"
  )

  const handleImage = async (event: any) => {
    setImage(event.target.files[0])
  }

  const handleClick = async () => {
    setIsLoading(true)
    const metadata = {
      name: name,
      description: description,
      symbol: symbol,
      image: image,
      initialSupply: amount,
      decimals: decimals,
    }

    const mint = await sdk!.deployer.createToken(metadata)
    setMint(mint)
    console.log(mint)
    setIsLoading(false)
  }

  const link = () => {
    return mint
      ? `https://explorer.solana.com/address/${mint}?cluster=devnet`
      : ""
  }

  return (
    <div>
      {mint ? (
        <Link color="white" href={link()}>
          Success! Click Here
        </Link>
      ) : (
        <>
          {" "}
          {sdk?.wallet.isConnected ? (
            <VStack
              spacing={4}
              w={"full"}
              maxW={"md"}
              bg={useColorModeValue("white", "gray.700")}
              rounded={"xl"}
              boxShadow={"lg"}
              p={6}
              my={12}
            >
              <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
                Create Token
              </Heading>
              <Box position="relative" height="100%" width="100%">
                <FormControl isRequired>
                  <FormLabel>Token Name</FormLabel>
                  <Input
                    placeholder="Enter Token Name"
                    _placeholder={{ color: "gray.500" }}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <FormLabel>Symbol</FormLabel>
                  <Input
                    placeholder="Enter Symbol"
                    _placeholder={{ color: "gray.500" }}
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                  <FormLabel>Description</FormLabel>
                  <Input
                    placeholder="Enter Description"
                    _placeholder={{ color: "gray.500" }}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <FormLabel>Decimals</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter Decimals"
                    _placeholder={{ color: "gray.500" }}
                    onChange={(e) => setDecimals(Number(e.target.value))}
                  />
                  <FormLabel>Amount</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter Amount"
                    _placeholder={{ color: "gray.500" }}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <Container centerContent my="5">
                    <AspectRatio width="60" ratio={1}>
                      <Box
                        borderColor="gray.300"
                        borderStyle="dashed"
                        borderWidth="2px"
                        rounded="md"
                      >
                        <Box position="relative" height="100%" width="100%">
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            height="100%"
                            width="100%"
                            display="flex"
                            flexDirection="column"
                          >
                            {image ? (
                              <Image src={URL.createObjectURL(image)} />
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
                                  <Heading
                                    fontSize="lg"
                                    color="gray.500"
                                    fontWeight="bold"
                                  >
                                    Drop image here
                                  </Heading>
                                  <Text fontWeight="light">
                                    or click to upload
                                  </Text>
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
                      </Box>
                    </AspectRatio>
                  </Container>
                </FormControl>
              </Box>
              <Button
                variant="solid"
                colorScheme="green"
                rounded="button"
                width="150px"
                mb={2}
                isLoading={isLoading}
                onClick={() => handleClick()}
              >
                Create
              </Button>
            </VStack>
          ) : (
            <WalletMultiButton />
          )}
        </>
      )}

      {/* {mint ? <Link href={link()}>LINK</Link> : <></>} */}
    </div>
  )
}
