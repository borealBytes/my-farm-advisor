import type { Root } from "mdast";

export interface WrighterDeliveryInput {
  /** The raw Wrighter document including optional frontmatter */
  raw: string;
  /** Optional path for diagnostics */
  sourcePath?: string;
}

export interface ParsedWrighterDocument {
  frontmatter: Record<string, unknown>;
  content: string;
  tree: Root;
}

export type TelegramMessage = TelegramTextMessage | TelegramPhotoMessage | TelegramDocumentMessage;

export interface BaseTelegramMessage {
  kind: string;
  order: number;
}

export interface TelegramTextMessage extends BaseTelegramMessage {
  kind: "text";
  html: string;
  plainTextLength: number;
}

export interface TelegramPhotoMessage extends BaseTelegramMessage {
  kind: "photo";
  filePath: string;
  caption?: string;
  captionLength?: number;
  width?: number;
  height?: number;
  sizeBytes?: number;
  role?: "mermaid" | "math" | "image" | "table";
  mimeType?: string;
}

export interface TelegramDocumentMessage extends BaseTelegramMessage {
  kind: "document";
  filePath: string;
  caption?: string;
  captionLength?: number;
  mimeType?: string;
  sizeBytes?: number;
  role?: string;
}

export interface MediaAsset {
  type: "photo" | "document";
  filePath: string;
  caption?: string;
  role?: string;
  sizeBytes?: number;
}

export interface ValidationIssue {
  code: string;
  severity: "error" | "warning";
  message: string;
  target?: string;
  value?: number;
  limit?: number;
}

export interface ValidationReport {
  passed: boolean;
  issues: ValidationIssue[];
}

export interface TelegramDeliveryResult {
  frontmatter: Record<string, unknown>;
  messages: TelegramMessage[];
  assets: MediaAsset[];
  validation: ValidationReport;
  stats: DeliveryStats;
}

export interface DeliveryStats {
  totalMessages: number;
  textMessages: number;
  mediaMessages: number;
  attachments: number;
  totalBytes: number;
}

export interface DeliveryOptions {
  outputDir?: string;
  maxTextLength?: number;
  maxCaptionLength?: number;
  filePrefix?: string;
  linkPreview?: boolean;
  renderers?: Partial<RendererOverrides>;
}

export interface RendererOverrides {
  renderMermaid: RenderMermaidFn;
  renderMath: RenderMathFn;
}

export interface MediaRenderContext {
  outputDir: string;
  baseFileName: string;
  assetIndex: number;
}

export type RenderMermaidFn = (code: string, context: MediaRenderContext) => Promise<MediaAsset>;

export type RenderMathFn = (expression: string, context: MediaRenderContext) => Promise<MediaAsset>;

export interface CaptionProcessingResult {
  caption?: string;
  overflow?: string;
}

export interface TextRenderContext {
  allowLinkPreview?: boolean;
}

export interface ListRenderOptions {
  ordered: boolean;
  depth: number;
  start?: number;
}

export interface TableRenderOptions {
  maxWidth?: number;
}

export interface ChunkOptions {
  maxLength: number;
}

export interface ChunkResult {
  chunks: string[];
}
