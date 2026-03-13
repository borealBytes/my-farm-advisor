---
name: AI Visuals Index
description: Guide for generating AI-powered scientific schematics and publication figures (Phase 3)
version: 1.0.0
author: Omni Unified Writing
---

# AI Visuals (Phase 3)

AI-generated visuals are **Phase 3** of the unified-writing workflow — used only when Mermaid diagrams (Phase 1) and code-generated charts (Phase 2) cannot convey the required information.

See [../core/workflow.md](../core/workflow.md) for the full three-phase workflow.

---

## ## When to Use AI Visuals

| Use AI visuals for                     | Use Mermaid instead for         |
| -------------------------------------- | ------------------------------- |
| Neural network architecture diagrams   | Flowcharts and process diagrams |
| Biological pathway illustrations       | Sequence diagrams               |
| Molecular structure visualizations     | State machines                  |
| Publication-quality conceptual figures | Entity-relationship diagrams    |
| Complex 3D system diagrams             | Simple component diagrams       |

**Rule:** If Mermaid can express it, use Mermaid. AI visuals are for content that requires spatial, biological, or artistic representation.

---

## ## Available Tools

### scientific-schematics skill

The `scientific-schematics` skill generates publication-quality scientific diagrams using AI with iterative refinement.

**Best for:**

- Neural network architectures
- System architecture diagrams (complex)
- Biological pathways
- Scientific process illustrations

**Usage:**

```
Use the scientific-schematics skill to generate a diagram of
a transformer architecture showing multi-head attention,
feed-forward layers, and positional encoding.
```

### generate-image skill

The `generate-image` skill generates general-purpose images using FLUX or Gemini.

**Best for:**

- Conceptual illustrations
- Abstract visual metaphors
- Non-technical imagery

**Usage:**

```
Use the generate-image skill to create a conceptual illustration
of distributed computing — multiple nodes connected in a network,
passing messages.
```

---

## ## Prompt Engineering for Scientific Figures

### Effective prompt structure

```
[Figure type]: [Specific description]
[Style]: [Publication-quality / schematic / illustration]
[Elements]: [List key components to include]
[Layout]: [Horizontal / vertical / circular]
[Color]: [Colorblind-safe / monochrome / specific palette]
[Labels]: [Include text labels / no labels]
```

**Example prompt:**

```
Neural network architecture diagram showing:
- Input layer (blue, 784 nodes represented as a column)
- Two hidden layers (green, 256 and 128 nodes)
- Output layer (orange, 10 nodes)
- Forward pass arrows between layers
- Activation function labels (ReLU, Softmax)
Style: clean schematic, white background, publication-quality
Layout: horizontal left-to-right
Labels: include layer names and node counts
```

---

## ## Quality Checklist for AI Visuals

Before including an AI-generated visual in a document:

- [ ] Figure accurately represents the described system/concept
- [ ] All labeled elements are correct
- [ ] Color scheme is colorblind-safe (or monochrome)
- [ ] Resolution is sufficient for intended output (≥ 300 DPI for print)
- [ ] Figure has a caption that states the conclusion
- [ ] Markdown description of the figure is committed alongside the image
- [ ] Image stored in `assets/` directory relative to the document

---

## ## File Organization

```
document/
├── document.md          # Phase 1 source (always committed)
├── assets/
│   ├── figure1.png      # AI-generated figure
│   ├── figure2.svg      # Code-generated chart
│   └── figure1-prompt.md  # Prompt used to generate figure1
```

**Always commit the prompt** alongside the generated image. This enables regeneration if the image needs updating.

---

## ## Caption Writing

Every figure needs a caption that states the conclusion:

| Anti-pattern                          | Correct                                                                                                                                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Figure 1: Transformer architecture." | "Figure 1: The transformer encoder-decoder architecture. Self-attention in the encoder allows each token to attend to all other tokens, enabling long-range dependency modeling without recurrence." |
| "Figure 2: Biological pathway."       | "Figure 2: The mTOR signaling pathway. Activation of mTORC1 by growth factors promotes protein synthesis and cell growth; rapamycin inhibits this pathway at the mTORC1 node."                       |

---

## ## See Also

- [../core/workflow.md](../core/workflow.md) — Three-phase workflow (when to use Phase 3)
- [../diagrams/mermaid/](../diagrams/mermaid/) — Phase 1 diagram types (use first)
- [../core/principles.md](../core/principles.md) — Principle 9: Diagrams earn their place
