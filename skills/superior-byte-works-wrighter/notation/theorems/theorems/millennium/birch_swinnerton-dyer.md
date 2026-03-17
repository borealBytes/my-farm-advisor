# Birch and Swinnerton-Dyer Conjecture

> **Status**: 🔴 UNSOLVED — Open since 1965
> **Prize**: $1,000,000 (Clay Mathematics Institute)
> **Field**: Number Theory, Arithmetic Geometry, Algebraic Geometry

---

## ## Plain English Statement

An **elliptic curve** is a curve defined by an equation of the form $y^2 = x^3 + ax + b$. Despite the name, it has nothing to do with ellipses — the name comes from elliptic integrals. These curves are central objects in modern number theory.

The fundamental question about an elliptic curve is: **how many rational points does it have?** (Points where both $x$ and $y$ are rational numbers.)

By a theorem of Mordell (1922), the rational points form a **finitely generated abelian group**:

$$E(\mathbb{Q}) \cong \mathbb{Z}^r \oplus E(\mathbb{Q})_{\text{tors}}$$

The **rank** $r$ tells you how many "independent" rational points there are. If $r = 0$, there are only finitely many rational points. If $r \geq 1$, there are infinitely many.

The **Birch and Swinnerton-Dyer (BSD) Conjecture** says: **the rank of an elliptic curve can be read off from its $L$-function**.

The $L$-function $L(E, s)$ is a complex-analytic object built from counting points on $E$ modulo primes. The conjecture says:

$$\text{rank}(E(\mathbb{Q})) = \text{ord}_{s=1} L(E, s)$$

The rank equals the **order of vanishing** of $L(E, s)$ at $s = 1$. If $L(E, 1) \neq 0$, the rank is 0 (finitely many rational points). If $L(E, 1) = 0$ but $L'(E, 1) \neq 0$, the rank is 1. And so on.

This is a profound connection between arithmetic (counting rational points) and analysis (behavior of a complex function).

---

## ## Formal Statement

**Definition (Elliptic Curve)**: An elliptic curve over $\mathbb{Q}$ is a smooth projective curve $E$ given by a **Weierstrass equation**:

$$E: y^2 = x^3 + ax + b, \quad a, b \in \mathbb{Q}, \quad \Delta = -16(4a^3 + 27b^2) \neq 0$$

**Definition (Mordell–Weil Group)**: The rational points $E(\mathbb{Q})$ form a finitely generated abelian group:

$$E(\mathbb{Q}) \cong \mathbb{Z}^r \oplus E(\mathbb{Q})_{\text{tors}}$$

**Definition ($L$-function)**: The $L$-function of $E$ is defined for $\text{Re}(s) > 3/2$ by the Euler product:

$$L(E, s) = \prod_{p \nmid \Delta} \frac{1}{1 - a_p p^{-s} + p^{1-2s}} \cdot \prod_{p \mid \Delta} \frac{1}{1 - a_p p^{-s}}$$

where $a_p = p + 1 - \#E(\mathbb{F}_p)$ counts points on $E$ modulo $p$.

**The BSD Conjecture**:

$$\boxed{\text{rank}(E(\mathbb{Q})) = \text{ord}_{s=1} L(E, s)}$$

The **refined BSD conjecture** also predicts the leading coefficient:

$$\lim_{s \to 1} \frac{L(E, s)}{(s-1)^r} = \frac{\Omega_E \cdot \text{Reg}(E) \cdot \prod_p c_p \cdot |\text{Ш}(E)|}{\left|E(\mathbb{Q})_{\text{tors}}\right|^2}$$

---

## ## Full Legend

