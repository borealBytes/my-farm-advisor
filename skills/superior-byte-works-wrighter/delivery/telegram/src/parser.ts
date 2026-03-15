import matter from "gray-matter";
import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { ParsedWrighterDocument, WrighterDeliveryInput } from "./types.js";

const processor = unified().use(remarkParse).use(remarkMath).use(remarkGfm);

export function parseWrighterDocument(input: WrighterDeliveryInput): ParsedWrighterDocument {
  const { frontmatter, content } = extractFrontmatter(input.raw);
  const tree = parseMarkdown(content);
  return {
    frontmatter,
    content,
    tree,
  };
}

function extractFrontmatter(raw: string): {
  frontmatter: Record<string, unknown>;
  content: string;
} {
  const parsed = matter(raw);
  return {
    frontmatter: parsed.data ?? {},
    content: parsed.content.trim(),
  };
}

function parseMarkdown(content: string): Root {
  const tree = processor.parse(content) as Root;
  return processor.runSync(tree) as Root;
}
