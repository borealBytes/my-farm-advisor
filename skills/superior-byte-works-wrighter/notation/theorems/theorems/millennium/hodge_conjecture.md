# Hodge Conjecture

> **Status**: 🔴 UNSOLVED — Open since 1950
> **Prize**: $1,000,000 (Clay Mathematics Institute)
> **Field**: Algebraic Geometry, Algebraic Topology, Complex Geometry

---

## ## Plain English Statement

Imagine a smooth, high-dimensional geometric object — a **complex projective algebraic variety**. Think of it as a surface (or higher-dimensional shape) defined by polynomial equations with complex number coordinates.

Such an object has two kinds of structure:

1. **Topological structure**: How it's connected, how many holes it has, etc. — captured by cohomology groups.
2. **Algebraic structure**: Which parts of it are defined by polynomial equations — captured by algebraic cycles.

The **Hodge Conjecture** asks: **are these two structures compatible?**

More precisely: certain topological features of the variety — called **Hodge classes** — look like they _should_ come from algebraic subvarieties. They have the right "type" in the Hodge decomposition. The conjecture says they always do: every Hodge class is a rational linear combination of classes of algebraic cycles.

In plain terms: **every topological feature of the right "algebraic type" is actually algebraic in origin.**

This is a bridge between topology (the flexible, continuous world) and algebraic geometry (the rigid, polynomial world). The conjecture says the bridge is complete — nothing is "accidentally" of the right type without being truly algebraic.

---

## ## Formal Statement

Let $X$ be a smooth complex projective algebraic variety of complex dimension $n$.

The **Hodge decomposition** of the cohomology:

$$H^k(X, \mathbb{C}) = \bigoplus_{p+q=k} H^{p,q}(X)$$

A cohomology class $\alpha \in H^{2p}(X, \mathbb{Q})$ is called a **Hodge class** if:

$$\alpha \otimes_{\mathbb{Q}} \mathbb{C} \in H^{p,p}(X)$$

i.e., $\alpha$ lies in the $(p,p)$ part of the Hodge decomposition.

**The Hodge Conjecture**: Every Hodge class on $X$ is a rational linear combination of cohomology classes of algebraic cycles:

$$\boxed{H^{p,p}(X) \cap H^{2p}(X, \mathbb{Q}) = \text{span}_{\mathbb{Q}} \left\{ [Z] : Z \subset X \text{ algebraic subvariety of codimension } p \right\}}$$

---

## ## Full Legend

| Symbol                                   | Meaning                                                             |
| ---------------------------------------- | ------------------------------------------------------------------- |
| $X$                                      | Smooth complex projective algebraic variety                         |
| $n$                                      | Complex dimension of $X$ (real dimension $2n$)                      |
| $H^k(X, \mathbb{C})$                     | $k$-th singular cohomology of $X$ with complex coefficients         |
| $H^k(X, \mathbb{Q})$                     | $k$-th singular cohomology with rational coefficients               |
| $H^{p,q}(X)$                             | $(p,q)$-Dolbeault cohomology group                                  |
| $p, q$                                   | Holomorphic and antiholomorphic degrees; $p + q = k$                |
| $\alpha$                                 | A cohomology class                                                  |
| $\alpha \otimes_{\mathbb{Q}} \mathbb{C}$ | Extension of scalars from $\mathbb{Q}$ to $\mathbb{C}$              |
| Hodge class                              | A rational cohomology class of type $(p,p)$                         |
| $[Z]$                                    | Cohomology class (fundamental class) of an algebraic subvariety $Z$ |
| $Z \subset X$                            | An algebraic subvariety (defined by polynomial equations)           |
| $\text{codim}(Z) = p$                    | $Z$ has complex codimension $p$ (complex dimension $n-p$)           |
| $\text{span}_{\mathbb{Q}}$               | Rational linear span                                                |
| $\mathbb{C}$                             | Complex numbers                                                     |
| $\mathbb{Q}$                             | Rational numbers                                                    |
| $\mathbb{Z}$                             | Integers                                                            |
| $\bigoplus$                              | Direct sum of vector spaces                                         |

---

## ## The Hodge Decomposition

For a compact Kähler manifold $X$ (which includes all smooth projective varieties), the complex cohomology decomposes as:

$$H^k(X, \mathbb{C}) = \bigoplus_{p+q=k} H^{p,q}(X)$$

with the **complex conjugation symmetry**:

$$\overline{H^{p,q}(X)} = H^{q,p}(X)$$

**Legend**:
| Symbol | Meaning |
|--------|---------|
| Kähler manifold | Complex manifold with a compatible Riemannian metric |
| $H^{p,q}(X)$ | Cohomology classes representable by $(p,q)$-forms |
| $(p,q)$-form | Differential form with $p$ holomorphic and $q$ antiholomorphic indices |
| $\overline{(\cdot)}$ | Complex conjugation |

The key point: $H^{p,p}(X)$ is the "middle" part — forms with equal holomorphic and antiholomorphic degrees. These are the candidates for algebraic classes.

---

## ## Algebraic Cycles

An **algebraic cycle** of codimension $p$ on $X$ is a formal integer linear combination:

$$Z = \sum_i n_i Z_i, \quad n_i \in \mathbb{Z}$$

where each $Z_i$ is an irreducible algebraic subvariety of $X$ with $\text{codim}(Z_i) = p$.

The **cycle class map**:

$$\text{cl}: Z^p(X) \to H^{2p}(X, \mathbb{Z})$$

