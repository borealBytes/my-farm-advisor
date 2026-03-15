import { promises as fs } from "fs";
import path from "path";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { SVG } from "mathjax-full/js/output/svg.js";
import sharp from "sharp";
import type { MediaAsset, MediaRenderContext } from "../types.js";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({ packages: ["base", "ams", "noerrors", "noundefined"] });
const svg = new SVG({ fontCache: "none" });
const mathDocument = mathjax.document("", {
  InputJax: tex,
  OutputJax: svg,
});

export async function renderMathExpression(
  expression: string,
  context: MediaRenderContext,
): Promise<MediaAsset> {
  const trimmed = expression.trim();
  if (!trimmed) {
    throw new Error("Cannot render empty math expression");
  }

  const { outputDir, baseFileName, assetIndex } = context;
  await fs.mkdir(outputDir, { recursive: true });
  const fileName = `${baseFileName}-math-${String(assetIndex).padStart(3, "0")}.png`;
  const finalPath = path.resolve(outputDir, fileName);

  const svgNode = mathDocument.convert(trimmed, {
    display: true,
  });
  const svgMarkup = adaptor.outerHTML(svgNode);

  await sharp(Buffer.from(svgMarkup)).png({ compressionLevel: 9 }).toFile(finalPath);

  const stats = await fs.stat(finalPath);

  return {
    type: "photo",
    filePath: finalPath,
    sizeBytes: stats.size,
    role: "math",
    caption: trimmed,
  };
}
