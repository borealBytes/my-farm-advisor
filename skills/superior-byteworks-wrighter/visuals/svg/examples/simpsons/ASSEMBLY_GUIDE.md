# Simpsons SVG Assembly Guide

## The Complete Scene: Bart's Kickflip

**File:** `simpsons_skateboard_scene.svg`

### Scene Breakdown

```
Scene (900x700)
├── Background
│   ├── Sky gradient
│   ├── Clouds (3 groups)
│   └── Ground gradient
├── Skate Ramp (behind Bart)
├── Homer Simpson (left side)
│   ├── Body (white shirt)
│   ├── Head (with hair)
│   ├── Arms (hands on head)
│   ├── Pants
│   └── Speech bubble ("D'oh!")
├── Bart Simpson (center, mid-air)
│   ├── Body (rotated -15°)
│   ├── Head (spiky hair)
│   ├── Arms (up in air)
│   ├── Legs (bent)
│   ├── Shoes
│   └── Speech bubble ("Don't have a cow, man!")
├── Skateboard (flipping)
│   └── Rotated 145°
└── Motion lines (speed effect)
```

## Component System

### How It Works

**1. Individual Components (Building Blocks)**
```
components/
├── bart_head.svg      # Reusable head
├── homer_head.svg     # Reusable head
└── skateboard.svg     # Reusable skateboard
```

**2. Scene Assembly (Composition)**
```
scene.svg
├── <g transform="translate(450, 200) rotate(-15)">
│   └── [Bart's body + head + arms + legs]
├── <g transform="translate(450, 380) rotate(145)">
│   └── [Skateboard]
└── <g transform="translate(150, 320)">
    └── [Homer]
```

### Transformations Explained

**Bart's Position:**
```svg
<g transform="translate(450, 200) rotate(-15)">
```
- `translate(450, 200)` - Move to center, up in air
- `rotate(-15)` - Tilt backward for dynamic pose

**Skateboard Flip:**
```svg
<g transform="translate(450, 380) rotate(145)">
```
- `translate(450, 380)` - Under Bart
- `rotate(145)` - Almost upside down (kickflip rotation)

**Homer's Position:**
```svg
<g transform="translate(150, 320)">
```
- `translate(150, 320)` - Left side, watching

## Modifying the Scene

### Change Bart's Pose

**Current:**
```svg
transform="translate(450, 200) rotate(-15)"
```

**Higher Jump:**
```svg
transform="translate(450, 150) rotate(-20)"
```

**Different Trick (ollie):**
```svg
transform="translate(450, 180) rotate(-5)"
```

### Change Skateboard Rotation

**Current flip:**
```svg
transform="translate(450, 380) rotate(145)"
```

**More rotation:**
```svg
transform="translate(450, 380) rotate(180)"
```

**Less rotation:**
```svg
transform="translate(450, 380) rotate(90)"
```

### Move Homer

**Current:**
```svg
transform="translate(150, 320)"
```

**Further left:**
```svg
transform="translate(100, 320)"
```

**Smaller (further away):**
```svg
transform="translate(150, 320) scale(0.8)"
```

### Change Speech Bubbles

**Bart's Text:**
```svg
<text x="100" y="55">Don't have a cow, man!</text>
```

**Change to:**
```svg
<text x="100" y="55">Ay caramba!</text>
```

**Homer's Text:**
```svg
<text x="50" y="50">D'oh!</text>
```

**Change to:**
```svg
<text x="50" y="50">Woo-hoo!</text>
```

## Building Custom Components

### Step 1: Draw the Shape

```svg
<!-- Bart's head simplified -->
<path d="M -45 0 
         L -45 70 
         Q -45 90, 0 90 
         Q 45 90, 45 70 
         L 45 0 
         Q 45 -30, 0 -30 
         Q -45 -30, -45 0 Z" 
      fill="#FDD015" stroke="#000" stroke-width="2"/>
```

### Step 2: Add Details

