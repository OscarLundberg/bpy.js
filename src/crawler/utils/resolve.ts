export function resolveType(str: string) {
  let output: Record<string, string | boolean | string[]> = {
    comment: str
  }
  const setType = (type: string) => {
    output.type = type;
    if (str.includes(`${type} set`)) { flag("isArray") };
    return output;
  }
  const flag = (key: string) => {
    output[key] = true;
    return output;
  }

  const enumMatch = () => {
    const pat = new RegExp(/(?:enum[^[{]+(?:\[|\{))([^\}\]]*)/, "s");
    const values = str.match(pat)
    output.enumValues = values?.[1].split(",").map(e => e.replace(/'/g, "")) ?? []
    return setType("enum");
  }

  if (str.includes("optional")) { flag("optional"); }
  if (str.includes("never None")) { flag("notNull"); }

  if (str.includes("float")) { return setType("number"); }
  if (str.includes("int")) { return setType("number"); }
  if (str.includes("boolean")) { return setType("boolean"); }
  if (str.includes("string")) { return setType("string"); }
  if (str.includes("enum")) { return enumMatch(); }
  return setType("unknown");
}