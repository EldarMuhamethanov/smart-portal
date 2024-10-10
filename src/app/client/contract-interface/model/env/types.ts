import Web3 from "web3";

export interface IEvnModel {
  web3: Web3 | null;
  rpcEndpoint: string;
  rpcEndpointError: boolean;
  chainIdError: boolean;
  updateState: () => Promise<void>;
  initState: () => Promise<void>;
  resetState: () => void;
  updateRPCEndpoint: (endpoint: string) => Promise<void>;
  tryToConnectMetamask: () => Promise<void>;
}
