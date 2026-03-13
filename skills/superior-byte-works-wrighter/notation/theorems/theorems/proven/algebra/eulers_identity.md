# Euler's Identity

## ## LaTeX Statement

$$e^{i\pi} + 1 = 0$$

Equivalently:

$$e^{i\pi} = -1$$

This is the special case $\theta = \pi$ of **Euler's Formula**:

$$e^{i\theta} = \cos\theta + i\sin\theta \quad \forall\, \theta \in \mathbb{R}$$

The identity unites five fundamental constants in a single equation:

$$\underbrace{e}_{\text{analysis}} \cdot \underbrace{i}_{\text{algebra}} \cdot \underbrace{\pi}_{\text{geometry}} + \underbrace{1}_{\text{arithmetic}} = \underbrace{0}_{\text{arithmetic}}$$

---

## ## Legend

| Symbol       | Pronunciation                | Meaning                                                                                                                                          |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| $e$          | "e" or "Euler's number"      | The base of the natural logarithm; $e = \lim_{n\to\infty}\left(1 + \frac{1}{n}\right)^n = \sum_{n=0}^{\infty}\frac{1}{n!} \approx 2.71828\ldots$ |
| $i$          | "i" or "the imaginary unit"  | The number satisfying $i^2 = -1$; extends the real numbers to the complex numbers                                                                |
| $\pi$        | "pi"                         | The ratio of a circle's circumference to its diameter; $\pi \approx 3.14159\ldots$                                                               |
| $e^{i\pi}$   | "e to the i pi"              | The complex exponential function evaluated at the complex number $i\pi$                                                                          |
| $+$          | "plus"                       | Addition in the complex numbers                                                                                                                  |
| $1$          | "one"                        | The multiplicative identity — the number 1                                                                                                       |
| $=$          | "equals"                     | Equality                                                                                                                                         |
| $0$          | "zero"                       | The additive identity — the number 0                                                                                                             |
| $-1$         | "negative one"               | The additive inverse of 1; the result of $e^{i\pi}$                                                                                              |
| $\theta$     | "theta"                      | A real number representing an angle in radians                                                                                                   |
| $\cos\theta$ | "cosine of theta"            | The real part of $e^{i\theta}$; the x-coordinate on the unit circle at angle $\theta$                                                            |
| $\sin\theta$ | "sine of theta"              | The imaginary part of $e^{i\theta}$; the y-coordinate on the unit circle at angle $\theta$                                                       |
| $\forall$    | "for all"                    | Universal quantifier — Euler's formula holds for every real $\theta$                                                                             |
| $\mathbb{R}$ | "R" or "the real numbers"    | The set of all real numbers                                                                                                                      |
| $\mathbb{C}$ | "C" or "the complex numbers" | The set $\{a + bi \mid a, b \in \mathbb{R}\}$                                                                                                    |
| $n!$         | "n factorial"                | The product $n \times (n-1) \times \cdots \times 1$; used in the power series for $e^z$                                                          |

### The Five Constants

| Constant | Value           | Domain                     | Significance                       |
| -------- | --------------- | -------------------------- | ---------------------------------- |
| $e$      | $2.71828\ldots$ | Analysis / Calculus        | Base of natural growth and decay   |
| $i$      | $\sqrt{-1}$     | Algebra / Complex Analysis | Extends arithmetic to 2D           |
| $\pi$    | $3.14159\ldots$ | Geometry / Trigonometry    | Ratio of circumference to diameter |
| $1$      | $1$             | Arithmetic                 | Multiplicative identity            |
| $0$      | $0$             | Arithmetic                 | Additive identity                  |

---

## ## Plain English Explanation

Euler's Identity says that if you raise the number $e$ to the power $i\pi$, you get $-1$. Adding 1 to both sides gives $e^{i\pi} + 1 = 0$.

At first glance this seems impossible — how can you raise a number to an imaginary power? The answer lies in **Euler's Formula**, which defines what $e^{i\theta}$ means for real $\theta$:

$$e^{i\theta} = \cos\theta + i\sin\theta$$

This formula says that $e^{i\theta}$ is a point on the **unit circle** in the complex plane, at angle $\theta$ from the positive real axis. As $\theta$ increases, the point travels counterclockwise around the circle.

