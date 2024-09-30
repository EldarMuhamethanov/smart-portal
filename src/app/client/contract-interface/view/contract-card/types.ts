export type ContractMethod = {
  name: string;
  type: MethodType;
  fields: FieldData[];
  outputs: FieldData[];
};

export type FieldData = {
  name: string;
  type: string;
};

export type MethodType = "view" | "pure" | "transaction";
