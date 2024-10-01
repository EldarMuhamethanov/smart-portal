"use server";

import { ABI } from "./ABI";
import { UnknownNetwork } from "./errors";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const etherscanEndpoints: Record<number, string> = {
  1: "https://api.etherscan.io/api", // Ethereum Mainnet
  3: "https://api-ropsten.etherscan.io/api", // Ropsten Testnet (устаревшая)
  4: "https://api-rinkeby.etherscan.io/api", // Rinkeby Testnet (устаревшая)
  5: "https://api-goerli.etherscan.io/api", // Goerli Testnet
  10: "https://api-optimistic.etherscan.io/api", // Optimism
  42: "https://api-kovan.etherscan.io/api", // Kovan Testnet (устаревшая)
  56: "https://api.bscscan.com/api", // Binance Smart Chain
  97: "https://api-testnet.bscscan.com/api", // Binance Smart Chain Testnet
  137: "https://api.polygonscan.com/api", // Polygon (Matic) Mainnet
  80001: "https://api-testnet.polygonscan.com/api", // Polygon (Matic) Mumbai Testnet
  42161: "https://api.arbiscan.io/api", // Arbitrum One
  421613: "https://api-goerli.arbiscan.io/api", // Arbitrum Goerli Testnet
  43114: "https://api.snowtrace.io/api", // Avalanche C-Chain
  11155111: "https://api-sepolia.etherscan.io/api", // Sepolia Testnet
};

export async function getContractCodeData(
  contractAddress: string,
  networkId: number
) {
  const endpoint = etherscanEndpoints[networkId];
  if (!endpoint) {
    throw new UnknownNetwork();
  }
  const url = `${endpoint}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    console.log("data", data);
    if (data.status === "1") {
      const abi = JSON.parse(data.result[0].ABI) as ABI;
      return {
        abi,
        code: data.result[0].SourceCode,
      };
    }
    return null;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}
