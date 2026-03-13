# Fundamental Theorem of Algebra

## ## LaTeX Statement

$$\forall\, p(x) \in \mathbb{C}[x],\quad \deg(p) = n \geq 1 \implies \exists\, z_1, z_2, \ldots, z_n \in \mathbb{C} \text{ (with multiplicity) such that } p(x) = a_n \prod_{k=1}^{n}(x - z_k)$$

Equivalently, every non-constant polynomial with complex coefficients has at least one complex root:

$$\forall\, p \in \mathbb{C}[x],\quad \deg(p) \geq 1 \implies \exists\, z \in \mathbb{C} : p(z) = 0$$

---

## ## Legend

| Symbol                  | Pronunciation                  | Meaning                                                                                                   |
| ----------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| $\forall$               | "for all"                      | Universal quantifier — the statement holds for every element in the specified set                         |
| $p(x)$                  | "p of x"                       | A polynomial function in the variable $x$; a finite sum $a_n x^n + a_{n-1}x^{n-1} + \cdots + a_1 x + a_0$ |
| $\in$                   | "in" or "element of"           | Set membership — $p(x) \in \mathbb{C}[x]$ means $p(x)$ belongs to the ring of complex polynomials         |
| $\mathbb{C}[x]$         | "C bracket x"                  | The ring of all polynomials whose coefficients are complex numbers                                        |
| $\mathbb{C}$            | "C" or "the complex numbers"   | The set $\{a + bi \mid a, b \in \mathbb{R},\, i^2 = -1\}$ — all complex numbers                           |
| $\mathbb{R}$            | "R" or "the real numbers"      | The set of all real numbers (the number line)                                                             |
| $\deg(p)$               | "degree of p"                  | The highest power of $x$ with a non-zero coefficient in $p(x)$                                            |
| $n$                     | "n"                            | A positive integer representing the degree of the polynomial                                              |
| $\geq$                  | "greater than or equal to"     | Weak inequality                                                                                           |
| $\implies$              | "implies"                      | Logical implication: if the left side is true, the right side must be true                                |
| $\exists$               | "there exists"                 | Existential quantifier — at least one such element exists                                                 |
| $z_1, z_2, \ldots, z_n$ | "z-one, z-two, ..., z-n"       | Complex numbers that are the roots (zeros) of $p(x)$, counted with multiplicity                           |
| $:$                     | "such that"                    | Introduces a condition or property                                                                        |
| $p(z) = 0$              | "p of z equals zero"           | $z$ is a root of $p$ — substituting $z$ for $x$ makes the polynomial evaluate to zero                     |
| $a_n$                   | "a sub n"                      | The leading coefficient — the coefficient of the highest-degree term $x^n$                                |
| $\prod_{k=1}^{n}$       | "product from k equals 1 to n" | Multiply together all terms as $k$ runs from 1 to $n$                                                     |
| $(x - z_k)$             | "x minus z sub k"              | A linear factor corresponding to root $z_k$; equals zero when $x = z_k$                                   |
| $i$                     | "i"                            | The imaginary unit, defined by $i^2 = -1$; not a real number                                              |
| $\sqrt{-1}$             | "square root of negative one"  | Informal notation for $i$; the number whose square is $-1$                                                |

---

## ## Plain English Explanation

Every polynomial equation — no matter how complicated — has a solution, as long as you allow complex numbers.

Think of a polynomial as a recipe: you take a number $x$, raise it to various powers, multiply by coefficients, and add everything up. The Fundamental Theorem of Algebra says that for any such recipe of degree $n \geq 1$, there is always at least one number $z$ (possibly complex) that makes the whole expression equal zero.

More powerfully: a degree-$n$ polynomial has **exactly $n$ roots** when you count repeated roots with their multiplicity. This means you can always factor any polynomial completely into $n$ linear pieces:

$$p(x) = a_n(x - z_1)(x - z_2)\cdots(x - z_n)$$

