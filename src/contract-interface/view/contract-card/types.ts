export type ContractMethod = {
  name: string;
  type: MethodType;
  fields: FieldData[];
};

export type FieldData = {
  name: string;
  type: string;
};

export type MethodType = "view" | "pure" | "update";
