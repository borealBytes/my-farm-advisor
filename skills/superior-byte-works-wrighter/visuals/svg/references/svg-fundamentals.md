# SVG Fundamentals

Core concepts for creating scalable vector graphics.

---

## ViewBox and Coordinate Systems

The `viewBox` defines the coordinate system and aspect ratio.

```
viewBox="x y width height"
```

| Example                       | Result                          |
| ----------------------------- | ------------------------------- |
| `viewBox="0 0 800 600"`       | Standard 4:3 canvas             |
| `viewBox="-100 -100 200 200"` | Centered at origin              |
| `viewBox="0 0 100 100"`       | Unit square, scales to any size |

**Key principle:** Draw at any size, display at any size. The `viewBox` is the source of truth.

---

## Path Commands

Paths are the most powerful SVG element. Master these commands:

| Command               | Meaning            | Example                  |
| --------------------- | ------------------ | ------------------------ |
| `M x y`               | Move to (absolute) | `M 50 100`               |
| `m x y`               | Move to (relative) | `m 10 10`                |
| `L x y`               | Line to (absolute) | `L 150 100`              |
| `l x y`               | Line to (relative) | `l 0 50`                 |
| `H x`                 | Horizontal line    | `H 200`                  |
| `V y`                 | Vertical line      | `V 150`                  |
| `Q x1 y1, x y`        | Quadratic Bézier   | `Q 100 50, 150 100`      |
| `C x1 y1, x2 y2, x y` | Cubic Bézier       | `C 50 0, 150 0, 200 100` |
| `Z`                   | Close path         | `Z`                      |

**Example - Rounded Rectangle:**

```svg
<path d="M 50 50
         L 250 50
         Q 270 50, 270 70
         L 270 130
         Q 270 150, 250 150
         L 50 150
         Q 30 150, 30 130
         L 30 70
         Q 30 50, 50 50 Z"
      fill="#2196F3"/>
```

---

## Basic Shapes

### Rectangle

```svg
<rect x="50" y="50" width="200" height="100"
      rx="8" ry="8"
      fill="#4CAF50"
      stroke="#2E7D32"
      stroke-width="2"/>
```

### Circle

```svg
<circle cx="150" cy="150" r="50"
        fill="#FF5722"
        opacity="0.8"/>
```

### Ellipse

```svg
<ellipse cx="150" cy="100" rx="80" ry="40"
         fill="#9C27B0"/>
```

### Line

```svg
<line x1="50" y1="50" x2="250" y2="150"
      stroke="#333"
      stroke-width="2"
      stroke-linecap="round"/>
```

---

## Fill, Stroke, and Styling

### Presentation Attributes

| Attribute         | Purpose              | Example                   |
| ----------------- | -------------------- | ------------------------- |
| `fill`            | Interior color       | `fill="#2196F3"`          |
| `fill-opacity`    | Fill transparency    | `fill-opacity="0.5"`      |
| `stroke`          | Border color         | `stroke="#333"`           |
| `stroke-width`    | Border thickness     | `stroke-width="2"`        |
| `stroke-linecap`  | Line endings         | `butt`, `round`, `square` |
| `stroke-linejoin` | Corner style         | `miter`, `round`, `bevel` |
| `opacity`         | Overall transparency | `opacity="0.8"`           |

### Gradients

```svg
<defs>
  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style="stop-color:#4CAF50"/>
    <stop offset="100%" style="stop-color:#2E7D32"/>
  </linearGradient>
</defs>

<rect x="50" y="50" width="200" height="100" fill="url(#grad1)"/>
```

---

## Groups and Transforms

### Grouping Elements

```svg
<g id="character" transform="translate(100, 100)">
  <circle cx="0" cy="0" r="40" fill="#FDD015"/>
  <circle cx="-15" cy="-10" r="12" fill="#FFF"/>
  <circle cx="15" cy="-10" r="12" fill="#FFF"/>
</g>
```

### Transformations

| Transform | Syntax                     | Effect              |
| --------- | -------------------------- | ------------------- |
| Translate | `translate(x, y)`          | Move position       |
| Scale     | `scale(factor)`            | Resize uniformly    |
| Rotate    | `rotate(angle, cx, cy)`    | Rotate around point |
| Combined  | `translate(x,y) rotate(a)` | Apply in order      |

**Important:** Transforms apply right-to-left in the attribute.

```svg
<!-- Translate then rotate -->
<g transform="translate(100, 100) rotate(45)">

<!-- Rotate then translate (different result!) -->
<g transform="rotate(45) translate(100, 100)">
```

---

## Best Practices

### DO

- ✅ Use `viewBox` for scalable graphics
- ✅ Center components at origin (0,0), move with `transform`
- ✅ Group related elements with `<g>`
- ✅ Use `defs` for reusable content (gradients, patterns)
- ✅ Add `id` attributes for referencing
- ✅ Keep decimal precision reasonable (1-2 places)

### DON'T

- ❌ Hardcode positions on every element
- ❌ Use overly complex paths when simple shapes work
- ❌ Forget to close paths with `Z`
- ❌ Mix absolute and relative commands unnecessarily

---

## Quick Reference

### Minimal SVG Template

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="400" height="300"
     viewBox="0 0 400 300">
  <defs>
    <!-- Gradients, patterns here -->
  </defs>
  <!-- Content here -->
</svg>
```

### Common Patterns

**Arrow marker:**

```svg
<defs>
  <marker id="arrow" markerWidth="10" markerHeight="10"
          refX="9" refY="3" orient="auto">
    <path d="M0,0 L0,6 L9,3 z" fill="#333"/>
  </marker>
</defs>
```

**Drop shadow:**

```svg
<defs>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
  </filter>
</defs>
```
