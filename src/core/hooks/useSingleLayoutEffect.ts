import { useLayoutEffect, useRef } from "react";
import { useLatestRef } from "./useLatestRef";

export const useSingleLayoutEffect = (callback: () => void) => {
  const callbackRef = useLatestRef(callback);
  const countRef = useRef(0);
  useLayoutEffect(() => {
    if (countRef.current < 1) {
      callbackRef.current?.();
    }
    countRef.current++;
  }, [callbackRef]);
};
