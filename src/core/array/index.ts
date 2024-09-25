export function optionalArray<T>(
  array: Array<T | null | undefined | false>
): Array<T> {
  const newArray: T[] = [];
  array.forEach((item) => {
    if (!!item) {
      newArray.push(item);
    }
  });
  return newArray;
}
