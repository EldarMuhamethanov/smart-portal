export function checkNever(
  value: never,
  message = `unhandled value: ${JSON.stringify(value, null, " ")}`
) {
  console.error(message);
}

export function getValueByCheckedKey<T>(
  key: string | number,
  map: { [items: string]: T }
) {
  if (!map.hasOwnProperty(key)) {
    throw new Error(`getValueByCheckedKey(${key})`);
  }
  return map[key];
}