When $\theta = \pi$ (180 degrees), the point has traveled halfway around the circle and lands at $(-1, 0)$ — the point $-1$ on the real axis:

$$e^{i\pi} = \cos\pi + i\sin\pi = -1 + i \cdot 0 = -1$$

So $e^{i\pi} + 1 = 0$.

**Why is this beautiful?** The identity is surprising because $e$, $i$, and $\pi$ come from completely different areas of mathematics — exponential growth, imaginary numbers, and circle geometry — yet they are connected by the simplest possible equation. It reveals that these seemingly unrelated constants are facets of a single deeper structure: the complex exponential function.

---

## ## Real-World Significance

**Signal Processing and Fourier Analysis**
Euler's formula $e^{i\theta} = \cos\theta + i\sin\theta$ is the foundation of Fourier analysis. Every signal — audio, radio, image — can be decomposed into complex exponentials $e^{i\omega t}$. The Discrete Fourier Transform (DFT), which powers MP3 compression, JPEG images, 5G communications, and MRI machines, is built entirely on this formula. The identity is the $\omega t = \pi$ case.

**Quantum Mechanics**
The time evolution of a quantum state is governed by $|\psi(t)\rangle = e^{-iHt/\hbar}|\psi(0)\rangle$, where $H$ is the Hamiltonian operator. This is a direct generalization of Euler's formula to operators. The identity $e^{i\pi} = -1$ corresponds to a phase rotation of $\pi$ — a half-turn in the complex plane — which appears in spin-1/2 particles (electrons, protons) and explains why rotating a spinor by $2\pi$ gives $-1$, not $+1$.

**Electrical Engineering — AC Circuits**
Alternating current is represented as $V(t) = V_0 e^{i\omega t}$ (taking the real part). Impedance, phase shifts, and resonance are all analyzed using complex exponentials. A phase shift of $\pi$ radians (180°) corresponds to multiplication by $e^{i\pi} = -1$, which inverts the signal.

**Control Theory and Stability Analysis**
The Laplace transform converts differential equations into algebraic ones involving $e^{st}$ for complex $s$. The stability of a system depends on whether the poles (values of $s$ where the transfer function diverges) have negative real parts. The unit circle in the $z$-plane (discrete-time systems) is parameterized by $e^{i\theta}$, making Euler's formula central to digital control design.

**Number Theory — Riemann Zeta Function**
The Riemann Hypothesis, the most famous unsolved problem in mathematics, concerns the zeros of $\zeta(s) = \sum_{n=1}^{\infty} n^{-s}$. The functional equation of $\zeta$ involves $e^{i\pi s/2}$, and the critical strip where zeros lie is intimately connected to Euler's formula. The prime number theorem — describing how primes are distributed — is proved using complex analysis built on $e^{i\theta}$.

**Computer Graphics — Rotations**
Multiplying a complex number $z$ by $e^{i\theta}$ rotates it by angle $\theta$ in the complex plane. This is the most efficient way to represent 2D rotations. In 3D, quaternions (which generalize complex numbers) use the same principle. Every rotation in a video game or 3D animation ultimately traces back to Euler's formula.

---

## ## History

**Euler's Formula (1748)**
Leonhard Euler (1707–1783) published the formula $e^{i\theta} = \cos\theta + i\sin\theta$ in his 1748 masterwork _Introductio in analysin infinitorum_ (Introduction to the Analysis of the Infinite). He derived it by substituting $i\theta$ into the power series for $e^x$ and separating real and imaginary parts:

$$e^{i\theta} = \sum_{n=0}^{\infty}\frac{(i\theta)^n}{n!} = \sum_{k=0}^{\infty}\frac{(-1)^k\theta^{2k}}{(2k)!} + i\sum_{k=0}^{\infty}\frac{(-1)^k\theta^{2k+1}}{(2k+1)!} = \cos\theta + i\sin\theta$$

**Earlier Appearances**
Roger Cotes (1682–1716), a colleague of Newton, wrote $ix = \ln(\cos x + i\sin x)$ in 1714 — equivalent to Euler's formula — but died young before developing it further. Johann Bernoulli (1667–1748) also had related results. Euler synthesized and popularized these ideas.

