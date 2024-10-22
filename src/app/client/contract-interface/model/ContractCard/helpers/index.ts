"use client";

import Web3, { EventLog } from "web3";
import { FieldData } from "../../../view/contract-card/types";
import { FieldDataWithValue } from "../ContractCardModel";
import { EventData } from "../ContractEventsModel";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const isArrayLike = (value: any): boolean => {
  if (typeof value === "object" && !Array.isArray(value)) {
    const keys = Object.keys(value);
    return keys.every(
      (key) => Number.isFinite(Number(key)) || key === "__length__"
    );
  }
  return false;
};

export const remapResultObject = (result: any) => {
  const results: string[] = [];
  const arrayLike = isArrayLike(result);
  if (!arrayLike) {
    results.push(JSON.stringify(_remapComplexObject(result), null, 2));
    return results;
  }
  for (const index in result) {
    if (index === "__length__") {
      continue;
    }
    const value = result[index];
    results.push(JSON.stringify(_remapComplexObject(value), null, 2));
  }

  return results;
};

const _remapComplexObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return _remapArrayObject(obj);
  }
  if (typeof obj === "bigint") {
    return Number(String(obj));
  }
  if (
    typeof obj === "string" ||
    typeof obj === "number" ||
    typeof obj === "boolean"
  ) {
    return obj;
  }
  return _remapObject(obj);
};

const _remapObject = (obj: any): Record<string, any> => {
  const prettifyObj = _prettifyObject(obj);
  return Object.keys(prettifyObj).reduce((res, key) => {
    const value = prettifyObj[key];
    res[key] = _remapComplexObject(value);
    return res;
  }, {} as Record<string, any>);
};

const _remapArrayObject = (arr: Array<any>): Array<string> => {
  return arr.map((item) => {
    return _remapComplexObject(item);
  });
};

const _prettifyObject = (obj: any): Record<string, string> => {
  return Object.keys(obj).reduce((res, key: string) => {
    if (Number.isFinite(Number(key)) || key === "__length__") {
      return res;
    }
    res[key] = obj[key] as string;
    return res;
  }, {} as Record<string, string>);
};

export const remapArgsValues = (fields: FieldDataWithValue[]) => {
  return fields.map((field) => {
    const { value, type } = field;
    if (type === "bool") {
      return JSON.parse(value);
    }
    if (type.endsWith("]") || type === "tuple") {
      return JSON.parse(value);
    }
    if (type.startsWith("uint") && !type.endsWith("]")) {
      return Number(value);
    }
    return value;
  });
};

const _remapMethodDataToSignature = (
  methodName: string,
  fields: FieldData[]
) => {
  return `${methodName}(${fields.map((field) => field.type)})`;
};

export const createParameters = (web3: Web3, fields: FieldDataWithValue[]) => {
  if (fields.some((field) => !field.value)) {
    return "";
  }
  try {
    const params = web3.eth.abi.encodeParameters(
      fields.map((field) => field.type),
      fields.map((field) => field.value)
    );
    return params || "";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return "";
  }
};

export const createCalldata = (
  web3: Web3,
  methodName: string,
  fields: FieldDataWithValue[]
) => {
  if (fields.some((field) => !field.value)) {
    return "";
  }

  try {
    const methodSignature = web3.eth.abi.encodeFunctionSignature(
      _remapMethodDataToSignature(methodName, fields)
    );

    const params = createParameters(web3, fields);
    if (!methodSignature || !params) {
      return "";
    }

    const data = methodSignature + params.slice(2);
    return data;
  } catch {
    return "";
  }
};

export const objectWithoutBigNumber = (obj: object): object => {
  const stringResult = JSON.stringify(obj, (_, value) => {
    if (typeof value === "bigint") {
      return Number(String(value));
    }
    return value;
  });
  return JSON.parse(stringResult);
};

export const parseEventData = (event: EventLog | string): EventData | null => {
  if (typeof event === "string") {
    return null;
  }
  return {
    name: event.event,
    values: _remapObject(event.returnValues),
    fullData: objectWithoutBigNumber(event),
  };
};
