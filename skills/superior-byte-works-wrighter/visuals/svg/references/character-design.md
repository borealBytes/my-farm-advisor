# Character Design in SVG

Lessons from building complex illustrations with reusable components.

---

## Reference Gathering

Before drawing, collect reference material:

1. **Find reference images** - Official art, screenshots, style guides
2. **Identify key proportions** - Head-to-body ratio, eye placement, limb lengths
3. **Extract color palette** - Use color picker tools for accuracy
4. **Note distinctive features** - What makes this character recognizable?

**Example - Simpsons proportions:**

- Head: 1.5x height-to-width ratio (cylindrical)
- Eyes: Large, half the face width each
- Hair: 9 distinct spikes for Bart, 2 hairs for Homer
- Skin: #FDD015 (universal yellow)

---

## Proportion Guidelines

### Head Construction

```svg
<!-- Cylindrical head base -->
<path d="M 35 60
         L 35 160
         Q 35 185, 70 185
         Q 105 185, 105 160
         L 105 60
         Q 105 35, 70 35
         Q 35 35, 35 60 Z"
      fill="#FDD015"/>
```

**Key measurements:**

- Width: 70 units
- Height: 150 units (cylindrical, not spherical)
- Eyes centered at 40% from top
- Mouth at 75% from top

### Body Proportions

| Character     | Head:Body | Shoulder Width | Style              |
| ------------- | --------- | -------------- | ------------------ |
| Child (Bart)  | 1:1.2     | Same as head   | Compact, energetic |
| Adult (Homer) | 1:2       | 1.5x head      | Round, soft shapes |

---

## Component Architecture

### Build Individual Components

```
character/
├── head.svg          # Reusable across poses
├── body.svg          # Torso, clothing
├── left_arm.svg      # Limbs separate for animation
├── right_arm.svg
├── left_leg.svg
└── right_leg.svg
```

**Principle:** Each component should be:

- Centered at origin (0,0)
- Self-contained with its own styling
- Scalable independently
- Positionable via `transform`

### Component Template

```svg
<!-- bart_head.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="220" viewBox="0 0 140 220">
  <!-- Head centered at origin -->
  <g transform="translate(70, 110)">
    <!-- Face shape -->
    <path d="M -35 -50 ..." fill="#FDD015"/>
    <!-- Eyes -->
    <circle cx="-18" cy="-15" r="20" fill="#FFF"/>
    <circle cx="18" cy="-15" r="20" fill="#FFF"/>
    <!-- Hair -->
    <path d="M -35 -50 ..." fill="#FDD015"/>
  </g>
</svg>
```

---

## Color Palettes

### Define Colors as Constants

```svg
<defs>
  <style>
    :root {
      --skin: #FDD015;
      --bart-shirt: #E84A24;
      --bart-shorts: #5C94FC;
      --homer-shirt: #FFFFFF;
      --homer-pants: #5C94FC;
      --outline: #000000;
    }
  </style>
</defs>
```

### Character Color Reference

| Element     | Hex     | RGB           | Usage          |
| ----------- | ------- | ------------- | -------------- |
| Skin        | #FDD015 | 253, 208, 21  | All characters |
| Bart Shirt  | #E84A24 | 232, 74, 36   | Orange-red     |
| Bart Shorts | #5C94FC | 92, 148, 252  | Blue           |
| Homer Shirt | #FFFFFF | 255, 255, 255 | White          |
| Homer Pants | #5C94FC | 92, 148, 252  | Blue           |
| Homer Beard | #D1B271 | 209, 178, 113 | Stubble        |
| Skateboard  | #8B4513 | 139, 69, 19   | Brown          |
| Wheels      | #FF0000 | 255, 0, 0     | Red            |

---

## Assembly Patterns

### Scene Composition

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <!-- Background -->
  <rect width="800" height="600" fill="url(#sky)"/>

  <!-- Character 1: Homer (left, watching) -->
  <g transform="translate(150, 320)">
    <use href="homer_body.svg"/>
    <use href="homer_head.svg" transform="translate(0, -80)"/>
  </g>

  <!-- Character 2: Bart (center, jumping) -->
  <g transform="translate(450, 200) rotate(-15)">
    <use href="bart_body.svg"/>
    <use href="bart_head.svg" transform="translate(0, -90)"/>
  </g>

  <!-- Prop: Skateboard -->
  <g transform="translate(450, 380) rotate(145)">
    <use href="skateboard.svg"/>
  </g>
