function arrayOrObj(key: string | number): [] | Record<string, any> {
  const char = (key + "").charCodeAt(0);
  return char < 48 || char > 57 ? {} : [];
}
export function unflatto<Input extends Record<string, any>, Output = unknown>(
  input: Input,
  seperator?: string
): Output {
  let i = 0,
    ancestor: any,
    chunk: string,
    keys: string[],
    parent: any,
    currentKey: string,
    nextKey: string,
    cValue: any;
  seperator = seperator || ".";
  for (chunk in input) {
    i = 0;
    nextKey = "";
    keys = chunk.split(seperator);
    parent = ancestor || arrayOrObj(keys[0]);
    ancestor = ancestor || parent;
    for (; i < keys.length; i++) {
      currentKey = nextKey || keys[i];
      nextKey = keys[i + 1];
      if (currentKey in parent) {
        parent = parent[currentKey];
      } else {
        cValue = nextKey ? arrayOrObj(nextKey) : input[chunk];
        parent[currentKey] = cValue;
        parent = cValue;
      }
    }
  }
  return ancestor;
}
