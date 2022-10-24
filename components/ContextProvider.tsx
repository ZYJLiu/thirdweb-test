import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  PhantomWalletAdapter,
  BackpackWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { FC, ReactNode, useMemo } from "react"
import { ThirdwebProvider } from "@thirdweb-dev/react/solana"
import { Network } from "@thirdweb-dev/sdk/solana"
require("@solana/wallet-adapter-react-ui/styles.css")

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network: Network = "https://devnet.genesysgo.net/"

  const wallets = useMemo(
    () => [new BackpackWalletAdapter(), new PhantomWalletAdapter()],
    []
  )

  return (
    <ThirdwebProvider network={network} wallets={wallets} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </ThirdwebProvider>
  )
}

export default WalletContextProvider
