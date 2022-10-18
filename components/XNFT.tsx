//ngrok http 3000
import {
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  FormLabel,
  useDisclosure,
  Text,
  Heading,
} from "@chakra-ui/react"
import { useEffect, useState, useCallback } from "react"

import { useWallet } from "@solana/wallet-adapter-react"

import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js"

const XNft = () => {
  const [publicKey, setPublicKey] = useState(null)

  useEffect(() => {
    if (typeof window.xnft !== "undefined") {
      // console.log("testing", window.xnft)
      setPublicKey(window.xnft.solana.publicKey)
    }
  }, [])

  return (
    <div>
      {publicKey && (
        <VStack margin="3">
          <Text>PublicKey</Text>
          <Text margin="3">
            {publicKey.toString().substring(0, 4)}...
            {publicKey.toString().substring(publicKey.toBase58().length - 4)}
          </Text>
        </VStack>
      )}
    </div>
  )
}

export default XNft