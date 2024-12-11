import { MappedFunction } from "../../crawler/fragments/functions";


export function isEnum(t: MappedFunction["params"][number]["type"]) {
  return (t.type === "enum");
}
export function getTypeName(t: MappedFunction["params"][number]["type"]) {
  if (t.type === "enum") {
    const _hash = hash(JSON.stringify(t.enumValues));
    return `bpy_enums.E_${_hash}`;
  }
  else {
    return t.type;
  }
}

export function hash(str: string) {
  if (str.length % 32 > 0) str += Array(33 - str.length % 32).join("z");
  var hash = '', bytes = [], i = 0, j = 0, k = 0, a = 0, dict = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (i = 0; i < str.length; i++) {
    let ch = str.charCodeAt(i);
    bytes[j++] = (ch < 127) ? ch & 0xFF : 127;
  }
  var chunk_len = Math.ceil(bytes.length / 32);
  for (i = 0; i < bytes.length; i++) {
    j += bytes[i];
    k++;
    if ((k == chunk_len) || (i == bytes.length - 1)) {
      a = Math.floor(j / k);
      if (a < 32)
        hash += '0';
      else if (a > 126)
        hash += 'z';
      else
        hash += dict[Math.floor((a - 32) / 2.76)];
      j = k = 0;
    }
  }
  return hash;
}
