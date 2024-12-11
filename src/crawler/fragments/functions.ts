import { ScraperFragment } from '../utils/fragment';
import scrapeIt from "scrape-it";
import { resolveType } from "../utils/resolve";

export type ScrapedFunctions = {
  entries: {
    module: string,
    name: string,
    href: string,
    summary: string,
    fieldList: {
      returns: string[],
      params: {
        name: string,
        types: string[],
      }[],
    },
  }[]
}

export type MappedFunction = {
  href: string;
  params: {
    type: Record<string, string | boolean | string[]>;
    name: string;
  }[];
  module: string;
  name: string;
  summary: string;
}

export class FunctionScraper extends ScraperFragment<ScrapedFunctions, MappedFunction[]> {
  async scrape() {
    return await scrapeIt<ScrapedFunctions>(this.url.local, {
      entries: {
        listItem: "dl.py.function",
        data: {
          module: ".sig-prename",
          name: ".sig-name",
          href: { selector: ".headerlink", attr: "href" },
          summary: "dd > p",
          fieldList: {
            selector: ".field-list",
            data: {
              returns: {
                listItem: "dt:not(:has(ul)), dd:not(:has(ul))"
              },
              params: {
                listItem: "ul.simple > li",
                data: {
                  name: "strong",
                  types: {
                    listItem: "em, .reference.internal > * > pre",
                  }
                }

              }
            }
          }
        }
      }
    });
  }

  private mapSingle({ fieldList, href, ...rest }: ScrapedFunctions["entries"][number]): MappedFunction {
    return {
      ...rest,
      href: `${this.url.remote}.html${href}`,
      params: fieldList.params.map(({ types, name }) => {
        return { name, type: resolveType(types.join("")) }
      }).filter(e => e.name.length > 0)
    }
  }

  map(scrapeResult: ScrapedFunctions) {
    
    return scrapeResult.entries.map(fn => this.mapSingle(fn));
  }
}
