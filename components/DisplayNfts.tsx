import { useState, useEffect } from "react"
import { Button, HStack, VStack, Image, Flex } from "@chakra-ui/react"
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons"
import { candyMachineAddress } from "../utils/constants"
import { useProgram } from "@thirdweb-dev/react/solana"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { Connection } from "@solana/web3.js"
import NftData from "./NftData"

export default function DisplayNfts() {
  const [nfts, setNfts] = useState<any[]>()
  const [nftData, setNftData] = useState<any[]>()
  const { program } = useProgram(candyMachineAddress.toString(), "nft-drop")
  const connection = new Connection("https://devnet.genesysgo.net/")
  const wallet = useWallet()
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

  // fetch nfts for connected wallet
  const fetchNfts = async () => {
    const metadata = await program.getMetadata()
    if (!wallet.connected) {
      return
    }

    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey! })
      .run()

    // filter for nfts in collection
    let nft = []
    for (let i = 0; i < nfts.length; i++) {
      if (nfts[i].collection?.address.toString() == metadata.id.toString()) {
        nft.push(nfts[i])
      }
    }

    setNfts(nft)
    console.log(nft)
  }

  useEffect(() => {
    if (program && wallet) {
      fetchNfts()
    }
  }, [program, wallet])

  return (
    <Flex direction={[`column`, `column`, "row", "row"]}>
      {nfts?.map((nft) => (
        <NftData key={nft.address} nft={nft} />
      ))}
    </Flex>
  )
}