The key insight is that the complex numbers are **algebraically closed**: you never need to invent a new kind of number to solve a polynomial equation. The real numbers are _not_ algebraically closed — $x^2 + 1 = 0$ has no real solution — but the complex numbers are, and that is precisely what this theorem guarantees.

---

## ## Real-World Significance

**Signal Processing and Electrical Engineering**
Every digital filter, audio equalizer, and communication system is designed by placing polynomial roots (called _poles_ and _zeros_) in the complex plane. The theorem guarantees these roots exist, making filter design a well-posed problem. Stability of a filter depends on whether its poles lie inside or outside the unit circle.

**Control Systems**
Aircraft autopilots, chemical plant controllers, and robotic arms are governed by differential equations whose characteristic polynomials must have roots with negative real parts for stability. Engineers use the theorem's guarantee of root existence to analyze and place these roots deliberately.

**Quantum Mechanics**
The energy levels of a quantum system are eigenvalues of a Hamiltonian operator. For finite-dimensional systems, these are roots of the characteristic polynomial $\det(H - \lambda I) = 0$. The theorem guarantees that every quantum system has a complete set of energy levels.

**Computer Graphics and Geometric Modeling**
Ray-tracing algorithms find where a ray intersects a surface by solving polynomial equations. Bézier curves and NURBS surfaces — the backbone of CAD software and animated films — rely on polynomial arithmetic. The theorem ensures intersection problems always have solutions to search for.

**Cryptography**
Elliptic curve cryptography and certain post-quantum schemes use polynomials over finite fields. While the theorem applies to $\mathbb{C}$, its spirit — that algebraic equations have solutions in sufficiently rich number systems — motivates the construction of algebraic closures used in cryptographic protocols.

---

## ## History

**Ancient Precursors (before 1600)**
Mathematicians had long noticed that some polynomial equations seemed to have no solutions in the real numbers. The equation $x^2 = -1$ was considered meaningless until the 16th century, when Italian algebraists Cardano, Bombelli, and others began using "imaginary" quantities as computational tools, even without fully understanding them.

**First Statements (1629–1746)**
Albert Girard (1595–1632) was the first to explicitly state in his 1629 _L'invention en algèbre_ that a polynomial of degree $n$ has $n$ roots, though he gave no proof. René Descartes restated this in his 1637 _La Géométrie_. Jean le Rond d'Alembert attempted the first proof in 1746, but his argument had significant gaps involving the intermediate value theorem, which was not yet rigorously established.

**Gauss's Four Proofs (1799–1849)**
Carl Friedrich Gauss (1777–1855) gave the first generally accepted proof in his 1799 doctoral dissertation at the University of Helmstedt. He was so captivated by the theorem that he returned to it three more times, publishing four distinct proofs in 1799, 1816, 1816, and 1849. His later proofs used complex analysis and are closer to modern treatments. Gauss called it the _Fundamentalsatz der Algebra_.

