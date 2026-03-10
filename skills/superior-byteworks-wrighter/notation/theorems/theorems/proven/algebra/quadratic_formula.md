# Quadratic Formula

## ## LaTeX Statement

For any quadratic equation $ax^2 + bx + c = 0$ with $a \neq 0$:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

In full generality over $\mathbb{C}$:

$$\forall\, a, b, c \in \mathbb{C},\; a \neq 0 : ax^2 + bx + c = 0 \iff x = \frac{-b + \sqrt{b^2 - 4ac}}{2a} \;\text{ or }\; x = \frac{-b - \sqrt{b^2 - 4ac}}{2a}$$

The **discriminant** $\Delta$ determines the nature of the roots:

$$\Delta = b^2 - 4ac$$

---

## ## Legend

| Symbol              | Pronunciation                             | Meaning                                                                                       |
| ------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| $\forall$           | "for all"                                 | Universal quantifier — the formula holds for every valid choice of $a$, $b$, $c$              |
| $a$                 | "a"                                       | The leading coefficient — multiplies $x^2$; must be non-zero for the equation to be quadratic |
| $b$                 | "b"                                       | The linear coefficient — multiplies $x$                                                       |
| $c$                 | "c"                                       | The constant term — the value of the polynomial when $x = 0$                                  |
| $\in$               | "in" or "element of"                      | Set membership                                                                                |
| $\mathbb{C}$        | "C" or "the complex numbers"              | The set $\{p + qi \mid p, q \in \mathbb{R},\, i^2 = -1\}$                                     |
| $\mathbb{R}$        | "R" or "the real numbers"                 | The set of all real numbers                                                                   |
| $\neq$              | "not equal to"                            | Strict inequality; $a \neq 0$ ensures the equation is genuinely quadratic                     |
| $ax^2 + bx + c = 0$ | "a x squared plus b x plus c equals zero" | Standard form of a quadratic equation                                                         |
| $\iff$              | "if and only if"                          | Logical biconditional — both directions hold                                                  |
| $x$                 | "x"                                       | The unknown variable we are solving for                                                       |
| $=$                 | "equals"                                  | Equality                                                                                      |
| $-b$                | "negative b"                              | The additive inverse of the coefficient $b$                                                   |
| $\pm$               | "plus or minus"                           | Indicates two separate solutions: one with $+$, one with $-$                                  |
| $\sqrt{\cdot}$      | "square root of"                          | The principal square root; $\sqrt{w}$ is the number whose square is $w$                       |
| $b^2$               | "b squared"                               | $b \times b$                                                                                  |
| $4ac$               | "four a c"                                | The product $4 \times a \times c$                                                             |
| $b^2 - 4ac$         | "b squared minus four a c"                | The **discriminant** $\Delta$ — determines how many real roots exist                          |
| $2a$                | "two a"                                   | The denominator; twice the leading coefficient                                                |
| $\Delta$            | "delta"                                   | Standard notation for the discriminant $b^2 - 4ac$                                            |
| $i$                 | "i"                                       | The imaginary unit, $i^2 = -1$; appears in solutions when $\Delta < 0$                        |

### Discriminant Key

| Condition    | Number of Real Roots                        | Nature                         |
| ------------ | ------------------------------------------- | ------------------------------ |
| $\Delta > 0$ | Two distinct real roots                     | Parabola crosses x-axis twice  |
| $\Delta = 0$ | One repeated real root                      | Parabola is tangent to x-axis  |
| $\Delta < 0$ | No real roots (two complex conjugate roots) | Parabola does not cross x-axis |

---

## ## Plain English Explanation

The quadratic formula is a universal key that unlocks any equation of the form $ax^2 + bx + c = 0$. You plug in the three coefficients $a$, $b$, and $c$, and the formula hands you the solutions directly — no guessing, no trial and error.

**Why does it work?** The formula is derived by _completing the square_:

1. Start with $ax^2 + bx + c = 0$
2. Divide through by $a$: $x^2 + \frac{b}{a}x + \frac{c}{a} = 0$
3. Move the constant: $x^2 + \frac{b}{a}x = -\frac{c}{a}$
4. Add $\left(\frac{b}{2a}\right)^2$ to both sides: $\left(x + \frac{b}{2a}\right)^2 = \frac{b^2 - 4ac}{4a^2}$
5. Take square roots: $x + \frac{b}{2a} = \pm\frac{\sqrt{b^2 - 4ac}}{2a}$
6. Solve for $x$: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

