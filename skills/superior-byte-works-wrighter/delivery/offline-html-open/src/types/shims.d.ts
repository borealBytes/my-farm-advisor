declare module "unified" {
  interface Processor {
    use: (...args: any[]) => Processor;
    process: (value: any) => Promise<any>;
  }
  export function unified(): Processor;
}

declare module "remark-parse" {
  const plugin: any;
  export default plugin;
}

declare module "remark-gfm" {
  const plugin: any;
  export default plugin;
}

declare module "remark-math" {
  const plugin: any;
  export default plugin;
}

declare module "remark-rehype" {
  const plugin: any;
  export default plugin;
}

declare module "rehype-raw" {
  const plugin: any;
  export default plugin;
}

declare module "rehype-stringify" {
  const plugin: any;
  export default plugin;
}

declare module "rehype-slug" {
  const plugin: any;
  export default plugin;
}

declare module "rehype-autolink-headings" {
  const plugin: any;
  export default plugin;
}

declare module "rehype-katex" {
  const plugin: any;
  export default plugin;
}
