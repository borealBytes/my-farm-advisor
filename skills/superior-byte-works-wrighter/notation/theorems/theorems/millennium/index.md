# Millennium Prize Problems

In May 2000, the Clay Mathematics Institute (CMI) announced seven mathematical problems — the **Millennium Prize Problems** — each carrying a prize of **$1,000,000 USD** for a correct solution. These problems represent the deepest unsolved questions in mathematics, spanning number theory, topology, physics, computer science, and algebraic geometry.

Of the seven, **only one has been solved**: the Poincaré Conjecture, resolved by Grigori Perelman in 2003. He declined the prize.

---

## ## The Seven Problems

| #   | Problem                                                        | Field                    | Status               | Prize      |
| --- | -------------------------------------------------------------- | ------------------------ | -------------------- | ---------- |
| 1   | [Riemann Hypothesis](riemann_hypothesis.md)                    | Number Theory / Analysis | 🔴 **Unsolved**      | $1,000,000 |
| 2   | [P vs NP](p_vs_np.md)                                          | Computational Complexity | 🔴 **Unsolved**      | $1,000,000 |
| 3   | [Navier–Stokes Existence & Smoothness](navier_stokes.md)       | Fluid Dynamics / PDE     | 🔴 **Unsolved**      | $1,000,000 |
| 4   | [Yang–Mills & Mass Gap](yang_mills.md)                         | Quantum Field Theory     | 🔴 **Unsolved**      | $1,000,000 |
| 5   | [Hodge Conjecture](hodge_conjecture.md)                        | Algebraic Geometry       | 🔴 **Unsolved**      | $1,000,000 |
| 6   | [Birch & Swinnerton-Dyer Conjecture](birch_swinnerton-dyer.md) | Number Theory            | 🔴 **Unsolved**      | $1,000,000 |
| 7   | [Poincaré Conjecture](poincare_conjecture.md)                  | Topology                 | 🟢 **SOLVED (2003)** | Declined   |

---

## ## Why These Problems?

The CMI selected problems that are:

1. **Central** — each sits at the heart of a major mathematical discipline
2. **Resistant** — each has withstood decades or centuries of expert attack
3. **Consequential** — solutions would unlock vast new mathematical territory
4. **Precise** — each has a rigorous, unambiguous statement

The problems were inspired by David Hilbert's famous 1900 list of 23 problems, which shaped 20th-century mathematics. The Millennium Problems aim to do the same for the 21st century.

---

## ## Brief Summaries

### 🔴 Riemann Hypothesis (1859)

All non-trivial zeros of the Riemann zeta function $\zeta(s)$ lie on the **critical line** $\text{Re}(s) = \tfrac{1}{2}$. This governs the distribution of prime numbers. Over 10 trillion zeros have been verified numerically — none off the line — but no proof exists.

$$\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = 0 \implies \text{Re}(s) = \frac{1}{2}$$

---

### 🔴 P vs NP (1971)

Can every problem whose solution can be **verified** quickly also be **solved** quickly? If $\text{P} = \text{NP}$, cryptography, optimization, and AI would be revolutionized. Most experts believe $\text{P} \neq \text{NP}$, but no proof exists in either direction.

$$\text{P} \stackrel{?}{=} \text{NP}$$

---

### 🔴 Navier–Stokes (1822)

Do smooth, physically reasonable solutions to the Navier–Stokes equations always exist in 3D? Or can fluid flow develop singularities (infinite velocity) in finite time? The equations describe everything from weather to aircraft — yet their mathematical foundations remain unproven.

$$\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla)\mathbf{u} = -\nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{f}$$

---

### 🔴 Yang–Mills & Mass Gap (1954)

Quantum Yang–Mills theory underlies the Standard Model of particle physics. The **mass gap** problem asks: does the quantum Yang–Mills theory on $\mathbb{R}^4$ exist rigorously, and does it have a positive mass gap $\Delta > 0$? This would explain why gluons are confined and protons have mass.

$$\mathcal{L}_{\text{YM}} = -\frac{1}{4} F_{\mu\nu}^a F^{a\,\mu\nu}$$

---

### 🔴 Hodge Conjecture (1950)

On a smooth complex projective algebraic variety, every Hodge class is a rational linear combination of classes of algebraic cycles. This bridges topology and algebraic geometry — asking which topological features are "algebraic" in origin.

$$H^{p,p}(X) \cap H^{2p}(X, \mathbb{Q}) \stackrel{?}{=} \text{span}_{\mathbb{Q}}\{[\text{algebraic cycles}]\}$$

---

### 🔴 Birch & Swinnerton-Dyer Conjecture (1965)

The rank of an elliptic curve's rational points equals the order of vanishing of its $L$-function at $s = 1$. This connects the arithmetic of elliptic curves to complex analysis, and would explain when Diophantine equations have infinitely many rational solutions.

$$\text{rank}(E(\mathbb{Q})) = \text{ord}_{s=1} L(E, s)$$

---

### 🟢 Poincaré Conjecture (1904) — **SOLVED**

Every simply connected, closed 3-manifold is homeomorphic to the 3-sphere $S^3$. Grigori Perelman proved this in 2002–2003 using Richard Hamilton's Ricci flow with surgery. He declined the $1,000,000 prize and the Fields Medal.

$$M^3 \text{ simply connected, closed} \implies M^3 \cong S^3$$

---

## ## Historical Context

```
1859  Riemann proposes the Hypothesis
1900  Hilbert's 23 Problems shape 20th-century math
1904  Poincaré states his Conjecture
1954  Yang & Mills introduce gauge theory
1965  Birch & Swinnerton-Dyer conjecture stated
1971  Cook & Levin formulate P vs NP
2000  Clay Mathematics Institute announces 7 Millennium Problems
2003  Perelman solves Poincaré Conjecture
2010  CMI awards Perelman $1M — he declines
2026  Six problems remain unsolved
```

---

## ## Prize Rules

To claim the prize, a solution must:

1. Be published in a **peer-reviewed mathematics journal** of worldwide repute
2. Achieve **general acceptance** in the mathematics community
3. Survive a **two-year waiting period** after publication
4. Be submitted to the **Clay Mathematics Institute** for review

The CMI Scientific Advisory Board makes the final determination.

---

## ## Resources

- [Clay Mathematics Institute](https://www.claymath.org/millennium-problems/)
- [Official Problem Descriptions (PDF)](https://www.claymath.org/sites/default/files/millennium_problems.pdf)
- Individual problem files in this directory

---

_Last updated: 2026. Six of seven problems remain unsolved. Total unclaimed prize money: $6,000,000._
