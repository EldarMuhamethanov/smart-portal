import Web3 from "web3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

type Payload = {
  onChainChanged: (newChain: number) => void;
  onDisconnectValet: () => void;
  onDisconnectMetamask: () => void;
};

export async function connectToMetaMask({
  onDisconnectValet,
  onChainChanged,
  onDisconnectMetamask,
}: Payload): Promise<Web3 | null> {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);

      window.ethereum.on("chainChanged", (chainId: string) => {
        onChainChanged(parseInt(chainId, 16));
      });

      window.ethereum.on("accountsChanged", (accounts: []) => {
        if (accounts.length === 0) {
          onDisconnectValet();
        }
      });

      window.ethereum.on("disconnect", () => {
        onDisconnectMetamask();
      });

      return web3;
    } catch (error) {
      console.error("Произошла ошибка при подключении к MetaMask:", error);
      return null;
    }
  } else {
    console.log("MetaMask не обнаружен. Пожалуйста, установите MetaMask.");
    return null;
  }
}
