import { ABI } from "@/web3/ABI";
import { ContractMethod, FieldData, MethodType } from "./types";

export const remapABItoMethodsData = (abi: ABI): ContractMethod[] => {
  return abi
    .filter((item) => item.type === "function")
    .map((item) => {
      const methodType: MethodType =
        item.stateMutability === "view" || item.stateMutability === "pure"
          ? item.stateMutability
          : "transaction";

      const fields: FieldData[] = [
        ...item.inputs.map((input) => ({
          name: input.name,
          type: input.type,
        })),
      ];

      const outputs: FieldData[] = [
        ...item.outputs.map((input) => ({
          name: input.name,
          type: input.type,
        })),
      ];

      return {
        name: item.name,
        type: methodType,
        fields: fields,
        outputs,
      };
    });
};
