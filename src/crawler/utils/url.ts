import { Crawler } from "../docs-crawler";

export class URL {
  constructor(private parent:Crawler, public path: string){}
  get local() {
    return`${this.parent.localUrl}/${this.path}.html`;
  }
  get remote() {
    return`${this.parent.remoteUrl}/${this.path}`;
  }
}