sends each algebraic cycle to its cohomology class (Poincaré dual of the fundamental class).

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $Z^p(X)$ | Group of algebraic cycles of codimension $p$ on $X$ |
| $n_i \in \mathbb{Z}$ | Integer multiplicity of each component |
| $Z_i$ | Irreducible algebraic subvariety |
| $\text{cl}(Z)$ | Cohomology class of the cycle $Z$ |
| $H^{2p}(X, \mathbb{Z})$ | Integral cohomology in degree $2p$ |

**Key fact**: The image of $\text{cl}$ always lands in $H^{p,p}(X) \cap H^{2p}(X, \mathbb{Z})$. The Hodge Conjecture asks whether the rational span of this image equals all of $H^{p,p}(X) \cap H^{2p}(X, \mathbb{Q})$.

---

## ## The Case $p = 1$: The Lefschetz $(1,1)$ Theorem

For $p = 1$, the Hodge Conjecture is **true** — this is the **Lefschetz $(1,1)$ theorem** (1924):

$$H^{1,1}(X) \cap H^2(X, \mathbb{Z}) = \text{image of } c_1: \text{Pic}(X) \to H^2(X, \mathbb{Z})$$

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $\text{Pic}(X)$ | Picard group: isomorphism classes of holomorphic line bundles on $X$ |
| $c_1$ | First Chern class map |
| $H^{1,1}(X) \cap H^2(X, \mathbb{Z})$ | Integral $(1,1)$-classes |

Every integral $(1,1)$-class is the first Chern class of a line bundle, which corresponds to a divisor (codimension-1 algebraic cycle). So the conjecture holds for divisors.

The difficulty begins at $p = 2$ — for codimension-2 cycles (surfaces inside a 4-fold, etc.).

---

## ## Counterexamples to Integral Version

The **integral Hodge conjecture** (replacing $\mathbb{Q}$ with $\mathbb{Z}$) is **false**. Atiyah and Hirzebruch (1961) found integral Hodge classes that are not integral linear combinations of algebraic cycle classes.

The rational version (the actual Millennium Problem) remains open.

---

## ## Why It's Hard

### The gap between topology and algebra

Topology is flexible — you can continuously deform things. Algebra is rigid — polynomial equations are very constrained. Bridging these worlds requires understanding when topological data forces algebraic structure.

### High codimension

The $p = 1$ case is solved. For $p \geq 2$, we lack the tools. Algebraic cycles of high codimension are much harder to construct and classify.

### No general construction

Given a Hodge class, there's no known algorithm to find an algebraic cycle representing it. The existence proof would need to be non-constructive.

### Hodge theory is transcendental

The Hodge decomposition uses analysis (harmonic forms, Laplacians). Connecting this to the algebraic world of polynomial equations requires bridging analysis and algebra in a deep way.

### Counterexamples lurk

The integral version is false. Any proof of the rational version must use the rationality in an essential way — ruling out the integral counterexamples while proving the rational statement.

---

## ## Known Cases

| Case                              | Status                                        |
| --------------------------------- | --------------------------------------------- |
| $p = 1$ (divisors)                | ✅ Proved (Lefschetz, 1924)                   |
| $p = n-1$ (curves on $n$-folds)   | ✅ Proved (dual to $p=1$ by Poincaré duality) |
| Abelian varieties (special cases) | ✅ Proved for some                            |
| General $p \geq 2$                | 🔴 Open                                       |
| Uniruled varieties                | Partial results                               |
| Calabi–Yau manifolds              | 🔴 Open                                       |

---

## ## History

| Year      | Event                                                                                 |
| --------- | ------------------------------------------------------------------------------------- |
| **1924**  | Solomon Lefschetz proves the $(1,1)$ theorem — the $p=1$ case                         |
| **1950**  | W.V.D. Hodge states the conjecture at the International Congress of Mathematicians    |
| **1952**  | Hodge publishes _The Theory and Applications of Harmonic Integrals_                   |
| **1961**  | Atiyah & Hirzebruch disprove the integral version                                     |
| **1969**  | Grothendieck reformulates the conjecture in terms of motives                          |
| **1970s** | Deligne proves the Weil conjectures — a related result for finite fields              |
| **1990s** | Voisin proves the Hodge conjecture fails for compact Kähler manifolds (non-algebraic) |
| **2000**  | Clay Mathematics Institute designates Hodge Conjecture a Millennium Prize Problem     |
| **2002**  | Claire Voisin proves the integral Hodge conjecture fails for Kähler manifolds         |
| **2026**  | Still unsolved for smooth projective varieties                                        |

---

## ## Connection to Motives

Grothendieck's theory of **motives** provides a conjectural framework:

Every smooth projective variety $X$ has a **motive** $h(X)$ that decomposes as:

$$h(X) = \bigoplus_{k=0}^{2n} h^k(X)$$

The Hodge Conjecture would follow from the **Standard Conjectures** — a set of conjectures about algebraic cycles that Grothendieck proposed in the 1960s. The Standard Conjectures remain unproven.

---

## ## Current Status

🔴 **UNSOLVED**

- Proved only for $p = 1$ (divisors) and $p = n-1$ (by duality)
- The integral version is false; the rational version is open
- No counterexample known for smooth projective varieties
- Prize: **$1,000,000** from the Clay Mathematics Institute

> _"The Hodge conjecture is one of the deepest problems in algebraic geometry. It asks whether the topology of an algebraic variety is controlled by its algebra — a question that touches the foundations of the subject."_
> — Pierre Deligne

---

_See also: [Index of Millennium Problems](index.md) · [Birch & Swinnerton-Dyer Conjecture](birch_swinnerton-dyer.md)_
