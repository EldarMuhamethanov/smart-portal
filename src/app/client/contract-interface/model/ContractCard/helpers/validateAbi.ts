export function isValidContractABI(abiStr: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let abi: any;
  try {
    abi = JSON.parse(abiStr);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log("e", e);
    return false;
  }

  if (!Array.isArray(abi)) {
    return false;
  }

  return abi.every((item) => {
    if (typeof item !== "object" || item === null) {
      return false;
    }

    // Проверка обязательных полей
    if (!item.type || typeof item.type !== "string") {
      return false;
    }

    // Проверка специфичных полей для разных типов
    switch (item.type) {
      case "function":
        return isValidFunction(item);
      case "constructor":
        return isValidConstructor(item);
      case "event":
        return isValidEvent(item);
      case "fallback":
      case "receive":
        return isValidFallbackOrReceive(item);
      default:
        return false;
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidFunction(func: any) {
  if (!func.name || typeof func.name !== "string") {
    return false;
  }
  if (!Array.isArray(func.inputs)) {
    return false;
  }
  if (!Array.isArray(func.outputs)) {
    return false;
  }
  if (
    func.stateMutability &&
    !["pure", "view", "nonpayable", "payable"].includes(func.stateMutability)
  ) {
    return false;
  }
  return (
    func.inputs.every(isValidParameter) && func.outputs.every(isValidParameter)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidConstructor(constructor: any) {
  if (!Array.isArray(constructor.inputs)) {
    return false;
  }
  return constructor.inputs.every(isValidParameter);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidEvent(event: any) {
  if (!event.name || typeof event.name !== "string") {
    return false;
  }
  if (!Array.isArray(event.inputs)) {
    return false;
  }
  return event.inputs.every(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (input: any) =>
      isValidParameter(input) && typeof input.indexed === "boolean"
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidFallbackOrReceive(func: any) {
  return Object.keys(func).length === 1 || func.stateMutability === "payable";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidParameter(param: any) {
  if (typeof param.name !== "string") {
    return false;
  }
  if (typeof param.type !== "string") {
    return false;
  }
  return true;
}
