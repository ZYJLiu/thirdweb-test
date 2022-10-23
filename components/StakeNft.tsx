import { useState, useEffect, FC, useMemo } from "react"
import {
  Button,
  HStack,
  VStack,
  Image,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react"
import {
  candyMachineAddress,
  STAKE_MINT,
  STAKING_PROGRAM_ID,
} from "../utils/constants"
import { useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { Connection, PublicKey } from "@solana/web3.js"
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { getAssociatedTokenAddress } from "@solana/spl-token"
export interface Props {
  nft: any
}

const StakeNft: FC<Props> = (props) => {
  const [nftData, setNftData] = useState<any>()
  const [isStaking, setIsStaking] = useState(false)
  const [stakeTime, setStakeTime] = useState(String)
  const [stakeState, setStakeState] = useState<any>()
  const [stakeRewards, setStakeRewards] = useState(0)
  const connection = new Connection("https://devnet.genesysgo.net/")

  const wallet = useWallet()
  const { connected, publicKey } = useWallet()
  const [stakingProgram, setStakingProgram] = useState<any>()
  const [stakeAccountAddress, setStakeAccountAddress] = useState<PublicKey>()
  const [tokenAccountAddress, setTokenAccountAddress] = useState<PublicKey>()

  // metaplex setup
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(wallet))
  }, [connection, wallet])

  const sdk = ThirdwebSDK.fromNetwork("https://devnet.genesysgo.net/")
  if (connected) {
    sdk.wallet.connect(wallet)
  }

  const getProgram = async () => {
    const program = await sdk.getProgram(STAKING_PROGRAM_ID.toString())
    console.log(program)
    setStakingProgram(program)
  }

  useEffect(() => {
    getProgram()
  }, [])

  // fetch nfts for connected wallet
  const fetchNfts = async () => {
    if (publicKey) {
      metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(props.nft.mintAddress) })
        .run()
        .then((nft) => {
          setNftData(nft)
          console.log(nft)
        })

      const tokenAccount = (
        await connection.getTokenLargestAccounts(
          new PublicKey(props.nft.mintAddress)
        )
      ).value[0].address

      setTokenAccountAddress(tokenAccount)

      const [stakeStatePDA] = await PublicKey.findProgramAddress(
        [publicKey!.toBuffer(), tokenAccount.toBuffer()],
        STAKING_PROGRAM_ID
      )

      setStakeAccountAddress(stakeStatePDA)
      checkStakeStatus()
    }
  }

  // check stake status of NFT
  const checkStakeStatus = async () => {
    if (stakingProgram && stakeAccountAddress) {
      try {
        // fetch stakeState account data
        const stakeStateAccount = await stakingProgram.fetch(
          "userStakeInfo",
          stakeAccountAddress
        )
        setStakeState(stakeStateAccount)

        // set staking status
        if (stakeStateAccount.stakeState.staked) {
          setIsStaking(true)
        } else {
          setIsStaking(false)
        }
      } catch (error: unknown) {}
    }
  }

  useEffect(() => {
    fetchNfts()
  }, [props])

  useEffect(() => {
    checkStakeStatus()
  }, [stakingProgram])

  const convert = (time: number) => {
    setStakeTime(
      Math.floor(time / 24 / 60) +
        " HR : " +
        Math.floor((time / 60) % 24) +
        " MIN : " +
        Math.floor(time % 60) +
        " SEC "
    )
  }

  // calculate stake rewards
  const checkStakeRewards = async () => {
    if (stakeState) {
      // get current solana clock time
      const slot = await connection.getSlot({ commitment: "confirmed" })
      const timestamp = await connection.getBlockTime(slot)
      const rewards = timestamp! - stakeState.lastStakeRedeem.toNumber()
      const duration = timestamp! - stakeState.stakeStartTime.toNumber()
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
  }, [isStaking, stakeState])

  // send unstake transaction
  const Stake = async () => {
    const txsig = await stakingProgram.call("stake", {
      accounts: {
        nftTokenAccount: tokenAccountAddress,
        nftMint: nftData.mint.address,
        nftEdition: nftData.edition.address,
        metadataProgram: METADATA_PROGRAM_ID,
      },
    })
    console.log(`https://explorer.solana.com/tx/${txsig}?cluster=devnet`)
    checkStakeStatus()
  }
  const Unstake = async () => {
    if (publicKey) {
      const stakeRewardTokenAddress = await getAssociatedTokenAddress(
        STAKE_MINT,
        publicKey
      )

      const txsig = await stakingProgram.call("unstake", {
        accounts: {
          nftTokenAccount: tokenAccountAddress,
          nftMint: nftData.mint.address,
          nftEdition: nftData.edition.address,
          stakeMint: STAKE_MINT,
          userStakeAta: stakeRewardTokenAddress,
          metadataProgram: METADATA_PROGRAM_ID,
        },
      })
      console.log(`https://explorer.solana.com/tx/${txsig}?cluster=devnet`)
      checkStakeStatus()
    }
  }

  const Redeem = async () => {
    if (publicKey) {
      const stakeRewardTokenAddress = await getAssociatedTokenAddress(
        STAKE_MINT,
        publicKey
      )

      const txsig = await stakingProgram.call("redeem", {
        accounts: {
          nftTokenAccount: tokenAccountAddress,
          stakeMint: STAKE_MINT,
          userStakeAta: stakeRewardTokenAddress,
        },
      })
      console.log(`https://explorer.solana.com/tx/${txsig}?cluster=devnet`)
      checkStakeStatus()
    }
  }

  return (
    <VStack margin={3}>
      {nftData && (
        <VStack
          bgColor="rgba(255, 255, 255, 0.1)"
          borderRadius="20px"
          padding="10px 20px"
          // spacing={5}
        >
          {/* <Heading size="md">{thirdwebNftData.metadata.name}</Heading>
          <Image
            borderRadius="25px"
            width="200px"
            src={thirdwebNftData.metadata.image}
            alt=""
          /> */}
          <Heading size="md">{nftData.name}</Heading>
          <Image
            borderRadius="25px"
            width="200px"
            src={nftData.json?.image}
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
          <HStack padding="5px 10px">
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
          </HStack>
        </VStack>
      )}
    </VStack>
  )
}

export default StakeNft