</svg>
```

### Transform Order

**Correct order for positioning:**

```svg
<!-- 1. Translate to position -->
<!-- 2. Rotate around that point -->
<!-- 3. Scale if needed -->
<g transform="translate(x, y) rotate(angle) scale(factor)">
```

**Example - Bart mid-air:**

```svg
<g transform="translate(450, 200) rotate(-15)">
  <!-- Body parts here -->
</g>
```

- `translate(450, 200)` - Position in air
- `rotate(-15)` - Tilt backward for dynamic pose

---

## Building Complex Scenes

### Step-by-Step Assembly

1. **Background** - Sky, ground, environment
2. **Static elements** - Buildings, trees, props
3. **Background characters** - Smaller, less detail
4. **Foreground characters** - Main focus, full detail
5. **Effects** - Shadows, motion lines, speech bubbles

### Layering with Groups

```svg
<!-- Layer order = paint order (back to front) -->
<g id="layer-background">
  <!-- Sky, clouds -->
</g>

<g id="layer-midground">
  <!-- Homer (behind Bart) -->
</g>

<g id="layer-foreground">
  <!-- Bart (main focus) -->
  <!-- Skateboard -->
</g>

<g id="layer-effects">
  <!-- Speech bubbles -->
  <!-- Motion lines -->
</g>
```

---

## Speech Bubbles

### Basic Bubble

```svg
<g transform="translate(100, 100)">
  <!-- Bubble shape -->
  <ellipse cx="0" cy="0" rx="90" ry="30"
           fill="#FFFFFF"
           stroke="#000000"
           stroke-width="2"/>
  <!-- Tail -->
  <path d="M 30 25 L 50 50 L 45 28"
        fill="#FFFFFF"
        stroke="#000000"
        stroke-width="2"/>
  <!-- Text -->
  <text x="0" y="5"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="14">Don't have a cow, man!</text>
</g>
```

### Positioning Tips

- Place tail pointing toward speaker's mouth
- Keep text centered with `text-anchor="middle"`
- Adjust bubble size to fit text
- Use `transform="translate(x,y)"` for positioning

---

## Animation Considerations

### Component Separation

Separate parts that will move:

```svg
<!-- Static body -->
<g id="body">
  <use href="torso.svg"/>
</g>

<!-- Moving arm -->
<g id="arm" transform="translate(100, 100)">
  <animateTransform
    attributeName="transform"
    type="rotate"
    from="0" to="45"
    dur="1s"
    repeatCount="indefinite"/>
  <use href="arm.svg"/>
</g>
```

### Pivot Points

Center rotation around joints:

```svg
<!-- Rotate around shoulder (50, 80) -->
<g transform="translate(50, 80)">
  <animateTransform
    attributeName="transform"
    type="rotate"
    values="0 50 80; 45 50 80; 0 50 80"
    dur="2s"
    repeatCount="indefinite"/>
  <use href="arm.svg" transform="translate(-50, -80)"/>
</g>
```

---

## Best Practices

### DO

- ✅ Build components at origin, position with transforms
- ✅ Use consistent stroke widths (2px for outlines)
- ✅ Group related elements
- ✅ Define colors in one place
- ✅ Test components individually before assembly
- ✅ Use `use` with `href` for repeated elements

### DON'T

- ❌ Hardcode absolute positions in components
- ❌ Mix different stroke widths without purpose
- ❌ Forget to close paths with `Z`
- ❌ Make components too complex (split if needed)
- ❌ Use inline styles on every element

---

## Quick Checklist

Before finalizing a character:

- [ ] Proportions match reference
- [ ] Colors are consistent
- [ ] Components centered at origin
- [ ] Outlines use consistent width
- [ ] All paths closed properly
- [ ] Groups have meaningful IDs
- [ ] Scene layers in correct order
- [ ] Speech bubbles point correctly
