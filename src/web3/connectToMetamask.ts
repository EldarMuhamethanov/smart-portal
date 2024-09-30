import Web3 from "web3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export async function connectToMetaMask(): Promise<Web3 | null> {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);

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