**Modern Proofs**
Today the theorem is proved using tools from complex analysis (Liouville's theorem: every bounded entire function is constant), algebraic topology (the winding number of a polynomial around a large circle is $n$), or Galois theory. The diversity of proofs reveals deep connections between algebra, analysis, and topology.

---

## ## Examples

### Example 1: Quadratic with No Real Roots

$$p(x) = x^2 + 1$$

Degree $n = 2$, so we expect exactly 2 roots.

Setting $p(x) = 0$: $x^2 = -1$, so $x = \pm i$.

Roots: $z_1 = i$, $z_2 = -i$ (both complex, neither real).

Factored form: $p(x) = (x - i)(x + i)$

Verification: $(x - i)(x + i) = x^2 - i^2 = x^2 - (-1) = x^2 + 1$ ✓

---

### Example 2: Cubic with Mixed Roots

$$p(x) = x^3 - 6x^2 + 11x - 6$$

Degree $n = 3$, so we expect 3 roots.

By the rational root theorem, test $x = 1$: $1 - 6 + 11 - 6 = 0$ ✓

Factor out $(x - 1)$: $p(x) = (x-1)(x^2 - 5x + 6) = (x-1)(x-2)(x-3)$

Roots: $z_1 = 1$, $z_2 = 2$, $z_3 = 3$ (all real).

---

### Example 3: Polynomial with Repeated Root

$$p(x) = x^4 - 4x^3 + 6x^2 - 4x + 1 = (x - 1)^4$$

Degree $n = 4$, so we expect 4 roots counted with multiplicity.

The single root $z = 1$ has **multiplicity 4**: $z_1 = z_2 = z_3 = z_4 = 1$.

The theorem counts this as 4 roots, not 1.

---

### Example 4: Polynomial with Complex Coefficients

$$p(x) = x^2 + (1 + i)x + i$$

Using the quadratic formula with $a = 1$, $b = 1+i$, $c = i$:

$$\Delta = (1+i)^2 - 4i = 1 + 2i - 1 - 4i = -2i$$

Since $(1-i)^2 = 1 - 2i + i^2 = -2i$, we have $\sqrt{-2i} = 1 - i$.

$$x = \frac{-(1+i) \pm (1-i)}{2}$$

$$z_1 = \frac{-1-i+1-i}{2} = \frac{-2i}{2} = -i, \qquad z_2 = \frac{-1-i-1+i}{2} = \frac{-2}{2} = -1$$

Factored form: $p(x) = (x + i)(x + 1)$

---

### Example 5: Degree-5 Polynomial

$$p(x) = x^5 - 1$$

Degree $n = 5$, so we expect 5 roots: the **fifth roots of unity**.

$$z_k = e^{2\pi i k/5} = \cos\!\left(\tfrac{2\pi k}{5}\right) + i\sin\!\left(\tfrac{2\pi k}{5}\right), \quad k = 0, 1, 2, 3, 4$$

Only $z_0 = 1$ is real; the other four are complex conjugate pairs.

---

## ## Lean Status

**Status**: Proven in Lean 4 (Mathlib)

The Fundamental Theorem of Algebra is fully formalized in Lean 4's `mathlib4` library:

```lean4
import Mathlib.Analysis.SpecialFunctions.Complex.Circle
import Mathlib.RingTheory.Polynomial.Cyclotomic.Basic

-- The fundamental theorem: every non-constant complex polynomial has a root
-- This is `Complex.exists_root` in Mathlib
theorem fundamental_theorem_of_algebra
    {p : Polynomial ℂ} (hp : 0 < p.degree) :
    ∃ z : ℂ, p.eval z = 0 :=
  Complex.exists_root hp

-- Corollary: a degree-n polynomial splits into n linear factors
-- This is `Polynomial.C_leadingCoeff_mul_prod_multiset_X_sub_C` in Mathlib
theorem polynomial_splits_over_complex (p : Polynomial ℂ) :
    p.Splits (RingHom.id ℂ) :=
  IsAlgClosed.splits_codomain p
```

**Mathlib Location**: `Mathlib.Analysis.Complex.Liouville`, `Mathlib.RingTheory.AlgebraicClosed`

**Proof Strategy in Mathlib**: The Lean proof uses Liouville's theorem from complex analysis. The key steps are:

1. Assume for contradiction that $p(z) \neq 0$ for all $z \in \mathbb{C}$
2. Then $f(z) = 1/p(z)$ is an entire function (holomorphic on all of $\mathbb{C}$)
3. As $|z| \to \infty$, $|p(z)| \to \infty$, so $|f(z)| \to 0$ — hence $f$ is bounded
4. By Liouville's theorem, a bounded entire function must be constant
5. But $1/p(z)$ constant implies $p(z)$ constant, contradicting $\deg(p) \geq 1$

**Verification Level**: Complete — no `sorry` in the Mathlib proof. The result is considered a cornerstone of the complex analysis section of Mathlib.
