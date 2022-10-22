import { FC, useState, useEffect } from "react"
import {
  Button,
  Container,
  Heading,
  HStack,
  VStack,
  Image,
} from "@chakra-ui/react"
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons"
import { CandyMachine, Metaplex } from "@metaplex-foundation/js"
import { candyMachineAddress } from "../utils/constants"
import { Connection } from "@solana/web3.js"

const Connected: FC = () => {
  const connection = new Connection("https://devnet.genesysgo.net/")
  const metaplex = Metaplex.make(connection)

  const [candyMachine, setCandyMachineData] = useState<CandyMachine>()
  const [pageItems, setPageItems] = useState<any[]>()
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(1)
  const perPage = 1

  // fetch candymachine
  const fetchCandyMachine = async () => {
    const candyMachine = await metaplex
      .candyMachines()
      .findByAddress({ address: candyMachineAddress })
      .run()

    console.log(candyMachine)

    setCandyMachineData(candyMachine)
    setTotalItems(candyMachine.items.length)
  }

  // display candymachine NFT images for current page
  const getPage = async (page: number, perPage: number) => {
    if (candyMachine) {
      const pageItems = candyMachine.items.slice(
        (page - 1) * perPage,
        page * perPage
      )

      let nftData = []
      for (let i = 0; i < pageItems.length; i++) {
        let fetchResult = await fetch(pageItems[i].uri)
        let json = await fetchResult.json()
        nftData.push(json)
      }

      setPageItems(nftData)
    }
  }

  // previous page
  const prev = async () => {
    if (page - 1 < 1) {
      setPage(1)
    } else {
      setPage(page - 1)
    }
  }

  // next page
  const next = async () => {
    if (totalItems > page * perPage) {
      setPage(page + 1)
    }
  }

  // paging
  useEffect(() => {
    getPage(page, perPage)
  }, [candyMachine, page])

  // fetch candymachine
  useEffect(() => {
    fetchCandyMachine()
  }, [])

  return (
    <VStack spacing={5}>
      <HStack spacing={5}>
        <Button color="white" onClick={prev}>
          <ArrowBackIcon />
        </Button>
        {pageItems?.map((nft) => (
          <Image
            key={nft.address}
            borderRadius="25px"
            boxSize="200px"
            src={nft.image}
            padding="10px"
          />
        ))}
        <Button color="white" onClick={next}>
          <ArrowForwardIcon />
        </Button>
      </HStack>
    </VStack>
  )
}

export default Connected
