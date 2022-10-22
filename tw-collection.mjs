import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import dotenv from "dotenv"
dotenv.config()

const sdk = ThirdwebSDK.fromPrivateKey(
  "https://devnet.genesysgo.net/",
  process.env.PRIVATE_KEY
)
const nftCollection = await sdk.deployer.createNftCollection({
  name: "Collection",
  description: "Collection NFT",
})

console.log(nftCollection)
