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
  name: "TOKEN",
  description: "Description",
  symbol: "SYMBOL",
  image: readFileSync("./test.png"),
  initialSupply: 1,
  decimals: 0,
}

const address = await sdk.deployer.createToken(metadata)

console.log(address)
console.log("Contract deployed successfully! 🎉")

const token = await sdk.getToken(address)
const supply = await token.totalSupply()

console.log(token)
console.log(supply)