**The Identity's Name**
The specific form $e^{i\pi} + 1 = 0$ is called "Euler's Identity," though Euler himself did not write it in this exact form. The identity became famous in the 19th and 20th centuries as mathematicians came to appreciate the unity it represents.

**Reactions from Mathematicians**

- Richard Feynman (physicist): called Euler's formula "the most remarkable formula in mathematics"
- Benjamin Peirce (mathematician, 1809–1880): reportedly told his Harvard students, "Gentlemen, that is surely true, it is absolutely paradoxical; we cannot understand it, and we don't know what it means, but we have proved it, and therefore we know it must be the truth"
- In a 1988 _Mathematical Intelligencer_ poll, $e^{i\pi} + 1 = 0$ was voted the most beautiful theorem in mathematics

**Geometric Interpretation**
The formula was given a beautiful geometric interpretation by Caspar Wessel (1745–1818) and Jean-Robert Argand (1768–1822), who independently developed the complex plane (Argand diagram). In this picture, $e^{i\theta}$ traces the unit circle, and the identity says that traveling $\pi$ radians (half the circle) from $+1$ lands at $-1$.

---

## ## Examples

### Example 1: Direct Verification via Euler's Formula

Starting from $e^{i\theta} = \cos\theta + i\sin\theta$, set $\theta = \pi$:

$$e^{i\pi} = \cos\pi + i\sin\pi$$

Using known values: $\cos\pi = -1$ and $\sin\pi = 0$:

$$e^{i\pi} = -1 + i \cdot 0 = -1$$

Therefore: $e^{i\pi} + 1 = -1 + 1 = 0$ ✓

---

### Example 2: Derivation from Power Series

The power series for $e^z$ converges for all $z \in \mathbb{C}$:

$$e^{i\pi} = \sum_{n=0}^{\infty}\frac{(i\pi)^n}{n!} = 1 + i\pi + \frac{(i\pi)^2}{2!} + \frac{(i\pi)^3}{3!} + \frac{(i\pi)^4}{4!} + \cdots$$

Using $i^0=1$, $i^1=i$, $i^2=-1$, $i^3=-i$, $i^4=1$, $\ldots$:

$$= \left(1 - \frac{\pi^2}{2!} + \frac{\pi^4}{4!} - \cdots\right) + i\left(\pi - \frac{\pi^3}{3!} + \frac{\pi^5}{5!} - \cdots\right)$$

$$= \cos\pi + i\sin\pi = -1 + 0 = -1$$

---

### Example 3: Related Identities at Other Angles

| $\theta$ | $e^{i\theta}$                              | Geometric meaning                         |
| -------- | ------------------------------------------ | ----------------------------------------- |
| $0$      | $1$                                        | Start: point $(1, 0)$                     |
| $\pi/6$  | $\frac{\sqrt{3}}{2} + \frac{i}{2}$         | 30° on unit circle                        |
| $\pi/4$  | $\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}i$ | 45° on unit circle                        |
| $\pi/2$  | $i$                                        | 90°: point $(0, 1)$ — so $e^{i\pi/2} = i$ |
| $\pi$    | $-1$                                       | 180°: Euler's Identity                    |
| $3\pi/2$ | $-i$                                       | 270°: point $(0, -1)$                     |
| $2\pi$   | $1$                                        | Full circle: back to start                |

The identity $e^{2\pi i} = 1$ shows that the complex exponential is periodic with period $2\pi i$.

---

### Example 4: Roots of Unity

The $n$-th roots of unity are the solutions to $z^n = 1$. By Euler's formula:

$$z_k = e^{2\pi i k/n} = \cos\!\left(\frac{2\pi k}{n}\right) + i\sin\!\left(\frac{2\pi k}{n}\right), \quad k = 0, 1, \ldots, n-1$$

For $n = 2$: $z_0 = e^0 = 1$ and $z_1 = e^{i\pi} = -1$.

Euler's Identity gives the non-trivial square root of unity: $(-1)^2 = 1$ ✓.

For $n = 4$: the fourth roots of unity are $1, i, -1, -i$ — the four compass points on the unit circle.

---

### Example 5: Rotation in the Complex Plane

Multiplying a complex number $z$ by $e^{i\theta}$ rotates it by angle $\theta$ counterclockwise.

Multiplying by $e^{i\pi} = -1$ rotates by $180°$, which is the same as negation:

