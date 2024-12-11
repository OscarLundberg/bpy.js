type RuntimeConfig = { mode: "SPAWN" | "ATTACH" }
namespace Runtime {
  export class bpy {
    private static _config: RuntimeConfig = {
      mode: "SPAWN"
    };

    static configure(config: Partial<RuntimeConfig>) {
      bpy._config = {
        ...bpy._config,
        ...config
      }
    }

    static _exec<TArgs extends any[]>(...args: TArgs) {
      return {};
    }
  }
}