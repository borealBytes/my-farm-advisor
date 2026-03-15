import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { nanoid } from "nanoid";
import stripHtml from "strip-html";

type OpenBuilderModule = typeof import("../../offline-html-open/dist/index.js");

export interface BuildOfflineHtmlSealedOptions {
  outputDir?: string;
}

export interface OfflineHtmlSealedResult {
  frontmatter: Record<string, unknown>;
  content: string;
  htmlPath: string;
  fileName: string;
  summary: string;
  deliveryId: string;
  fingerprintId: string;
  principals: string[];
  protection: string;
}

export async function buildOfflineHtmlSealed(
  input: { raw: string; sourcePath?: string },
  options: BuildOfflineHtmlSealedOptions = {},
): Promise<OfflineHtmlSealedResult> {
  const openBuilder = await loadOpenBuilder();
  const openResult = await openBuilder(input, {
    outputDir: options.outputDir,
  });

  const deliveryConfig = extractDeliveryConfig(openResult.frontmatter);
  const fingerprintId = deliveryConfig.fingerprintId ?? `sealed-${nanoid(12)}`;
  const deliveryId = deliveryConfig.deliveryId ?? openResult.deliveryId ?? `sealed-${nanoid(12)}`;
  const principals = deliveryConfig.principals;
  const protection = deliveryConfig.protection;
  const passphrase = deliveryConfig.passphrase;
  const passphraseHint = deliveryConfig.passphraseHint;

  const html = await fs.readFile(openResult.htmlPath, "utf8");
  const sealedHtml = applySealedTransforms(html, {
    deliveryId,
    fingerprintId,
    principals,
    protection,
    passphrase,
    passphraseHint,
    summary: openResult.summary,
  });
  await fs.writeFile(openResult.htmlPath, sealedHtml, "utf8");

  return {
    ...openResult,
    deliveryId,
    fingerprintId,
    principals,
    protection,
  };
}

async function loadOpenBuilder(): Promise<OpenBuilderModule["buildOfflineHtmlOpen"]> {
  const moduleUrl = new URL("../../offline-html-open/dist/index.js", import.meta.url);
  const mod = (await import(moduleUrl.href)) as OpenBuilderModule;
  if (typeof mod.buildOfflineHtmlOpen !== "function") {
    throw new Error("offline-html-open build output missing buildOfflineHtmlOpen");
  }
  return mod.buildOfflineHtmlOpen;
}

function extractDeliveryConfig(frontmatter: Record<string, unknown>): {
  deliveryId?: string;
  fingerprintId?: string;
  principals: string[];
  protection: string;
  passphrase?: string;
  passphraseHint?: string;
} {
  const raw = frontmatter.delivery;
  if (!raw || typeof raw !== "object") {
    return {
      principals: [],
      protection: "none",
    };
  }
  const config = raw as Record<string, unknown>;
  const principals = Array.isArray(config.principals)
    ? config.principals
        .filter((value) => typeof value === "string" && value.trim())
        .map((value) => value.trim())
    : [];
  const protection = normalizeProtection(config.protection);
  return {
    deliveryId: normalizeString(config.delivery_id ?? config.deliveryId),
    fingerprintId: normalizeString(config.fingerprint_id ?? config.fingerprintId),
    principals,
    protection,
    passphrase: normalizeString(config.passphrase),
    passphraseHint: normalizeString(config.passphrase_hint ?? config.passphraseHint),
  };
}

function normalizeProtection(value: unknown): string {
  if (typeof value !== "string") {
    return "none";
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "local-unlock" || normalized === "principal-unlock" || normalized === "none") {
    return normalized;
  }
  return "none";
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
}

