import { ScrapeResult } from "scrape-it";
import { Crawler } from "../docs-crawler";
import { URL } from "./url";

export abstract class ScraperFragment<TIn, TOut> {
  protected url: URL;
  constructor(protected parent: Crawler, protected path: string) {
    this.url = new URL(parent, path);
  }
  protected abstract scrape(): Promise<ScrapeResult<TIn>>;
  protected abstract map(arg: TIn): TOut;
  public async yield() {
    const scrape = await this.scrape();
    return this.map(scrape.data);
  }
}