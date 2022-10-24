//ngrok http 3000
import { VStack, Text } from "@chakra-ui/react"
import { useEffect, useState, useCallback } from "react"

const XNft = () => {
  const [publicKey, setPublicKey] = useState(null)

  useEffect(() => {
    //@ts-ignore
    if (typeof window.xnft !== "undefined") {
      //@ts-ignore
      setPublicKey(window.xnft.solana.publicKey)
    }
  }, [])

  return (
    <div>
      {publicKey && (
        <VStack margin="3">
          <Text color="white">PublicKey</Text>
          <Text color="white" margin="3">
            {publicKey.toString().substring(0, 4)}...
            {publicKey.toString().substring(publicKey.toBase58().length - 4)}
          </Text>
        </VStack>
      )}
    </div>
  )
}

export default XNft
