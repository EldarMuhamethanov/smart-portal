import { FieldData } from "../types";

export const remapMethodDataToSignature = (
  methodName: string,
  fields: FieldData[]
) => {
  return `${methodName}(${fields.map((field) => field.type)})`;
};
