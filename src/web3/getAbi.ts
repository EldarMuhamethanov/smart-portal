import { NetworkType } from "@/contract-interface/model/SmartContractsModel";
import { getValueByCheckedKey } from "@/core/typings";
import { ABI } from "./ABI";

const ETHERSCAN_API_KEY = "DDZPITBAMCT4SV1CNBW91GX3TQZXSN62AQ";

const mainnetAbiBuilder = (address: string) => {
  return `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
};

const sepoliaAbiBuilder = (address: string) => {
  return `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
};

const hardhatAbiBuilder = (address: string) => {
  return `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
};

const getAbiBuilder = (network: NetworkType) => {
  return getValueByCheckedKey(network, {
    mainnet: mainnetAbiBuilder,
    sepolia: sepoliaAbiBuilder,
    hardhat: hardhatAbiBuilder,
  });
};

export async function getABI(
  contractAddress: string,
  networkType: NetworkType
) {
  const builder = getAbiBuilder(networkType);
  const url = builder(contractAddress);

  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    if (data.status === "1") {
      const abi = JSON.parse(data.result) as ABI;
      return abi;
    }
    return null;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}