| Symbol                        | Meaning                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------- | --- | -------------------------------------------------------- |
| $E$                           | Elliptic curve over $\mathbb{Q}$                                                |
| $a, b \in \mathbb{Q}$         | Coefficients of the Weierstrass equation                                        |
| $\Delta$                      | Discriminant: $\Delta = -16(4a^3 + 27b^2)$; $\Delta \neq 0$ ensures smoothness  |
| $E(\mathbb{Q})$               | Group of rational points on $E$ (including the point at infinity $\mathcal{O}$) |
| $r$                           | Rank of $E(\mathbb{Q})$: number of independent infinite-order generators        |
| $E(\mathbb{Q})_{\text{tors}}$ | Torsion subgroup: finite-order rational points                                  |
| $\mathbb{Z}^r$                | Free abelian group of rank $r$                                                  |
| $L(E, s)$                     | Hasse–Weil $L$-function of $E$                                                  |
| $s$                           | Complex variable                                                                |
| $p$                           | A prime number                                                                  |
| $a_p$                         | Trace of Frobenius at $p$: $a_p = p + 1 - \#E(\mathbb{F}_p)$                    |
| $\#E(\mathbb{F}_p)$           | Number of points on $E$ over the finite field $\mathbb{F}_p$                    |
| $\mathbb{F}_p$                | Finite field with $p$ elements                                                  |
| $\text{ord}_{s=1} L(E,s)$     | Order of vanishing of $L(E,s)$ at $s=1$                                         |
| $\Omega_E$                    | Real period of $E$: $\int_{E(\mathbb{R})} \omega$ where $\omega = dx/(2y)$      |
| $\text{Reg}(E)$               | Regulator: determinant of the Néron–Tate height pairing matrix                  |
| $c_p$                         | Tamagawa number at prime $p$ (local factor)                                     |
| $\text{Ш}(E)$                 | Tate–Shafarevich group (measures failure of local-global principle)             |
| $                             | \text{Ш}(E)                                                                     | $   | Order of the Tate–Shafarevich group (conjectured finite) |
| $                             | E(\mathbb{Q})\_{\text{tors}}                                                    | $   | Number of torsion points                                 |
| $\prod_p c_p$                 | Product of Tamagawa numbers (finite product)                                    |

---

## ## The Group Law on Elliptic Curves

Elliptic curves have a remarkable **group structure**: you can "add" two points to get a third.

Given points $P = (x_1, y_1)$ and $Q = (x_2, y_2)$ on $E$, their sum $P + Q$ is defined geometrically: draw the line through $P$ and $Q$, find the third intersection with $E$, and reflect across the $x$-axis.

The **point at infinity** $\mathcal{O}$ serves as the identity element.

This makes $E(\mathbb{Q})$ into an abelian group — the **Mordell–Weil group**.

---

## ## The $L$-Function and Analytic Continuation

The $L$-function $L(E, s)$ is initially defined for $\text{Re}(s) > 3/2$. By the **modularity theorem** (Wiles et al., 1995–2001), every elliptic curve over $\mathbb{Q}$ is modular — its $L$-function equals the $L$-function of a modular form. This gives:

1. **Analytic continuation** to all $s \in \mathbb{C}$
2. **Functional equation**: $L(E, s)$ satisfies a symmetry relating $s$ and $2-s$

The functional equation is:

$$\Lambda(E, s) = \varepsilon \cdot \Lambda(E, 2-s)$$

where $\Lambda(E, s) = \left(\frac{\sqrt{N}}{2\pi}\right)^s \Gamma(s) L(E, s)$ and $\varepsilon = \pm 1$ is the **root number**.

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $\Lambda(E, s)$ | Completed $L$-function |
| $N$ | Conductor of $E$ (measures bad reduction) |
| $\Gamma(s)$ | Euler gamma function |
| $\varepsilon = \pm 1$ | Root number (sign of the functional equation) |

If $\varepsilon = -1$, the functional equation forces $L(E, 1) = 0$, so the rank is at least 1. BSD predicts the rank is **odd** in this case.

---

## ## The Tate–Shafarevich Group

The **Tate–Shafarevich group** $\text{Ш}(E)$ (pronounced "sha") is one of the most mysterious objects in number theory:

$$\text{Ш}(E) = \ker\left(H^1(\mathbb{Q}, E) \to \prod_v H^1(\mathbb{Q}_v, E)\right)$$

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $H^1(\mathbb{Q}, E)$ | First Galois cohomology of $E$ over $\mathbb{Q}$ |
| $H^1(\mathbb{Q}_v, E)$ | Local cohomology at place $v$ (prime or archimedean) |
| $\mathbb{Q}_v$ | Completion of $\mathbb{Q}$ at place $v$ |
| $\ker$ | Kernel of the map |

$\text{Ш}(E)$ measures the **failure of the Hasse principle**: curves that have points over every local field $\mathbb{Q}_v$ but no rational point. Elements of $\text{Ш}(E)$ are "fake" rational points that exist locally but not globally.

BSD predicts $\text{Ш}(E)$ is **finite** (unproven in general) and its order appears in the leading coefficient formula.

---

## ## The Néron–Tate Height and Regulator

The **Néron–Tate height pairing** is a bilinear form on $E(\mathbb{Q})$:

$$\langle P, Q \rangle_{\text{NT}} \in \mathbb{R}$$

The **regulator** is the determinant of the height pairing matrix on a basis $\{P_1, \ldots, P_r\}$ of $E(\mathbb{Q})/E(\mathbb{Q})_{\text{tors}}$:

