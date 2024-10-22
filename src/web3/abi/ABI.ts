export type ABI_Method_IO = {
  internalType: string;
  name: string;
  type: string;
  components?: ABI_Method_IO[];
};

export type ABI_EVENT_IO = {
  internalType: string;
  name: string;
  type: string;
  components?: ABI_Method_IO[];
  indexed: boolean;
};

export type ABI_Method = {
  name: string;
  inputs: ABI_Method_IO[];
  outputs: ABI_Method_IO[];
  stateMutability: string;
  type: "function";
};

export type ABI_Event = {
  name: string;
  inputs: ABI_EVENT_IO[];
  anonymous: boolean;
  type: "event";
};

export type ABI = (ABI_Method | ABI_Event)[];
