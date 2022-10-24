import { useState, useEffect, FC, useMemo } from "react"
import { Button, HStack, VStack, Image, Heading, Text } from "@chakra-ui/react"
import { STAKE_MINT, STAKING_PROGRAM_ID } from "../utils/constants"
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
  const wallet = useWallet()
  const { connected, publicKey } = useWallet()
  const connection = new Connection("https://devnet.genesysgo.net/")
  const [nftData, setNftData] = useState<any>()
  const [isStaking, setIsStaking] = useState(false)
  const [stakeTime, setStakeTime] = useState(String)
  const [stakeState, setStakeState] = useState<any>()
  const [stakeRewards, setStakeRewards] = useState(0)
  const [stakingProgram, setStakingProgram] = useState<any>()
  const [stakeAccountAddress, setStakeAccountAddress] = useState<PublicKey>()
  const [tokenAccountAddress, setTokenAccountAddress] = useState<PublicKey>()

  // metaplex setup
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(wallet))
  }, [connection, wallet])

  // thirdweb setup
  const sdk = ThirdwebSDK.fromNetwork("https://devnet.genesysgo.net/")
  if (connected) {
    sdk.wallet.connect(wallet)
  }

  // use thirdweb to get deployed Anchor program
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
      // use Metaplex SDK to fetch NFT metadata, need the "edition" mint address
      metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(props.nft.mintAddress) })
        .run()
        .then((nft) => {
          setNftData(nft)
          console.log(nft)
        })

      // get the token account of NFT
      const tokenAccount = (
        await connection.getTokenLargestAccounts(
          new PublicKey(props.nft.mintAddress)
        )
      ).value[0].address

      setTokenAccountAddress(tokenAccount)

      // staking program PDA
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
        // use thirdweb SDK to fetch stakeState account data
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

  // calculate time staked
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

  // use thirdweb SDK to send stake transaction
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

  // use thirdweb SDK to send unstake transaction
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

  // use thirdweb SDK to send redeem transaction
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
          color="white"
        >
          <Heading size="md">{nftData.name}</Heading>
          <Image
            borderRadius="25px"
            width="200px"
            src={nftData.json?.image}
            alt=""
          />
          <Text
            as="b"
            padding="4px 4px"
            borderRadius="25px"
            fontSize="sm"
            color="white"
          >
            {isStaking ? `${stakeTime}` : "READY TO STAKE"}
          </Text>
          <Text as="b">Rewards: {stakeRewards}</Text>
          <HStack padding="5px 10px">
            {isStaking ? (
              <Button color="gray" onClick={Redeem} bgColor="buttonGreen">
                <Text as="b">Redeem </Text>
              </Button>
            ) : (
              <Text color="white" as="b">
                Earn Rewards
              </Text>
            )}
            <Button color="gray" onClick={isStaking ? Unstake : Stake}>
              <Text as="b">{isStaking ? "Unstake" : "Stake"}</Text>
            </Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  )
}

export default StakeNft