$$e^{i\pi} \cdot (3 + 4i) = -1 \cdot (3 + 4i) = -3 - 4i$$

The point $(3, 4)$ maps to $(-3, -4)$ — reflected through the origin.

---

### Example 6: De Moivre's Theorem

For any real $\theta$ and integer $n$:

$$(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta)$$

**Proof using Euler's formula**: $(\cos\theta + i\sin\theta)^n = (e^{i\theta})^n = e^{in\theta} = \cos(n\theta) + i\sin(n\theta)$

**Application**: Find $\cos(3\theta)$ in terms of $\cos\theta$.

$$(\cos\theta + i\sin\theta)^3 = \cos(3\theta) + i\sin(3\theta)$$

Expanding the left side and taking the real part:

$$\cos(3\theta) = \cos^3\theta - 3\cos\theta\sin^2\theta = 4\cos^3\theta - 3\cos\theta$$

---

### Example 7: Logarithm of a Negative Number

From $e^{i\pi} = -1$, taking the natural logarithm:

$$\ln(-1) = i\pi$$

More generally, for any negative real number $-r$ ($r > 0$):

$$\ln(-r) = \ln(r) + i\pi$$

This shows that logarithms of negative numbers are complex — they have an imaginary part of $\pi$ (the principal value). This is why $\ln(-1)$ is undefined over the reals but well-defined over $\mathbb{C}$.

---

## ## Lean Status

**Status**: Proven in Lean 4 (Mathlib)

Euler's Identity is fully formalized in Lean 4's `mathlib4`:

```lean4
import Mathlib.Analysis.SpecialFunctions.Complex.Circle
import Mathlib.Analysis.SpecialFunctions.Trigonometric.Basic

-- Euler's Formula: e^(iθ) = cos θ + i sin θ
-- This is `Complex.exp_mul_I` or `Complex.cos_add_sin_mul_I` in Mathlib
theorem euler_formula (θ : ℝ) :
    Complex.exp (θ * Complex.I) = Real.cos θ + Real.sin θ * Complex.I := by
  rw [mul_comm]
  exact Complex.exp_mul_I θ

-- Euler's Identity: e^(iπ) + 1 = 0
-- This is `Complex.exp_pi_mul_I` in Mathlib
theorem euler_identity : Complex.exp (Real.pi * Complex.I) + 1 = 0 := by
  rw [euler_formula Real.pi]
  -- cos π = -1 and sin π = 0
  simp [Real.cos_pi, Real.sin_pi, Complex.ext_iff]

-- Alternatively, using the circle group:
-- expMapCircle π = -1 (as a point on the unit circle)
theorem exp_map_circle_pi : expMapCircle Real.pi = -1 := by
  ext
  · simp [expMapCircle, Real.cos_pi]
  · simp [expMapCircle, Real.sin_pi]
```

**Mathlib Location**: `Mathlib.Analysis.SpecialFunctions.Complex.Circle`, `Mathlib.Analysis.SpecialFunctions.Trigonometric.Basic`

**Proof Approach**: The Lean proof proceeds in three steps:

1. **Define** $e^z$ for complex $z$ via the power series $\sum_{n=0}^{\infty} \frac{z^n}{n!}$, proved to converge absolutely for all $z \in \mathbb{C}$

2. **Prove Euler's Formula** by substituting $z = i\theta$, separating even and odd powers, and recognizing the Taylor series for $\cos\theta$ and $\sin\theta$:
   $$e^{i\theta} = \sum_{n=0}^{\infty}\frac{(i\theta)^n}{n!} = \underbrace{\sum_{k=0}^{\infty}\frac{(-1)^k\theta^{2k}}{(2k)!}}_{\cos\theta} + i\underbrace{\sum_{k=0}^{\infty}\frac{(-1)^k\theta^{2k+1}}{(2k+1)!}}_{\sin\theta}$$

3. **Evaluate at $\theta = \pi$** using the known values $\cos\pi = -1$ and $\sin\pi = 0$ (themselves proved from the series definitions)

**Verification Level**: Complete — `Complex.exp_pi_mul_I` in Mathlib has no `sorry`. The proof relies on substantial infrastructure (convergence of power series, trigonometric identities) that is fully verified in Mathlib's analysis library.