```svg
<!-- Eyes -->
<circle cx="-18" cy="25" r="15" fill="#FFF" stroke="#000" stroke-width="2"/>
<circle cx="18" cy="25" r="15" fill="#FFF" stroke="#000" stroke-width="2"/>

<!-- Spiky hair -->
<path d="M -45 0 L -45 -20 L -35 -5 L -30 -25 L -20 -5 L -15 -30 L -5 -5 
         L 0 -35 L 10 -5 L 15 -25 L 25 -5 L 30 -15 L 35 -5 L 40 -10 L 45 0"
      fill="#FDD015" stroke="#000" stroke-width="2"/>
```

### Step 3: Test Position

```svg
<g transform="translate(100, 100)">
  <!-- Component here -->
</g>
```

### Step 4: Animate (Optional)

```svg
<g transform="translate(450, 200)">
  <animateTransform
    attributeName="transform"
    type="translate"
    from="450 400"
    to="450 200"
    dur="0.5s"
    fill="freeze"/>
</g>
```

## Color Reference

| Element | Hex | RGB |
|---------|-----|-----|
| Skin | #FDD015 | 253, 208, 21 |
| Bart's shirt | #E84A24 | 232, 74, 36 |
| Bart's shorts | #5C94FC | 92, 148, 252 |
| Homer's shirt | #FFFFFF | 255, 255, 255 |
| Homer's beard | #D1B271 | 209, 178, 113 |
| Skateboard | #8B4513 | 139, 69, 19 |
| Wheels | #FF0000 | 255, 0, 0 |

## Tips for Customization

**1. Use Groups `<g>`**
```svg
<g id="character">
  <!-- All character parts -->
</g>
```

**2. Transform Order Matters**
```svg
<!-- Translate then rotate -->
<g transform="translate(x,y) rotate(angle)">

<!-- Rotate then translate (different result!) -->
<g transform="rotate(angle) translate(x,y)">
```

**3. Use Relative Coordinates**
```svg
<!-- Good: centered at origin -->
<circle cx="0" cy="0" r="50"/>

<!-- Move with transform -->
<g transform="translate(100, 100)">
  <circle cx="0" cy="0" r="50"/>
</g>
```

**4. Test Gradually**
1. Draw shape
2. Position it
3. Add details
4. Group and transform
5. Add to scene

**5. Use ViewBox**
```svg
<svg viewBox="0 0 200 200">
  <!-- Scales to any size -->
</svg>
```

## Common Issues

**Problem:** Parts look wrong when rotated
**Fix:** Center at origin (0,0) before rotating

**Problem:** Speech bubble covers face
**Fix:** Adjust `transform="translate(x,y)"`

**Problem:** Colors look off
**Fix:** Check fill="#hex" values

**Problem:** Too complex, file huge
**Fix:** Simplify paths, remove unused defs

## Export/Import

**Embed in Markdown:**
```markdown
![Bart's Kickflip](simpsons_skateboard_scene.svg)
```

**Inline SVG:**
```markdown
<svg xmlns="http://www.w3.org/2000/svg" ...>
  <!-- Full SVG code -->
</svg>
```

**Use in HTML:**
```html
<img src="simpsons_skateboard_scene.svg" alt="Bart doing a kickflip">
```

**CSS Background:**
```css
.hero {
  background-image: url('simpsons_skateboard_scene.svg');
}
```

## Animation Ideas

**Bart jumps:**
```svg
<animateTransform
  attributeName="transform"
  type="translate"
  values="450 400; 450 200; 450 400"
  dur="1s"
  repeatCount="indefinite"/>
```

**Skateboard spins:**
```svg
<animateTransform
  attributeName="transform"
  type="rotate"
  from="0" to="360"
  dur="0.5s"
  repeatCount="indefinite"/>
```

**Speech bubble appears:**
```svg
<animate
  attributeName="opacity"
  values="0;1"
  dur="0.3s"
  fill="freeze"/>
```

---

**Remember:** Build components, test individually, then assemble!
