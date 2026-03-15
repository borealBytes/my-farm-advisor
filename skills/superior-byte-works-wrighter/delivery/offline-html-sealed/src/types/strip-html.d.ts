declare module "strip-html" {
  export interface StripHtmlResult {
    result: string;
  }

  export default function stripHtml(value: string): StripHtmlResult;
}
