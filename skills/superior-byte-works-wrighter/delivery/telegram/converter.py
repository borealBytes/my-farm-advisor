#!/usr/bin/env python3
"""
Telegram Delivery Converter for WRIGHT skill.

Converts markdown content to Telegram HTML format with inline mermaid diagram rendering.
"""

import re
import subprocess
import tempfile
from pathlib import Path
from typing import Optional


MAX_MSG_LENGTH = 4000


class TelegramConverter:
    """Convert markdown to Telegram HTML and render mermaid diagrams."""

    HTML_TAGS = {
        "**": ("<b>", "</b>"),
        "*": ("<i>", "</i>"),
        "`": ("<code>", "</code>"),
        "~~": ("<s>", "</s>"),
    }

    def __init__(self, output_dir: Optional[Path] = None):
        self.output_dir = output_dir or Path(tempfile.mkdtemp())
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.images: list[str] = []

    def convert(self, markdown: str) -> tuple[str, list[str]]:
        """Convert markdown to Telegram HTML with rendered mermaid diagrams."""
        mermaid_pattern = r"```mermaid\n(.*?)```"

        mermaid_blocks = re.findall(mermaid_pattern, markdown, re.DOTALL)

        for i, code in enumerate(mermaid_blocks):
            png_path = self._render_mermaid(code, i)
            if png_path:
                self.images.append(png_path)
                markdown = markdown.replace(f"```mermaid\n{code}```", f"<i>📊 Diagram {i + 1}</i>")

        html = self._markdown_to_html(markdown)

        return html, self.images

    def _render_mermaid(self, code: str, index: int) -> Optional[str]:
        """Render mermaid code to PNG using mermaid-cli."""
        mmd_path = self.output_dir / f"diagram_{index}.mmd"
        png_path = self.output_dir / f"diagram_{index}.png"

        try:
            mmd_path.write_text(code)

            result = subprocess.run(
                [
                    "mmdc",
                    "-i",
                    str(mmd_path),
                    "-o",
                    str(png_path),
                    "-b",
                    "transparent",
                    "-w",
                    "1200",
                    "-s",
                    "2",
                ],
                capture_output=True,
                timeout=60,
            )

            if result.returncode == 0 and png_path.exists():
                return str(png_path)
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass

        return None

    def _markdown_to_html(self, markdown: str) -> str:
        """Convert markdown to Telegram HTML."""
        html = markdown

        for md, (open_tag, close_tag) in self.HTML_TAGS.items():
            escaped = re.escape(md)
            if md in ["**", "*", "`", "~~"]:
                html = re.sub(rf"{escaped}(.+?){escaped}", rf"{open_tag}\1{close_tag}", html)

        code_block_pattern = r"```(\w*)\n?(.*?)```"
        html = re.sub(code_block_pattern, r"<pre>\2</pre>", html, flags=re.DOTALL)

        html = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', html)

        html = self._fix_headers(html)

        return html

    def _fix_headers(self, html: str) -> str:
        """Convert markdown headers to bold with emoji prefix."""
        for level in [6, 5, 4, 3, 2, 1]:
            prefix = "🔹 " * level
            html = re.sub(
                rf"^({'prefix}#' * level})\s+(.+)$", rf"<b>{prefix}\2</b>", html, flags=re.MULTILINE
            )
        return html


def split_for_telegram(content: str, max_length: int = MAX_MSG_LENGTH) -> list[str]:
    """Split content into Telegram-safe messages."""
    messages = []
    current = ""

    for paragraph in content.split("\n\n"):
        test = current + ("\n\n" + paragraph if current else paragraph)

        if len(test) > max_length:
            if current:
                messages.append(current)

            if len(paragraph) > max_length:
                current = _split_long_paragraph(paragraph, max_length)
            else:
                current = paragraph
        else:
            current = test

    if current:
        messages.append(current)

    return [f"({i + 1}/{len(messages)})\n\n{msg}" for i, msg in enumerate(messages)]


def _split_long_paragraph(text: str, max_length: int) -> str:
    """Split long paragraph at sentence boundaries."""
    sentences = re.split(r"(?<=[.!?])\s+", text)
    result = ""

    for sent in sentences:
        if len(result) + len(sent) + 1 > max_length:
            break
        result += " " + sent if result else sent

    return result or text[:max_length]


def format_for_telegram(markdown: str, output_dir: Optional[Path] = None) -> dict:
    """
    Main entry point: convert markdown to Telegram format.

    Returns:
        {
            'html': str,              # Telegram HTML content
            'images': list[str],      # Paths to rendered diagram PNGs
            'messages': list[str]     # Pre-split messages (if > 4096 chars)
        }
    """
    converter = TelegramConverter(output_dir)
    html, images = converter.convert(markdown)

    messages = split_for_telegram(html)

    return {"html": html, "images": images, "messages": messages}


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: telegram_converter.py <markdown_file>")
        sys.exit(1)

    md_path = Path(sys.argv[1])
    markdown = md_path.read_text()

    result = format_for_telegram(markdown)

    print("=== HTML Output ===")
    print(result["html"])

    if result["images"]:
        print(f"\n=== Rendered {len(result['images'])} diagrams ===")
        for img in result["images"]:
            print(f"  - {img}")

    if len(result["messages"]) > 1:
        print(f"\n=== Split into {len(result['messages'])} messages ===")
        for i, msg in enumerate(result["messages"]):
            print(f"\n--- Message {i + 1} ({len(msg)} chars) ---")
            print(msg[:200] + "..." if len(msg) > 200 else msg)
