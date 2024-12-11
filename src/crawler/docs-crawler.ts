import { serveDocs } from "./docs-server/serve";
import { ModuleScraper } from "./fragments/modules";
import { FunctionScraper, MappedFunction } from "./fragments/functions";

export class Crawler {
  targetPathPrefix = 'bpy';
  remoteUrl = "";
  localUrl = ""
  visitedPaths: string[] = [];
  docsServer: { stop(): void } = { stop() { } }
  urlsToProcess: Record<string, any> = {}
  seenFunctions: MappedFunction[] = []
  entrypoints = [
    // "bpy.context",
    // "bpy.data",
    // "bpy.msgbus",
    "bpy.ops",
    // "bpy.types",
    // "bpy.utils",
    // "bpy.app",
    // "bpy.props",
    // "bpy.path",
  ]

  async crawl(...[version = "v3.6", port = 3123]: Parameters<typeof serveDocs>) {
    this.localUrl = `http://localhost:${port}`;
    this.remoteUrl = `http://docs.blender.org/api/${version?.replace("v", "")}`
    this.docsServer = await serveDocs(version, port);

    for (let entry of this.entrypoints) {
      await this.scrape(entry);
    }

    this.docsServer.stop();
    return this.seenFunctions
  }

  async scrape(path: string) {
    if (this.visitedPaths.includes(path)) { return; }
    this.visitedPaths = [...this.visitedPaths, path]

    const submodules = new ModuleScraper(this, path);
    const functions = new FunctionScraper(this, path);

    const modulesToVisit = await submodules.yield();
    const fns = await functions.yield();
    this.seenFunctions = [...this.seenFunctions, ...fns];

    for (let module of modulesToVisit) {
      try {
        await this.scrape(module);
      } catch (err) {
        console.log(`Could not scrape ${module}`);
      }
    }
  }
}
