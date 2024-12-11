abstract class Template<TArgs extends any[] = []> {
  args: TArgs;
  constructor(...args: TArgs) {
    this.args = args;
  }
  protected _children: (Template<any> | string)[] = [];
  public children(...children: (Template<any> | string)[]) {
    this._children = [...this._children, ...children];
    return this;
  }

  protected get contents() {
    let fullText = "";
    for (let child of this._children) {
      if(typeof child == "string"){
        fullText += child;
      }else {
        fullText += child.resolve();
      }
    }
    return fullText;
  }

  public resolve(): string {
    return this.layout(...this.args);
  }


  protected abstract layout(...args: TArgs): string;
}

export function template<T extends any[]>(layout: (contents: string, ...args: T) => string) {
  return (..._args: T) => new class StringTemplate extends Template<T> {
    layout(...args: T) {
      return layout(this.contents, ...args);
    }
  }(..._args);
}

export function lazy(cb:() => string) {
  return template(() => cb())();
}