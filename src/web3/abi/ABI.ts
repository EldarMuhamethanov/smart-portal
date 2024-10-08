export type ABI_Method_IO = {
  internalType: string;
  name: string;
  type: string;
  components?: ABI_Method_IO[];
};

export type ABI_Method = {
  name: string;
  inputs: ABI_Method_IO[];
  outputs: ABI_Method_IO[];
  stateMutability: string;
  type: string;
};

export type ABI = ABI_Method[];
