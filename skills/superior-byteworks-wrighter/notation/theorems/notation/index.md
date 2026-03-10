# Mathematical Notation Reference

> **Who this is for**: Anyone who encounters math symbols and wants to understand what they mean — no prior math knowledge required.

Mathematics uses a compact symbolic language. Once you learn to read it, dense equations become clear sentences. This reference breaks that language down symbol by symbol.

---

## Why Symbols Exist

Mathematical symbols are shorthand. Instead of writing "the sum of all values of x squared, where x ranges from 1 to 10," mathematicians write:

$$\sum_{x=1}^{10} x^2$$

Symbols save space, reduce ambiguity, and let ideas travel across language barriers. A Chinese mathematician and a Brazilian mathematician can both read the same equation without translation.

---

## How to Read This Reference

Each section covers a category of symbols. Every entry follows this format:

| Field | What it tells you |
|-------|-------------------|
| **Symbol** | The actual character |
| **Name** | What to call it out loud |
| **LaTeX** | How to type it in documents |
| **Meaning** | Plain-English explanation |
| **Example** | A concrete use |
| **When to use** | Context and domain |

---

## Sections in This Reference

| File | Topic | Symbols covered |
|------|-------|-----------------|
| [greek-letters.md](greek-letters.md) | Greek alphabet | α β γ δ ε ζ η θ ι κ λ μ ν ξ π ρ σ τ υ φ χ ψ ω |
| [operators.md](operators.md) | Operations | + − × ÷ · ∑ ∏ ∫ ∂ ∇ √ |
| [relations.md](relations.md) | Comparisons | = ≠ < > ≤ ≥ ≈ ∝ ≡ |
| [sets.md](sets.md) | Collections | ∈ ∉ ⊂ ⊆ ∪ ∩ ∅ ℕ ℤ ℚ ℝ ℂ |
| [logic.md](logic.md) | Reasoning | ∀ ∃ ¬ ∧ ∨ ⇒ ⇔ ⊤ ⊥ |
| [calculus.md](calculus.md) | Change & accumulation | ∂ ∇ ∫ ∬ lim d/dx |

---

## Reading Equations Out Loud

When you encounter an equation, read it left to right like a sentence:

| Written | Read as |
|---------|---------|
| $a + b = c$ | "a plus b equals c" |
| $x^2$ | "x squared" or "x to the power of 2" |
| $\sqrt{x}$ | "the square root of x" |
| $\frac{a}{b}$ | "a over b" or "a divided by b" |
| $\sum_{i=1}^{n} x_i$ | "the sum of x-sub-i, from i equals 1 to n" |
| $\int_a^b f(x)\,dx$ | "the integral of f of x, from a to b" |

---

## LaTeX Basics

LaTeX is the standard system for writing math in documents. Symbols are typed as commands starting with `\`.

**Inline math** — wraps in single dollar signs: `$x^2 + y^2 = r^2$` → $x^2 + y^2 = r^2$

**Display math** — wraps in double dollar signs, centered on its own line:
```
$$x^2 + y^2 = r^2$$
```
$$x^2 + y^2 = r^2$$

**Subscripts** use `_`: `x_i` → $x_i$ (read: "x sub i")

**Superscripts** use `^`: `x^2` → $x^2$ (read: "x squared")

**Fractions**: `\frac{numerator}{denominator}` → $\frac{a}{b}$

---

## Common Conventions

Mathematicians follow informal conventions that help readers orient quickly:

| Convention | Meaning |
|-----------|---------|
| $a, b, c$ | Constants (known, fixed values) |
| $x, y, z$ | Variables (unknown or changing values) |
| $f, g, h$ | Functions |
| $i, j, k, n, m$ | Integer indices (counting numbers) |
| $\epsilon, \delta$ | Small positive quantities |
| $\lambda, \mu$ | Parameters or eigenvalues |
| $\alpha, \beta$ | Angles or coefficients |

These are conventions, not rules — context always determines meaning.

---

## Symbols That Look Similar

Watch out for these easy-to-confuse pairs:

| Symbol | Name | Meaning | Symbol | Name | Meaning |
|--------|------|---------|--------|------|---------|
| × | Times | Multiplication | x | Letter x | Variable |
| − | Minus | Subtraction | - | Hyphen | Punctuation |
| · | Dot | Multiplication | . | Period | Punctuation |
| θ | Theta (lowercase) | Angle | Θ | Theta (uppercase) | Different use |

---

## A Note on Precision

Mathematical symbols are exact. Unlike natural language, where "approximately" is vague, math has symbols for every shade of meaning:

- $=$ means **exactly equal**
- $\approx$ means **approximately equal**
- $\equiv$ means **defined to be equal** or **identical**
- $\propto$ means **proportional to** (equal up to a constant factor)

When reading math, pay attention to which symbol is used — the difference matters.

---

## Suggested Reading Order

If you're new to mathematical notation, start here:

1. **[Operators](operators.md)** — The actions of math (add, subtract, multiply...)
2. **[Relations](relations.md)** — How things compare (equal, greater than...)
3. **[Greek Letters](greek-letters.md)** — The alphabet of advanced math
4. **[Sets](sets.md)** — How mathematicians group things
5. **[Logic](logic.md)** — The rules of mathematical reasoning
6. **[Calculus](calculus.md)** — The mathematics of change

---

*Each section is self-contained. Jump to whichever topic you need.*