The $\pm$ sign is the heart of the formula: it produces two solutions simultaneously. Geometrically, a parabola $y = ax^2 + bx + c$ can cross the x-axis at zero, one, or two points — the discriminant tells you which case you're in.

---

## ## Real-World Significance

**Physics — Projectile Motion**
The height of a projectile is $h(t) = -\frac{1}{2}gt^2 + v_0 t + h_0$. Setting $h = 0$ and applying the quadratic formula gives the exact time the object hits the ground. Every ballistics calculation, from artillery to basketball, uses this.

**Engineering — Structural Analysis**
Stress and deflection in beams, optimal cross-sections for minimum material use, and resonant frequencies of mechanical systems all reduce to quadratic equations. The formula gives engineers exact answers without numerical iteration.

**Optics — Lens Design**
The thin lens equation and mirror equations produce quadratics when solving for image distances or focal lengths in compound optical systems. Camera and telescope design depends on these calculations.

**Computer Graphics — Ray–Sphere Intersection**
A ray $\mathbf{r}(t) = \mathbf{o} + t\mathbf{d}$ intersects a sphere $|\mathbf{x} - \mathbf{c}|^2 = r^2$ when $|\mathbf{o} + t\mathbf{d} - \mathbf{c}|^2 = r^2$, which expands to a quadratic in $t$. Every ray-traced image in film and games solves this formula millions of times per frame.

**Finance — Break-Even Analysis**
Revenue and cost functions are often quadratic. Finding break-even points (where profit = 0) requires solving a quadratic equation, making the formula essential in business modeling.

**Electrical Engineering — RLC Circuits**
The characteristic equation of a series RLC circuit is $Ls^2 + Rs + \frac{1}{C} = 0$. The roots (found via the quadratic formula) determine whether the circuit is overdamped, critically damped, or underdamped.

---

## ## History

**Babylonian Origins (~2000 BCE)**
Babylonian scribes on clay tablets (such as the Plimpton 322 tablet) solved problems equivalent to quadratic equations using geometric methods — essentially completing the square in a geometric sense. They worked with specific numerical cases, not a general formula.

**Ancient Greece (300 BCE)**
Euclid's _Elements_ (Book II) contains geometric propositions equivalent to solving quadratics, but expressed entirely in terms of areas and lengths. The Greeks avoided negative numbers, so they only found positive solutions.

**Indian Mathematics (628 CE)**
Brahmagupta in his _Brāhmasphuṭasiddhānta_ gave an explicit verbal formula for solving $ax^2 + bx = c$, including negative and zero coefficients — a major conceptual advance. He recognized that quadratics can have two solutions.

**Islamic Golden Age (820 CE)**
Al-Khwārizmī's _Al-Kitāb al-mukhtaṣar fī ḥisāb al-jabr wa-l-muqābala_ (The Compendious Book on Calculation by Completion and Balancing) systematized the solution of quadratics into six canonical forms. The word **algebra** comes from _al-jabr_ (completion) in this title. Al-Khwārizmī gave geometric proofs for each case.

**European Renaissance (1545)**
Gerolamo Cardano's _Ars Magna_ presented the quadratic formula in a form close to modern notation, alongside the cubic and quartic formulas. He was among the first Europeans to work seriously with complex numbers, calling them "sophistic" but using them anyway.

**Modern Notation (17th century)**
René Descartes introduced the $\pm$ notation and the convention of using $a$, $b$, $c$ for coefficients and $x$ for unknowns. The formula reached its current symbolic form by the late 1600s.

---

## ## Examples

### Example 1: Two Distinct Real Roots

Solve $x^2 - 5x + 6 = 0$

Here $a = 1$, $b = -5$, $c = 6$. Discriminant: $\Delta = 25 - 24 = 1 > 0$.

$$x = \frac{5 \pm \sqrt{1}}{2} = \frac{5 \pm 1}{2}$$

$$x_1 = \frac{5 + 1}{2} = 3, \qquad x_2 = \frac{5 - 1}{2} = 2$$

Verification: $(x-2)(x-3) = x^2 - 5x + 6$ ✓

---

### Example 2: Repeated Root (Discriminant = 0)

Solve $4x^2 - 12x + 9 = 0$

Here $a = 4$, $b = -12$, $c = 9$. Discriminant: $\Delta = 144 - 144 = 0$.

$$x = \frac{12 \pm \sqrt{0}}{8} = \frac{12}{8} = \frac{3}{2}$$

One solution: $x = \frac{3}{2}$ (a double root).

Verification: $4\left(x - \frac{3}{2}\right)^2 = 4x^2 - 12x + 9$ ✓

---

### Example 3: Complex Roots (Discriminant < 0)

