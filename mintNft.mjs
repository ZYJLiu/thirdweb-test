import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import * as web3 from "@solana/web3.js"
import * as fs from "fs"
import dotenv from "dotenv"
import { readFileSync } from "fs"
dotenv.config()

const sdk = ThirdwebSDK.fromPrivateKey("devnet", process.env.PRIVATE_KEY)
const myNftCollection = await sdk.getNFTCollection(
  "H3JHkx58NCDYbJkEqBisstSGkERdGhVpMknDo2yBG3CT"
)

const metadata = {
  name: "name",
  description: "description",
  image: readFileSync("./test.png"),
}

const mintNft = await myNftCollection.mint(metadata)
console.log(mintNft)

const nftsMinted = await myNftCollection.getAll()

console.log(nftsMinted)
