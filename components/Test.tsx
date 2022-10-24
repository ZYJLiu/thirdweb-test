//@ts-ignore
import { useProgram, useClaimNFT } from "@thirdweb-dev/react/solana"
import { Button, Heading, Text, Image, VStack } from "@chakra-ui/react"
import { useEffect, useState, useCallback } from "react"
import { candyMachineAddress } from "../utils/constants"
import DisplayCandyMachine from "./DisplayCandyMachine"
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import { Keypair } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"

// test use thirdweb SDK to fetch existing Anchor program
export default function Claim() {
  // const [wallet, setWallet] = useState(null)
  const wallet = useWallet()
  const { connected } = useWallet()
  const [program, setProgram] = useState<any>()

  const sdk = ThirdwebSDK.fromNetwork("https://devnet.genesysgo.net/")
  if (connected) {
    sdk.wallet.connect(wallet)
  }

  useEffect(() => {
    //@ts-ignore
    if (typeof window.xnft !== "undefined") {
      //@ts-ignore
      // setWallet(window.xnft.solana)
    }
  }, [])

  useEffect(() => {
    getProgram()
  }, [])

  const getProgram = async () => {
    const program = await sdk.getProgram(
      "3pM9kmd1wHacSVQ2Jquai39zP7fwxjhtPpDurcEwwGcH"
    )
    console.log(program)
    setProgram(program)
  }

  const handleClick = useCallback(async () => {
    const counterAccount = Keypair.generate()
    const test = await program.call("initialize", {
      // We need to pass in the public keys of any accounts to interact with
      accounts: {
        counter: counterAccount.publicKey.toBase58(),
      },
      // As well as the arguments to pass to the data parameters
      // data: ["..."],
      // And the signer of the account that will be signing the message
      signers: [counterAccount],
    })
    console.log(test)
  }, [wallet, program])

  return (
    <VStack>
      <Button
        variant="solid"
        colorScheme="green"
        rounded="button"
        width="150px"
        mb={2}
        // isLoading={isLoading}
        onClick={() => handleClick()}
      >
        Test
      </Button>
    </VStack>
  )
}
