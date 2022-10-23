import { useProgram, useClaimNFT } from "@thirdweb-dev/react/solana"
import { Button, Heading, Text, Image, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { candyMachineAddress } from "../utils/constants"
import DisplayCandyMachine from "./DisplayCandyMachine"

export default function Claim() {
  const [wallet, setWallet] = useState(null)
  const [nft, setNft] = useState<any>()

  useEffect(() => {
    //@ts-ignore
    if (typeof window.xnft !== "undefined") {
      //@ts-ignore
      setWallet(window.xnft.solana)
    }
  }, [])

  const { program } = useProgram(candyMachineAddress.toString(), "nft-drop")
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
      <Heading color="white" noOfLines={1} textAlign="center">
        Candy Machine
      </Heading>
      {nft ? (
        <Image
          borderRadius="25px"
          boxSize="200px"
          width="200px"
          src={nft.metadata.image}
          padding="10px"
        />
      ) : (
        <DisplayCandyMachine />
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
          onClick={() => handleClick()}
        >
          Mint
        </Button>
      ) : (
        <Text>Backpack Not Connected</Text>
      )}
      {isSuccess ? <Text align={"center"}>Success</Text> : <></>}
    </VStack>
  )
}
