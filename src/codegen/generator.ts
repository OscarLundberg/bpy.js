import { MappedFunction } from "../crawler/fragments/functions";
import { lazy } from "./templates/base";
import { FunctionTemplate } from "./templates/function";
import { NamespaceTemplate, safeNamespace } from "./templates/namespace";

export class CodeGenerator {
  private seenEnums: Record<string, { values: string[], idx: number }> = {}
  public flagEnum(hash: string, values: string[]) {
    if (this.seenEnums?.[hash]) {
      return this.seenEnums[hash].idx;
    }
    const idx = Object.values(this.seenEnums).length + 1;
    this.seenEnums = {
      ...this.seenEnums,
      [hash]: {
        values,
        idx
      }
    }
    return idx;
  }
  groupByNamespace(funcs: MappedFunction[]) {
    return Object.entries(
      funcs.reduce((prev, cur) => {
        const groupName = cur.module;
        return {
          ...prev,
          [groupName]: [...(prev?.[groupName] ?? []), cur]
        }
      }, {} as Record<string, MappedFunction[]>)
    );
  }

  generateFunctions(fns: MappedFunction[]) {
    const ref = this;
    return fns.map(fn =>
      FunctionTemplate(
        fn,
        ref
      )
    );
  }

  generateNamespace(namespace: string, fns: MappedFunction[]) {
    const name = safeNamespace(namespace);
    const functions = this.generateFunctions(fns);
    return NamespaceTemplate(name)
      .children(...functions);
  }

  generateEnums() {
    return Object.entries(this.seenEnums).map(([key, val]) => {
      return `export enum Enum_${val.idx} { ${[...new Set(val.values)].map(e => `'${e}'`).join(",")} };`
    }).join("\n");
  }

  generate(funcs: MappedFunction[]) {
    const namespaces = this.groupByNamespace(funcs)
      .map(([namespace, fns]) =>
        this.generateNamespace(namespace, fns)
      );

    const enumNamespace = NamespaceTemplate("bpy_enums")
      .children(
        lazy(() => this.generateEnums())
      );

    return [
      ...namespaces,
      enumNamespace
    ]
  }
}
