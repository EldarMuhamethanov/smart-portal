export function stringSplice(
  str: string,
  start = 0,
  count = 0,
  newSymbols = ""
): string {
  const newString = str.split("");
  newString.splice(start, count, ...newSymbols.split(""));
  return newString.join("");
}
