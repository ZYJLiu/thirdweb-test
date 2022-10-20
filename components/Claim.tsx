import { useProgram, useClaimNFT } from "@thirdweb-dev/react/solana"
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
import { useEffect, useMemo, useState, useCallback } from "react"

export default function Claim() {
  const [wallet, setWallet] = useState(null)
  const [nft, setNft] = useState<any>()
  const [mint, setMint] = useState<any>()

  useEffect(() => {
    if (typeof window.xnft !== "undefined") {
      setWallet(window.xnft.solana)
    }
  }, [])

  const { program } = useProgram(
    "53UTAfjzdtVN6wZw5oad1NBBZcUEtqboYc17Zcn5s94W",
    "nft-drop"
  )
  // using the useClaimNFT hook here
  const {
    mutateAsync: claim,
    isLoading,
    isSuccess,
    error,
  } = useClaimNFT(program)

  const handleClick = async () => {
    const mint = await claim({ amount: 1 })
    console.log("mint", mint[0])
    const nft = await program.get(mint[0])
    console.log("nft", nft)
    setNft(nft)
  }

  return (
    <VStack>
      {nft ? (
        <Image width="200px" borderRadius="25px" src={nft.metadata.image} />
      ) : (
        <></>
      )}

      {wallet ? (
        // Calling the claim function and passing in the quantity we are claiming

        <Button
          variant="solid"
          colorScheme="green"
          rounded="button"
          width="150px"
          mb={2}
          isLoading={isLoading}
          // onClick={() => claim({ amount: 1 })}
          onClick={() => handleClick()}
        >
          CM
        </Button>
      ) : (
        <Text>Backpack Not Connected</Text>
      )}
      {isSuccess ? <Text align={"center"}>Success</Text> : <></>}
    </VStack>
  )
}
