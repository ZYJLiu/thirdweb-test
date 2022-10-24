import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import * as web3 from "@solana/web3.js"
import * as fs from "fs"
import dotenv from "dotenv"
import { readFileSync } from "fs"
dotenv.config()

const sdk = ThirdwebSDK.fromPrivateKey(
  "https://devnet.genesysgo.net/",
  process.env.PRIVATE_KEY
)
const contractMetadata = {
  name: "My NFT Drop",
  symbol: "MND",
  description: "This is my NFT Drop",
  // itemsAvailable: 10,
  totalSupply: 20,
}

const address = await sdk.deployer.createNftDrop(contractMetadata)
console.log("Contract Address: ", address)

const metadata = [
  {
    name: "NFT #1",
    description: "My first NFT!",
    image: readFileSync("./test.png"),
    properties: [
      {
        name: "trait",
        value: "1",
      },
    ],
  },
  {
    name: "NFT #2",
    description: "My first NFT!",
    image: readFileSync("./test2.png"),
    properties: [
      {
        name: "trait",
        value: "2",
      },
    ],
  },
  {
    name: "NFT #3",
    description: "My first NFT!",
    image: readFileSync("./test3.png"),
    properties: [
      {
        name: "trait",
        value: "3",
      },
    ],
  },
  {
    name: "NFT #4",
    description: "My first NFT!",
    image: readFileSync("./test4.png"),
    properties: [
      {
        name: "trait",
        value: "4",
      },
    ],
  },
  {
    name: "NFT #5",
    description: "My first NFT!",
    image: readFileSync("./test5.png"),
    properties: [
      {
        name: "trait",
        value: "5",
      },
    ],
  },
  {
    name: "NFT #6",
    description: "My first NFT!",
    image: readFileSync("./test.png"),
    properties: [
      {
        name: "trait",
        value: "1",
      },
    ],
  },
  {
    name: "NFT #7",
    description: "My first NFT!",
    image: readFileSync("./test2.png"),
    properties: [
      {
        name: "trait",
        value: "2",
      },
    ],
  },
  {
    name: "NFT #8",
    description: "My first NFT!",
    image: readFileSync("./test3.png"),
    properties: [
      {
        name: "trait",
        value: "3",
      },
    ],
  },
  {
    name: "NFT #9",
    description: "My first NFT!",
    image: readFileSync("./test4.png"),
    properties: [
      {
        name: "trait",
        value: "4",
      },
    ],
  },
  {
    name: "NFT #10",
    description: "My first NFT!",
    image: readFileSync("./test5.png"),
    properties: [
      {
        name: "trait",
        value: "5",
      },
    ],
  },
  {
    name: "NFT #11",
    description: "My first NFT!",
    image: readFileSync("./test.png"),
    properties: [
      {
        name: "trait",
        value: "1",
      },
    ],
  },
  {
    name: "NFT #12",
    description: "My first NFT!",
    image: readFileSync("./test2.png"),
    properties: [
      {
        name: "trait",
        value: "2",
      },
    ],
  },
  {
    name: "NFT #13",
    description: "My first NFT!",
    image: readFileSync("./test3.png"),
    properties: [
      {
        name: "trait",
        value: "3",
      },
    ],
  },
  {
    name: "NFT #14",
    description: "My first NFT!",
    image: readFileSync("./test4.png"),
    properties: [
      {
        name: "trait",
        value: "4",
      },
    ],
  },
  {
    name: "NFT #15",
    description: "My first NFT!",
    image: readFileSync("./test5.png"),
    properties: [
      {
        name: "trait",
        value: "5",
      },
    ],
  },
  {
    name: "NFT #16",
    description: "My first NFT!",
    image: readFileSync("./test.png"),
    properties: [
      {
        name: "trait",
        value: "1",
      },
    ],
  },
  {
    name: "NFT #17",
    description: "My first NFT!",
    image: readFileSync("./test2.png"),
    properties: [
      {
        name: "trait",
        value: "2",
      },
    ],
  },
  {
    name: "NFT #18",
    description: "My first NFT!",
    image: readFileSync("./test3.png"),
    properties: [
      {
        name: "trait",
        value: "3",
      },
    ],
  },
  {
    name: "NFT #19",
    description: "My first NFT!",
    image: readFileSync("./test4.png"),
    properties: [
      {
        name: "trait",
        value: "4",
      },
    ],
  },
  {
    name: "NFT #20",
    description: "My first NFT!",
    image: readFileSync("./test5.png"),
    properties: [
      {
        name: "trait",
        value: "5",
      },
    ],
  },
]

const program = await sdk.getNFTDrop(address)
// const program = await sdk.getNFTDrop(
//   "7jU8Wu4ZHEU81FdZLsZNLE3pwWAnfjhAbe6PPbdANBzR"
// )
// console.log(program)

const tx = await program.lazyMint(metadata)
console.log(tx)

const sig = await program.claimConditions.set({
  maxClaimable: 20,
  price: 0.01,
  startTime: new Date("December 17, 1995 03:24:00"),
})

console.log(sig)
