# Telegram Delivery Guide

Format content for Telegram using HTML-style markup and inline images.

## Supported Formatting

| Markdown             | Telegram HTML                 | Example           |
| -------------------- | ----------------------------- | ----------------- |
| `**bold**`           | `<b>bold</b>`                 | **bold**          |
| `*italic*`           | `<i>italic</i>`               | _italic_          |
| `` `code` ``         | `<code>code</code>`           | `code`            |
| ` ```code block``` ` | `<pre>code block</pre>`       | code block        |
| `[link text](url)`   | `<a href="url">link text</a>` | link text         |
| `~~strikethrough~~`  | `<s>strikethrough</s>`        | ~~strikethrough~~ |

## Unsupported Formatting

The following will NOT render in Telegram:

- Headers (`#`, `##`, `###`) - use bold instead
- Blockquotes (`>`) - use italic with `>` prefix
- Horizontal rules (`---`) - use `───────`
- Tables - send as plain text with borders
- LaTeX math - render to image first
- Nested bold/italic - Telegram doesn't support

## Mermaid Diagrams

### Rendering Flow

1. Extract mermaid code blocks from markdown
2. Render each to PNG using mermaid-cli
3. Send as inline photos with caption

### Mermaid to PNG

```bash
mmdc -i diagram.mmd -o diagram.png -b transparent -w 1200
```

Options:

- `-b transparent` or `-b white` - background
- `-w 1200` - width in pixels
- `-s 2` - scale factor

### Example Pipeline

```python
import subprocess
import re

def render_mermaid(mermaid_code: str, output_path: str) -> str:
    """Render mermaid diagram to PNG."""
    with open('/tmp/diagram.mmd', 'w') as f:
        f.write(mermaid_code)

    subprocess.run([
        'mmdc', '-i', '/tmp/diagram.mmd',
        '-o', output_path,
        '-b', 'transparent', '-w', '1200'
    ], check=True)

    return output_path
```

## Message Splitting

Telegram message limit: 4096 characters

### Split Strategy

1. Split at double newlines (paragraph breaks)
2. If paragraph > 2000 chars, split at sentences
3. Prepend message number: `(1/3)`, `(2/3)`, etc.

```python
MAX_MSG_LENGTH = 4000

def split_for_telegram(content: str) -> list[str]:
    """Split long content into Telegram-safe messages."""
    messages = []
    current = ""

    for paragraph in content.split('\n\n'):
        if len(current) + len(paragraph) + 2 > MAX_MSG_LENGTH:
            if current:
                messages.append(current)
            current = paragraph
        else:
            current += '\n\n' + paragraph if current else paragraph

    if current:
        messages.append(current)

    return [f"({i+1}/{len(messages)})\n\n{msg}"
            for i, msg in enumerate(messages)]
```

## Inline Images

### Sending with Photos

```python
def send_message_with_images(api, chat_id, text, images):
    """Send text with inline images."""
    if images:
        media_group = []
        for i, img_path in enumerate(images):
            with open(img_path, 'rb') as f:
                media_group.append({
                    'type': 'photo',
                    'media': f,
                    'caption': text if i == 0 else None
                })
        api.send_media_group(chat_id=chat_id, media=media_group)
    else:
        api.send_message(chat_id=chat_id, text=text, parse_mode='HTML')
```

### Caption for Diagrams

Add mermaid diagram captions:

```markdown
<b>📊 Field Overview</b>

<i>Figure 1: Farm layout showing 5 fields with NDVI overlay</i>
```

## Complete Example

````python
import re
import subprocess
from pathlib import Path

TELEGRAM_HTML_TAGS = {
    '**': ('<b>', '</b>'),
    '*': ('<i>', '</i>'),
    '`': ('<code>', '</code>'),
    '```': ('<pre>', '</pre>'),
    '~~': ('<s>', '</s>'),
}

def convert_to_telegram_html(markdown: str) -> str:
    """Convert markdown to Telegram HTML format."""
    html = markdown

    for md, (open_tag, close_tag) in TELEGRAM_HTML_TAGS.items():
        escaped_md = md.replace('(', '\\(').replace(')', '\\)')
        if md in ['**', '*', '`', '~~']:
            pattern = rf'{escaped_md}(.+?){escaped_md}'
            html = re.sub(pattern, f'{open_tag}\1{close_tag}', html)
        elif md == '```':
            html = re.sub(r'```(\w*)\n?(.*?)```',
                         f'{open_tag}\2{close_tag}', html, flags=re.DOTALL)

    html = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                  r'<a href="\2">\1</a>', html)

    return html

def extract_and_render_mermaid(markdown: str, output_dir: Path) -> tuple:
    """Extract mermaid blocks, render to PNGs, return modified markdown + image paths."""
    mermaid_blocks = re.findall(r'```mermaid\n(.*?)```', markdown, re.DOTALL)
    images = []

    for i, code in enumerate(mermaid_blocks):
        mmd_path = output_dir / f'diagram_{i}.mmd'
        png_path = output_dir / f'diagram_{i}.png'

        mmd_path.write_text(code)

        subprocess.run([
            'mmdc', '-i', str(mmd_path), '-o', str(png_path),
            '-b', 'transparent', '-w', '1200'
        ], check=True)

        images.append(str(png_path))
        markdown = markdown.replace(f'```mermaid\n{code}```',
                                    f'<i>📊 Diagram {i+1}</i>')

    return markdown, images
````

## Best Practices

1. **Keep paragraphs short** - Under 500 chars when possible
2. **Use bullet lists** - Render well in Telegram
3. **Bold key info** - Use for headings and important numbers
4. **Send diagrams separately** - Don't batch more than 10 images
5. **Add emoji prefixes** - Help with quick scanning:
   - 📊 Tables/diagrams
   - 📋 Lists
   - 🔢 Numbers/stats
   - ⚠️ Warnings
   - ✅ Action items
