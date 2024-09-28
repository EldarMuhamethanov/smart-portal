type StorageKey =
  | "smart-contracts"
  | "environment"
  | `contract-${string}-selected-account`
  | `contract-${string}-expanded`
  | `contract-${string}-gas-custom`
  | `contract-${string}-gas-value`
  | `contract-${string}-custom-methods`;

function setValue<T>(key: StorageKey, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getValue<T>(key: StorageKey): T | null {
  const item = localStorage.getItem(key);
  try {
    return item ? (JSON.parse(item) as T) : null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
}

function removeValue(key: StorageKey) {
  localStorage.removeItem(key);
}

const LocalStorage = {
  setValue,
  getValue,
  removeValue,
};

export { LocalStorage };
