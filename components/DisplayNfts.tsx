import { useState, useEffect } from "react"
import { Flex } from "@chakra-ui/react"
import { candyMachineAddress } from "../utils/constants"
import { useProgram } from "@thirdweb-dev/react/solana"
import { useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { Connection } from "@solana/web3.js"
import StakeNft from "./StakeNft"

export default function DisplayNfts() {
  const wallet = useWallet()
  const { program } = useProgram(candyMachineAddress.toString(), "nft-drop")
  const connection = new Connection("https://devnet.genesysgo.net/")
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))
  const [nfts, setNfts] = useState<any[]>()

  // fetch nfts for connected wallet
  const fetchNfts = async () => {
    // use candy machine metadata to get "collection" NFT mint for the candy machine
    const metadata = await program.getMetadata()
    if (!wallet.connected) {
      return
    }

    // using metaplex SDK to fetch all NFTs of connected wallet
    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey! })
      .run()

    // filter for nfts in candy machine "collection"
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
        <StakeNft key={nft.address} nft={nft} />
      ))}
    </Flex>
  )
}