function applySealedTransforms(
  html: string,
  params: {
    deliveryId: string;
    fingerprintId: string;
    principals: string[];
    protection: string;
    passphrase?: string;
    passphraseHint?: string;
    summary: string;
  },
): string {
  const manifest = {
    delivery_id: params.deliveryId,
    fingerprint_id: params.fingerprintId,
    principals: params.principals,
    protection: params.protection,
    summary: params.summary,
  };

  const metaBlock = `
    <meta name="wrighter-fingerprint-id" content="${escapeAttribute(params.fingerprintId)}">
    <meta name="wrighter-protection" content="${escapeAttribute(params.protection)}">
    <meta name="wrighter-principals" content="${escapeAttribute(JSON.stringify(params.principals))}">
    <script type="application/json" id="wrighter-delivery-manifest">${escapeHtml(
      JSON.stringify(manifest, null, 2),
    )}</script>
  `;

  let enrichedHtml = html.replace(
    /<head([^>]*)>/i,
    (match) => `${match.trim()}
${metaBlock}`,
  );

  enrichedHtml = enrichedHtml.replace(/<body([^>]*)>/i, (match, attrs) => {
    const nextAttrs = attrs ?? "";
    const additions = ` data-wrighter-delivery="${escapeAttribute(params.deliveryId)}" data-wrighter-fingerprint="${escapeAttribute(params.fingerprintId)}"`;
    return `<body${nextAttrs}${additions}>${lockOverlayIfNeeded(params)}`;
  });

  const watermarkComment = `<!-- wrighter-fingerprint ${params.fingerprintId} delivery ${params.deliveryId} principals ${params.principals.join(",")} -->`;
  enrichedHtml = enrichedHtml.replace(
    /<\/body>/i,
    `${watermarkComment}
</body>`,
  );

  return enrichedHtml;
}

function lockOverlayIfNeeded(params: {
  protection: string;
  passphrase?: string;
  passphraseHint?: string;
  deliveryId: string;
  fingerprintId: string;
}): string {
  if (params.protection === "none") {
    return "";
  }
  const hint = params.passphraseHint
    ? `<p class="unlock-hint">Hint: ${escapeHtml(params.passphraseHint)}</p>`
    : "";
  const message =
    params.protection === "principal-unlock"
      ? "Enter a principal passphrase to unlock"
      : "Enter the delivery passphrase to unlock";
  const passphraseScript = `
    (function() {
      const payload = document.querySelector('.document-body');
      if (!payload) return;
      const overlay = document.getElementById('wrighter-lock-overlay');
      const form = document.getElementById('wrighter-lock-form');
      const input = document.getElementById('wrighter-lock-input');
      const error = document.getElementById('wrighter-lock-error');
      payload.setAttribute('hidden', 'hidden');
      overlay.removeAttribute('hidden');
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        var expected = ${params.passphrase ? JSON.stringify(params.passphrase) : "null"};
        var value = (input.value || '').trim();
        if (!expected || value === expected) {
          overlay.setAttribute('hidden', 'hidden');
          payload.removeAttribute('hidden');
        } else {
          error.textContent = 'Incorrect passphrase';
          error.removeAttribute('hidden');
        }
      });
    })();
  `;
  return `
  <div id="wrighter-lock-overlay" class="lock-overlay" hidden>
    <div class="lock-modal">
      <h2>Protected Delivery</h2>
      <p>${escapeHtml(message)}</p>
      ${hint}
      <form id="wrighter-lock-form">
        <input id="wrighter-lock-input" type="password" autocomplete="off" placeholder="Passphrase">
        <button type="submit">Unlock</button>
      </form>
      <p id="wrighter-lock-error" class="lock-error" hidden></p>
    </div>
  </div>
  <style>
    .lock-overlay {
      position: fixed;
      inset: 0;
      backdrop-filter: blur(18px);
      background: rgba(15, 23, 42, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .lock-modal {
      background: rgba(255, 255, 255, 0.95);
      padding: 2.5rem;
      border-radius: 1.25rem;
      box-shadow: 0 32px 60px rgba(15, 23, 42, 0.25);
      max-width: 420px;
      width: 90%;
      color: #0f172a;
      text-align: center;
    }
    .lock-modal h2 {
      margin-top: 0;
      margin-bottom: 0.75rem;
    }
    .lock-modal form {
      margin-top: 1.5rem;
      display: grid;
      gap: 0.75rem;
    }
    #wrighter-lock-input {
      padding: 0.85rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(15, 23, 42, 0.15);
      font-size: 1rem;
    }
    #wrighter-lock-form button {
      padding: 0.85rem;
      border-radius: 0.75rem;
      border: none;
      background: #2563eb;
      color: white;
      font-size: 1rem;
      cursor: pointer;
    }
    #wrighter-lock-error {
      color: #be123c;
      margin: 0;
    }
  </style>
  <script>${passphraseScript}</script>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

export function summarizeHtml(html: string): string {
  return stripHtml(html).result.replace(/\s+/g, " ").trim().slice(0, 360);
}

export async function extractDeliverySummary(raw: string): Promise<string> {
  const parsed = matter(raw ?? "");
  const content = parsed.content ?? "";
  return stripHtml(content).result.replace(/\s+/g, " ").trim().slice(0, 360);
}
