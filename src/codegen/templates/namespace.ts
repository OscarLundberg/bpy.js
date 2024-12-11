import { template } from "./base";


export function safeNamespace(str: string) {
  return str.split(".").filter(e => e).join("_");
}

export const NamespaceTemplate = template((contents: string, name: string) => {
  return [
    `namespace ${name} {`,
    contents,
    `}`
  ].join("\n");
});