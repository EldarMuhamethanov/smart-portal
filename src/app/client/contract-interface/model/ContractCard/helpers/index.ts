"use client";

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
  if (
    typeof obj === "string" ||
    typeof obj === "number" ||
    typeof obj === "bigint" ||
    typeof obj === "boolean"
  ) {
    return obj.toString();
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
