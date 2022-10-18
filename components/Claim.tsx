import { useWallet } from "@solana/wallet-adapter-react"
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
import { useEffect, useState } from "react"

export default function Claim() {
  const [wallet, setWallet] = useState(null)

  useEffect(() => {
    if (typeof window.xnft !== "undefined") {
      // console.log("testing", window.xnft)
      setWallet(window.xnft.solana)
    }
  }, [])

  // Add the address of the contract you deployed earilier on
  const programAddress = "7jU8Wu4ZHEU81FdZLsZNLE3pwWAnfjhAbe6PPbdANBzR"
  // Pasting the programAddress variable and the type of contract
  const { program } = useProgram(programAddress)
  // using the useClaimNFT hook here
  const {
    mutateAsync: claim,
    isLoading,
    isSuccess,
    error,
  } = useClaimNFT(program)

  const handleClick = async () => {
    const test = await claim({ amount: 1 })
    console.log(test)
  }

  return (
    <div>
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
      {isSuccess ? (
        <Text align={"center"} justify={"center"}>
          Success
        </Text>
      ) : (
        <></>
      )}
    </div>
  )
}
