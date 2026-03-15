import type { Table, TableCell, TableRow } from "mdast";
import type { TableRenderOptions, TextRenderContext } from "../types.js";
import { escapeHtml } from "../utils/html.js";
import { renderInlineChildren } from "./text.js";

const DEFAULT_MAX_WIDTH = 80;

export function renderTable(
  table: Table,
  context: TextRenderContext,
  options: TableRenderOptions = {},
): string {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const rows = table.children.map((row: TableRow) => renderRow(row, context));
  if (!rows.length) {
    return "";
  }

  const columnCount = Math.max(...rows.map((row: string[]) => row.length));
  const widths = Array.from({ length: columnCount }, (_, index) =>
    Math.min(maxWidth, Math.max(...rows.map((row: string[]) => (row[index] ?? "").length))),
  );

  const lines: string[] = [];
  const header = rows[0];
  lines.push(formatRow(header, widths));
  lines.push(formatSeparator(widths));

  for (let i = 1; i < rows.length; i += 1) {
    lines.push(formatRow(rows[i], widths));
  }

  return `<pre>${escapeHtml(lines.join("\n"))}</pre>`;
}

function renderRow(row: TableRow, context: TextRenderContext): string[] {
  return row.children.map((cell: TableCell) => renderCell(cell, context));
}

function renderCell(cell: TableCell, context: TextRenderContext): string {
  const text = renderInlineChildren(cell.children, context)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function formatRow(cells: string[], widths: number[]): string {
  return cells
    .map((cell, index) => {
      const width = widths[index] ?? widths[widths.length - 1] ?? 0;
      return cell.padEnd(width, " ");
    })
    .join(" │ ")
    .trimEnd();
}

function formatSeparator(widths: number[]): string {
  return widths.map((width) => "─".repeat(width)).join("─┼─");
}
