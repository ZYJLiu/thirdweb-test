import { useState, useEffect } from "react"
import { Button, HStack, VStack, Image } from "@chakra-ui/react"
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons"
import { candyMachineAddress } from "../utils/constants"
import { useProgram } from "@thirdweb-dev/react/solana"

export default function DisplayCandyMachine() {
  const { program } = useProgram(candyMachineAddress.toString(), "nft-drop")

  const [nfts, setNfts] = useState<any[]>()
  const [totalItems, setTotalItems] = useState(0)
  const [item, setItem] = useState(0)

  // fetch all nfts
  const fetchNfts = async () => {
    const nfts = await program.getAll()
    setTotalItems(nfts.length)
    setNfts(nfts)
    console.log(program.publicKey.toString())
  }

  // previous nft
  const prev = async () => {
    if (item - 1 < 0) {
      setItem(0)
    } else {
      setItem(item - 1)
    }
  }

  // next nft
  const next = async () => {
    if (totalItems - 1 > item) {
      setItem(item + 1)
    }
  }

  useEffect(() => {
    if (program) {
      fetchNfts()
    }
  }, [program])

  return (
    <VStack spacing={5}>
      <HStack spacing={5}>
        <Button color="white" onClick={prev}>
          <ArrowBackIcon />
        </Button>
        {nfts && (
          <Image
            borderRadius="25px"
            boxSize="200px"
            src={nfts[item].metadata.image}
            padding="10px"
          />
        )}
        <Button color="white" onClick={next}>
          <ArrowForwardIcon />
        </Button>
      </HStack>
    </VStack>
  )
}
