import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import * as web3 from "@solana/web3.js"
import * as fs from "fs"
import dotenv from "dotenv"
import { readFileSync } from "fs"
dotenv.config()

const sdk = ThirdwebSDK.fromPrivateKey("devnet", process.env.PRIVATE_KEY)
const contractMetadata = {
  name: "My NFT Drop",
  symbol: "MND",
  description: "This is my NFT Drop",
  // itemsAvailable: 10,
  totalSupply: 10,
}

// const address = await sdk.deployer.createNftDrop(contractMetadata)
// console.log("Contract Address: ", address)

const metadata = [
  {
    name: "NFT #1",
    description: "My first NFT!",
    image: readFileSync("./test.png"),
    properties: [
      {
        name: "kitten",
        value: "very cute!",
      },
    ],
  },
  {
    name: "NFT #1",
    description: "My second NFT!",
    image: readFileSync("./test2.png"),
    properties: [
      {
        name: "grumpy cat",
        value: "grumpy!",
      },
    ],
  },
  {
    name: "NFT #1",
    description: "My third NFT!",
    image: readFileSync("./test3.png"),
    properties: [
      {
        name: "Ninja Cat",
        value: "warrior!",
      },
    ],
  },
  {
    name: "NFT #1",
    description: "My first NFT!",
    image: readFileSync("./test.png"),
    properties: [
      {
        name: "kitten",
        value: "very cute!",
      },
    ],
  },
  {
    name: "NFT #1",
    description: "My second NFT!",
    image: readFileSync("./test2.png"),
    properties: [
      {
        name: "grumpy cat",
        value: "grumpy!",
      },
    ],
  },
  {
    name: "NFT #1",
    description: "My third NFT!",
    image: readFileSync("./test3.png"),
    properties: [
      {
        name: "Ninja Cat",
        value: "warrior!",
      },
    ],
  },
]

// const program = await sdk.getNFTDrop(address)
const program = await sdk.getNFTDrop(
  "7jU8Wu4ZHEU81FdZLsZNLE3pwWAnfjhAbe6PPbdANBzR"
)
// console.log(program)

const tx = await program.lazyMint(metadata)
console.log(tx)

// const sig = await program.claimConditions.set({
//   maxClaimable: 10,
//   price: 0.5,
//   startTime: new Date("December 17, 1995 03:24:00"),
// })

// console.log(sig)
