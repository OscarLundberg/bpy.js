import { Crawler } from "./crawler/docs-crawler";
import fs, { mkdtemp, } from "fs/promises"
import path from "path";
import { existsSync } from 'fs';
import { CodeGenerator } from "./codegen/generator";

const crawler = new Crawler();
const generator = new CodeGenerator();
(async () => {
  const crawlResult = await crawler.crawl();
  const files = generator.generate(crawlResult);
  const folder = "src/generated";
  if(!existsSync(folder)){
    await fs.mkdir(folder);
  }
  for (let file of files) {
    const filename = file.args[0];
    const contents = file.resolve();
    await fs.writeFile(path.resolve(folder, filename + ".ts"), contents);
  }
})();