$$\text{Reg}(E) = \det\left(\langle P_i, P_j \rangle_{\text{NT}}\right)_{1 \leq i,j \leq r}$$

This measures how "spread out" the generators are — analogous to the regulator in algebraic number theory.

---

## ## Why It's Hard

### Connecting arithmetic to analysis

The rank is a purely arithmetic quantity (counting rational points). The $L$-function is analytic. Connecting them requires deep tools from both worlds simultaneously.

### The Tate–Shafarevich group

Even proving $\text{Ш}(E)$ is finite is open in general. The refined BSD formula requires knowing $|\text{Ш}(E)|$ exactly.

### No general method for rank

There is no algorithm proven to always compute the rank of an elliptic curve. The BSD conjecture would give one (via the $L$-function), but we can't prove it works.

### The $p$-adic world

Much progress uses $p$-adic $L$-functions and Iwasawa theory — a highly technical framework. Even with these tools, only partial results are known.

### Modularity was hard

The proof that all elliptic curves are modular (Wiles, 1995) was itself a decade-long effort. BSD requires going further.

---

## ## What Is Known

| Result                                                     | Status                                          |
| ---------------------------------------------------------- | ----------------------------------------------- |
| BSD for rank 0: $L(E,1) \neq 0 \implies r = 0$             | ✅ Proved (Coates–Wiles, 1977; Kolyvagin, 1988) |
| BSD for rank 1: $\text{ord}_{s=1} L = 1 \implies r \geq 1$ | ✅ Proved (Gross–Zagier + Kolyvagin, 1986–1988) |
| $\text{Ш}(E)$ is finite when $r \leq 1$                    | ✅ Proved (Kolyvagin, 1988)                     |
| BSD for rank $\geq 2$                                      | 🔴 Open                                         |
| Refined BSD formula                                        | 🔴 Open                                         |
| $\text{Ш}(E)$ finite in general                            | 🔴 Open                                         |

The cases $r = 0$ and $r = 1$ are proved. Everything beyond is open.

---

## ## History

| Year      | Event                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| **1922**  | Louis Mordell proves $E(\mathbb{Q})$ is finitely generated                                                            |
| **1928**  | André Weil generalizes to number fields (Mordell–Weil theorem)                                                        |
| **1960s** | Bryan Birch and Peter Swinnerton-Dyer use early computers at Cambridge to compute $\#E(\mathbb{F}_p)$ for many primes |
| **1965**  | Birch & Swinnerton-Dyer state the conjecture based on numerical evidence                                              |
| **1977**  | Coates & Wiles prove BSD for CM curves with $L(E,1) \neq 0$                                                           |
| **1983**  | Faltings proves Mordell's conjecture: curves of genus $\geq 2$ have finitely many rational points                     |
| **1986**  | Gross & Zagier prove the Gross–Zagier formula relating $L'(E,1)$ to heights of Heegner points                         |
| **1988**  | Kolyvagin introduces Euler systems; proves BSD for rank $\leq 1$                                                      |
| **1995**  | Wiles proves Fermat's Last Theorem; key step is modularity of semistable elliptic curves                              |
| **2001**  | Breuil, Conrad, Diamond, Taylor complete the modularity theorem for all elliptic curves over $\mathbb{Q}$             |
| **2000**  | Clay Mathematics Institute designates BSD a Millennium Prize Problem                                                  |
| **2026**  | Still unsolved for rank $\geq 2$                                                                                      |

---

## ## Connection to Fermat's Last Theorem

The proof of **Fermat's Last Theorem** (Wiles, 1995) is deeply connected to BSD. Wiles proved the **modularity theorem** for semistable elliptic curves — the same theorem needed for BSD. The techniques (Galois representations, modular forms, Euler systems) are shared.

BSD is in some sense the "next frontier" after Fermat's Last Theorem in the arithmetic of elliptic curves.

---

## ## Current Status

🔴 **UNSOLVED**

- Proved for rank 0 and rank 1 (Kolyvagin, 1988)
- Completely open for rank $\geq 2$
- Refined formula unproven
- Prize: **$1,000,000** from the Clay Mathematics Institute

> _"The conjecture of Birch and Swinnerton-Dyer is one of the most beautiful and important problems in mathematics. It connects the arithmetic of elliptic curves to the analytic properties of their $L$-functions in a way that is both surprising and profound."_
> — Andrew Wiles

---

_See also: [Index of Millennium Problems](index.md) · [Riemann Hypothesis](riemann_hypothesis.md) · [Hodge Conjecture](hodge_conjecture.md)_
