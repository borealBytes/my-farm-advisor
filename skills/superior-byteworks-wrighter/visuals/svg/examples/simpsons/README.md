# Simpsons SVG Illustration Components

## Overview
Building a complex SVG illustration requires creating individual components
and then assembling them with proper positioning, rotation, and layering.

## Component Architecture

```
Scene
├── Background (sky, ground)
├── Homer Simpson
│   ├── Body
│   ├── Head
│   ├── Arms
│   ├── Legs
│   └── Speech bubble ("D'oh!")
├── Bart Simpson
│   ├── Body (rotated for jump)
│   ├── Head
│   ├── Arms (up for balance)
│   └── Legs (bent)
├── Skateboard
│   ├── Deck
│   ├── Wheels
│   └── Rotation animation
└── Speech bubble ("Don't have a cow, man!")
```

## Build Order

1. **Base components** (heads, simple shapes)
2. **Body parts** (with proper colors)
3. **Skateboard** (separate for rotation)
4. **Assembly** (positioning and transforms)
5. **Speech bubbles** (text + bubbles)
6. **Animation** (if needed)

## Color Palette

- **Bart Skin:** #FDD015 (yellow)
- **Bart Shirt:** #E84A24 (orange-red)
- **Bart Shorts:** #5C94FC (blue)
- **Homer Skin:** #FDD015
- **Homer Shirt:** #FFFFFF
- **Homer Pants:** #5C94FC
- **Skateboard:** #8B4513 (brown)
- **Wheels:** #FF0000

## File Structure

```
simpsons_components/
├── bart_head.svg
├── bart_body.svg
├── homer_head.svg
├── homer_body.svg
├── skateboard.svg
└── scene.svg (final assembly)
```
