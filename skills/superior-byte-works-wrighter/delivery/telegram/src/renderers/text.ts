import type {
  BlockContent,
  Heading,
  InlineCode,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  Strong,
  Emphasis,
  Delete,
  Link,
  Text as MdastText,
  Break,
  Blockquote,
  ThematicBreak,
  Code,
  Table,
} from "mdast";
import type { TextRenderContext, ListRenderOptions } from "../types.js";
import { escapeAttribute, escapeHtml, hasAllowedProtocol } from "../utils/html.js";

type InlineMathNode = {
  type: "inlineMath";
  value?: string;
};

export type RenderableBlock =
  | Paragraph
  | Heading
  | List
  | Blockquote
  | ThematicBreak
  | Code
  | Table;

export function renderParagraph(node: Paragraph, context: TextRenderContext): string {
  const content = renderInlineChildren(node.children, context);
  return content.trim();
}

export function renderHeading(node: Heading, context: TextRenderContext): string {
  const text = renderInlineChildren(node.children, context).trim();
  if (!text) {
    return "";
  }
  if (node.depth === 1) {
    return `<b><u>${text}</u></b>`;
  }
  if (node.depth === 2) {
    return `<b>${text}</b>`;
  }
  return `<b>${text}</b>`;
}

export function renderList(node: List, context: TextRenderContext): string {
  const options: ListRenderOptions = {
    ordered: Boolean(node.ordered),
    depth: 0,
    start: node.start ?? 1,
  };
  return renderListItems(node.children, options, context).join("\n");
}

function renderListItems(
  items: ListItem[],
  options: ListRenderOptions,
  context: TextRenderContext,
): string[] {
  const lines: string[] = [];
  const indent = "  ".repeat(options.depth);
  items.forEach((item, index) => {
    const marker = options.ordered ? `${(options.start ?? 1) + index}.` : "•";

    const childLines: string[] = [];
    item.children.forEach((childNode: ListItem["children"][number]) => {
      const child = childNode as BlockContent;
      if (child.type === "paragraph") {
        childLines.push(renderParagraph(child as Paragraph, context));
      } else if (child.type === "list") {
        const listChild = child as List;
        const nested = renderListItems(
          listChild.children,
          {
            ordered: Boolean(listChild.ordered),
            depth: options.depth + 1,
            start: listChild.start ?? 1,
          },
          context,
        );
        nested.forEach((line) => lines.push(line));
      } else {
        const rendered = renderBlock(child, context);
        if (rendered) {
          childLines.push(rendered);
        }
      }
    });

    const firstLine = childLines.shift() ?? "";
    const prefix = `${indent}${marker} `;
    lines.push(`${prefix}${firstLine}`.trimEnd());
    childLines.forEach((line) => {
      lines.push(`${indent}  ${line}`.trimEnd());
    });
  });
  return lines;
}

export function renderBlock(node: BlockContent, context: TextRenderContext): string {
  switch (node.type) {
    case "paragraph":
      return renderParagraph(node, context);
    case "heading":
      return renderHeading(node, context);
    case "list":
      return renderList(node, context);
    case "blockquote":
      return renderBlockquote(node, context);
    case "thematicBreak":
      return "────────";
    case "code":
      return renderCodeBlock(node);
    case "table":
      return "";
    default:
      return "";
  }
}

export function renderBlockquote(node: Blockquote, context: TextRenderContext): string {
  const parts: string[] = [];
  for (const childNode of node.children) {
    const rendered = renderBlock(childNode as BlockContent, context);
    if (rendered) {
      parts.push(rendered);
    }
  }
  const content = parts.join("\n");
  if (!content.trim()) {
    return "";
  }
  return `<blockquote>${content.trim()}</blockquote>`;
}

export function renderCodeBlock(node: Code): string {
  const code = escapeHtml(node.value ?? "");
  const language = node.lang ? ` class="language-${escapeAttribute(node.lang)}"` : "";
  return `<pre><code${language}>${code}</code></pre>`;
}

export function renderInlineChildren(nodes: PhrasingContent[], context: TextRenderContext): string {
  return nodes.map((child) => renderInline(child, context)).join("");
}

export function renderInline(node: PhrasingContent, context: TextRenderContext): string {
  switch (node.type) {
    case "text":
      return escapeHtml((node as MdastText).value ?? "");
    case "strong":
      return renderStrong(node as Strong, context);
    case "emphasis":
      return renderEmphasis(node as Emphasis, context);
    case "delete":
      return renderDelete(node as Delete, context);
    case "inlineCode":
      return renderInlineCode(node as InlineCode);
    case "link":
      return renderLink(node as Link, context);
    case "break":
      return renderBreak(node as Break);
    case "inlineMath":
      return renderInlineMath(node as InlineMathNode);
    default:
      return "";
  }
}

function renderStrong(node: Strong, context: TextRenderContext): string {
  const inner = renderInlineChildren(node.children, context);
  return `<b>${inner}</b>`;
}

function renderEmphasis(node: Emphasis, context: TextRenderContext): string {
  const inner = renderInlineChildren(node.children, context);
  return `<i>${inner}</i>`;
}

function renderDelete(node: Delete, context: TextRenderContext): string {
  const inner = renderInlineChildren(node.children, context);
  return `<s>${inner}</s>`;
}

function renderInlineCode(node: InlineCode): string {
  return `<code>${escapeHtml(node.value ?? "")}</code>`;
}

function renderLink(node: Link, context: TextRenderContext): string {
  const href = node.url ?? "";
  const text = renderInlineChildren(node.children, context);
  if (!href) {
    return text;
  }
  if (!hasAllowedProtocol(href)) {
    return text;
  }
  return `<a href="${escapeAttribute(href)}">${text}</a>`;
}

function renderBreak(_: Break): string {
  return "<br/>";
}

function renderInlineMath(node: InlineMathNode): string {
  const value = node.value?.trim();
  if (!value) {
    return "";
  }
  return `⟨${escapeHtml(value)}⟩`;
}

export function renderInlinePlain(nodes: PhrasingContent[], context: TextRenderContext): string {
  return nodes
    .map((node) => renderInline(node, context))
    .join("")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
