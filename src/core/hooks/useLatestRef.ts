import { RefObject, useRef } from "react";

export function useLatestRef<T>(value: T): RefObject<T> {
  const valueRef = useRef(value);
  valueRef.current = value;
  return valueRef;
}
