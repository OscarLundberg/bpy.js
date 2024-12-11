import scrapeIt from "scrape-it";
import { ScraperFragment } from "../utils/fragment";

type ScrapedModule = { entries: { href: string }[] };
export class ModuleScraper extends ScraperFragment<ScrapedModule, string[]> {
  async scrape() {
    return await scrapeIt<ScrapedModule>(this.url.local, {
      entries: {
        listItem: "a",
        data: {
          href: { attr: "href" }
        }
      }
    });
  }

  protected map(arg: ScrapedModule) {
    return arg.entries.filter(e => e.href.startsWith(this.url.path)).map(e => e.href.replace(".html", ""));
  }
}