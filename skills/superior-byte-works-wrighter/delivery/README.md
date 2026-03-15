# Delivery Formats

This folder contains output format converters for different delivery channels.

## Available Formats

| Format     | Description                          | Module                 |
| ---------- | ------------------------------------ | ---------------------- |
| `telegram` | HTML-style markup with inline images | [telegram/](telegram/) |
| `gdocs`    | Google Docs with full formatting     | Coming soon            |
| `markdown` | Standard markdown (default)          | Native                 |

## Usage

When generating content with WRIGHT, specify `delivery_format`:

```yaml
input:
  domain: stories
  task: Create field report
  delivery_format: telegram
```

## Telegram Format

See [telegram/GUIDE.md](telegram/GUIDE.md) for:

- Supported HTML tags
- Mermaid diagram rendering
- Message splitting
- Inline image handling

## Adding New Formats

1. Create folder: `delivery/<format_name>/`
2. Add `GUIDE.md` with formatting rules
3. Add converter module if needed
4. Update parent SKILL.md schema