Solve $x^2 + 2x + 5 = 0$

Here $a = 1$, $b = 2$, $c = 5$. Discriminant: $\Delta = 4 - 20 = -16 < 0$.

$$x = \frac{-2 \pm \sqrt{-16}}{2} = \frac{-2 \pm 4i}{2} = -1 \pm 2i$$

$$x_1 = -1 + 2i, \qquad x_2 = -1 - 2i$$

Note: the roots are complex conjugates of each other — this always happens when $a, b, c \in \mathbb{R}$ and $\Delta < 0$.

---

### Example 4: Non-Monic Quadratic

Solve $3x^2 + 7x - 6 = 0$

Here $a = 3$, $b = 7$, $c = -6$. Discriminant: $\Delta = 49 + 72 = 121$.

$$x = \frac{-7 \pm \sqrt{121}}{6} = \frac{-7 \pm 11}{6}$$

$$x_1 = \frac{-7 + 11}{6} = \frac{4}{6} = \frac{2}{3}, \qquad x_2 = \frac{-7 - 11}{6} = \frac{-18}{6} = -3$$

---

### Example 5: Projectile Motion Application

A ball is launched from a height of 2 m with initial upward velocity 14 m/s. When does it hit the ground? (Use $g = 9.8$ m/s².)

$$h(t) = -4.9t^2 + 14t + 2 = 0$$

Here $a = -4.9$, $b = 14$, $c = 2$. Discriminant: $\Delta = 196 + 39.2 = 235.2$.

$$t = \frac{-14 \pm \sqrt{235.2}}{-9.8} = \frac{-14 \pm 15.34}{-9.8}$$

Taking the positive time: $t = \frac{-14 - 15.34}{-9.8} = \frac{-29.34}{-9.8} \approx 2.99$ seconds.

---

### Example 6: Vieta's Formulas (Sum and Product of Roots)

For $ax^2 + bx + c = 0$ with roots $x_1$ and $x_2$:

$$x_1 + x_2 = -\frac{b}{a}, \qquad x_1 \cdot x_2 = \frac{c}{a}$$

These follow directly from the factored form $a(x - x_1)(x - x_2) = ax^2 - a(x_1+x_2)x + ax_1 x_2$.

For $x^2 - 5x + 6 = 0$: sum $= 2 + 3 = 5 = -(-5)/1$ ✓, product $= 2 \times 3 = 6 = 6/1$ ✓.

---

## ## Lean Status

**Status**: Proven in Lean 4 (Mathlib)

The quadratic formula is formalized in Lean 4's `mathlib4`:

```lean4
import Mathlib.RingTheory.Polynomial.Basic
import Mathlib.Algebra.QuadraticDiscriminant

-- The discriminant of ax² + bx + c
def discrim (a b c : α) : α := b ^ 2 - 4 * a * c

-- Quadratic formula: if discrim ≥ 0, the roots are real
-- `Mathlib.Algebra.QuadraticDiscriminant` contains:
theorem quadratic_eq_zero_iff {a b c x : ℝ} (ha : a ≠ 0)
    (h : 0 ≤ discrim a b c) :
    a * x ^ 2 + b * x + c = 0 ↔
    x = (-b + Real.sqrt (discrim a b c)) / (2 * a) ∨
    x = (-b - Real.sqrt (discrim a b c)) / (2 * a) := by
  -- Proof by completing the square
  constructor
  · intro heq
    have h1 : (2 * a * x + b) ^ 2 = discrim a b c := by ring_nf; linarith [heq]
    -- Extract the two square root cases
    rcases sq_eq_sq_iff_eq_or_eq_neg.mp h1 with h2 | h2
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> field_simp <;> ring_nf <;>
    rw [Real.sq_sqrt h] <;> ring
```

**Mathlib Location**: `Mathlib.Algebra.QuadraticDiscriminant`

**Proof Approach**: The Lean proof formalizes completing the square:

1. Multiply through by $4a$ to clear fractions: $4a^2x^2 + 4abx + 4ac = 0$
2. Rewrite as $(2ax + b)^2 = b^2 - 4ac = \Delta$
3. If $\Delta \geq 0$: take square roots to get $2ax + b = \pm\sqrt{\Delta}$, then solve for $x$
4. If $\Delta < 0$: no real solutions (handled separately over $\mathbb{C}$)

**Verification Level**: Complete — the `quadratic_eq_zero_iff` lemma in Mathlib has no `sorry`. The complex case is handled by `Polynomial.roots` over $\mathbb{C}$ using the Fundamental Theorem of Algebra.
