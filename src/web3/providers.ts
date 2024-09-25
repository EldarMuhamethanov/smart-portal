import { NetworkType } from "@/contract-interface/model/SmartContractsModel";
import { getValueByCheckedKey } from "@/core/typings";
import Web3 from "web3";

const INFURA_API_KEY = "7e2d31d3fece43d2b86ec3e9981b948c";

const mainnetWeb3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);

const sepoliaWeb3 = new Web3(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);

const hardhatWeb3 = new Web3(`http://localhost:8545`);

export const getWeb3ByType = (type: NetworkType): Web3 => {
  return getValueByCheckedKey(type, {
    sepolia: sepoliaWeb3,
    mainnet: mainnetWeb3,
    hardhat: hardhatWeb3,
  });
};
