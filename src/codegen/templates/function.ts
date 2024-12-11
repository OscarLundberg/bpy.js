import { MappedFunction } from "../../crawler/fragments/functions";
import { CodeGenerator } from "../generator";
import { getTypeName, hash, isEnum } from "../utils/typename";
import { template } from "./base";



export const FunctionTemplate = template((contents: string, func: MappedFunction, gen: CodeGenerator) => {
  const argNames = func.params.map((e, i) => e.name.trim() || `param_${i}`);
  const typedArgs = func.params.map((e, i) => {
    if (isEnum(e.type)) {
      const _hash = hash(JSON.stringify(e.type.enumValues));
      const idx = gen.flagEnum(_hash, e.type.enumValues as string[]);
      return `${e.name.trim() ?? `param_${i}`}:bpy_enums.Enum_${idx}`;
    }
    return `${e.name.trim() ?? `param_${i}`}${e?.type?.optional ? "?" : ""}:${getTypeName(e.type)}`
  })

  // ${param.name.trim() ?? `param_${i}`}: ${getTypeName(param.type)}`

  return [
    "\n",
    `/**`,
    `* @summary ${func.summary}`,
    `* @link ${func.href}`,
    `**/`,
    `export function ${func.name}(${typedArgs.join(", ")}){`,
    `\treturn Runtime.bpy._exec({${argNames.join(", ")}})`,
    `}`,
  ].join("\n");
});