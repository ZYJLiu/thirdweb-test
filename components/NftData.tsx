import { useState, useEffect, FC } from "react"
import {
  Button,
  HStack,
  VStack,
  Image,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react"
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons"
import { candyMachineAddress } from "../utils/constants"
import { useProgram } from "@thirdweb-dev/react/solana"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { Connection } from "@solana/web3.js"
import { NFT } from "@thirdweb-dev/sdk"

export interface Props {
  nft: any
}

const NftData: FC<Props> = (props) => {
  const [nftData, setNftData] = useState<NFT>()
  const [isStaking, setIsStaking] = useState(true)
  const [stakeTime, setStakeTime] = useState(String)
  const [stakeRewards, setStakeRewards] = useState(0)
  const [time, setTime] = useState(0)
  const { program } = useProgram(candyMachineAddress.toString(), "nft-drop")
  const connection = new Connection("https://devnet.genesysgo.net/")
  // const wallet = useWallet()

  // fetch nfts for connected wallet
  const fetchNfts = async () => {
    if (program) {
      const nft = await program.get(props.nft.mintAddress)
      console.log(nft)
      console.log(nft.metadata.image)
      setNftData(nft)
    }
  }

  useEffect(() => {
    if (program) {
      fetchNfts()
      testTime()
    }
  }, [program])

  const convert = async (time: number) => {
    setStakeTime(
      Math.floor(time / 24 / 60) +
        " HR : " +
        Math.floor((time / 60) % 24) +
        " MIN : " +
        Math.floor(time % 60) +
        " SEC "
    )
  }

  const testTime = async () => {
    const slot = await connection.getSlot({ commitment: "confirmed" })
    const timestamp = await connection.getBlockTime(slot)
    console.log(timestamp)
    setTime(timestamp!)
  }

  const checkStakeRewards = async () => {
    if (isStaking) {
      const slot = await connection.getSlot({ commitment: "confirmed" })
      const timestamp = await connection.getBlockTime(slot)
      const rewards = timestamp! - time
      const duration = timestamp! - time
      convert(duration)
      setStakeRewards(rewards)
    }
  }

  // check stake rewards
  useEffect(() => {
    if (isStaking) {
      const interval = setInterval(() => {
        checkStakeRewards()
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setStakeRewards(0)
    }
  }, [isStaking, time])

  // send unstake transaction
  const Unstake = async () => {}
  const Stake = async () => {}
  const Redeem = async () => {}

  return (
    <VStack alignItems="flex-start" margin={5}>
      {nftData && (
        <VStack
          bgColor="rgba(255, 255, 255, 0.1)"
          borderRadius="20px"
          padding="10px 20px"
          // spacing={5}
        >
          <Heading size="md">{nftData.metadata.name}</Heading>
          <Image
            borderRadius="25px"
            width="200px"
            src={nftData.metadata.image}
            alt=""
          />
          <Text
            bgColor="rgba(255, 255, 255, 0.05)"
            as="b"
            padding="4px 4px"
            borderRadius="25px"
            fontSize="sm"
          >
            {isStaking ? `${stakeTime}` : "READY TO STAKE"}
          </Text>
          <Text as="b">Rewards: {stakeRewards}</Text>
          {isStaking ? (
            <Button onClick={Redeem} bgColor="buttonGreen">
              <Text as="b">Redeem </Text>
            </Button>
          ) : (
            <Text color="bodyText" as="b">
              Earn Rewards
            </Text>
          )}
          <Button onClick={isStaking ? Unstake : Stake}>
            <Text as="b">{isStaking ? "Unstake" : "Stake"}</Text>
          </Button>
        </VStack>
      )}
    </VStack>
  )
}
export default NftData
