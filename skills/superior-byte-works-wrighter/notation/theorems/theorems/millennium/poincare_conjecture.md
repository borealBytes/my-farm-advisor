# Poincaré Conjecture

> **Status**: 🟢 SOLVED — Proved by Grigori Perelman (2002–2003)
> **Prize**: $1,000,000 offered by Clay Mathematics Institute — **Declined by Perelman**
> **Field**: Geometric Topology, Differential Geometry, Riemannian Geometry

---

## ## Plain English Statement

Imagine you have a rubber band stretched around the surface of a sphere (like a globe). You can always slide the rubber band to a single point — shrink it down without it getting stuck. Now imagine the same rubber band on the surface of a donut (a torus). If the band goes through the hole, you _cannot_ shrink it to a point — it's trapped.

This property — whether every loop can be shrunk to a point — is called **simple connectivity**.

The **Poincaré Conjecture** asks: if a 3-dimensional shape is simply connected and closed (finite, no boundary), must it be a 3-sphere?

In 2D, this is obvious: the only simply connected closed surface is the ordinary sphere $S^2$. Poincaré conjectured the same is true in 3D: the only simply connected closed 3-manifold is the 3-sphere $S^3$.

This was proved by **Grigori Perelman** in a series of papers posted to arXiv in 2002–2003, using Richard Hamilton's **Ricci flow** technique. The proof is one of the greatest mathematical achievements of the 21st century.

---

## ## Formal Statement

**Definition (3-Manifold)**: A topological space $M$ is a **3-manifold** if every point has a neighborhood homeomorphic to $\mathbb{R}^3$.

**Definition (Simply Connected)**: $M$ is **simply connected** if it is path-connected and every continuous loop $\gamma: S^1 \to M$ can be continuously contracted to a point:

$$\pi_1(M) = 0$$

where $\pi_1(M)$ is the fundamental group of $M$.

**Definition (Closed)**: $M$ is **closed** if it is compact (finite, bounded) and has no boundary ($\partial M = \emptyset$).

**The Poincaré Conjecture** (now theorem):

$$\boxed{M^3 \text{ closed, simply connected} \implies M^3 \cong S^3}$$

Every closed, simply connected 3-manifold is homeomorphic to the 3-sphere.

---

## ## Full Legend

| Symbol          | Meaning                                                                              |
| --------------- | ------------------------------------------------------------------------------------ |
| $M^3$           | A 3-dimensional manifold                                                             |
| $S^3$           | The 3-sphere: $\{(x_1,x_2,x_3,x_4) \in \mathbb{R}^4 : x_1^2+x_2^2+x_3^2+x_4^2 = 1\}$ |
| $S^1$           | The circle (1-sphere)                                                                |
| $S^2$           | The ordinary sphere (2-sphere)                                                       |
| $\pi_1(M)$      | Fundamental group: equivalence classes of loops in $M$                               |
| $\pi_1(M) = 0$  | Trivial fundamental group (simply connected)                                         |
| $\cong$         | Homeomorphic (topologically equivalent)                                              |
| $\partial M$    | Boundary of $M$                                                                      |
| $\mathbb{R}^3$  | Three-dimensional Euclidean space                                                    |
| $\mathbb{R}^4$  | Four-dimensional Euclidean space                                                     |
| Compact         | Every open cover has a finite subcover (intuitively: finite, bounded)                |
| Closed manifold | Compact manifold without boundary                                                    |
| Homeomorphism   | Continuous bijection with continuous inverse (topological equivalence)               |

---

## ## The Ricci Flow

Perelman's proof used **Ricci flow**, introduced by Richard Hamilton in 1982. Ricci flow evolves a Riemannian metric $g_{ij}$ on a manifold by:

$$\frac{\partial g_{ij}}{\partial t} = -2 R_{ij}$$

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $g_{ij}$ | Riemannian metric tensor (measures distances and angles) |
| $t$ | "Time" parameter of the flow |
| $R_{ij}$ | Ricci curvature tensor |
| $R_{ij} = R^k{}_{ikj}$ | Contraction of the Riemann curvature tensor |
| $R^k{}_{ikj}$ | Riemann curvature tensor |

**Intuition**: Ricci flow is like a "heat equation" for the metric. It smooths out irregularities in curvature — regions of high positive curvature shrink, regions of negative curvature expand. Over time, the manifold tends toward a more uniform geometry.

For a simply connected 3-manifold, Hamilton conjectured that Ricci flow would deform the metric until the manifold becomes round (constant positive curvature), proving it must be $S^3$.

The problem: Ricci flow can develop **singularities** — points where curvature becomes infinite in finite time.

---

## ## Perelman's Ricci Flow with Surgery

Perelman's key innovation was **Ricci flow with surgery**:

1. Run Ricci flow until a singularity forms
2. **Surgically remove** the singular region (cut out a small neighborhood and cap it off with a standard piece)
3. Continue the flow on the modified manifold
4. Repeat

Perelman proved:

- Singularities always look like **necks** (regions homeomorphic to $S^2 \times (-1,1)$)
- Surgery can always be performed in a controlled way
- After finitely many surgeries, the flow either collapses or becomes extinct
- For a simply connected 3-manifold, the flow becomes **extinct in finite time** — the manifold shrinks to a point, proving it was $S^3$

---

## ## Perelman's Entropy Functionals

Perelman introduced two key monotone quantities:

**$\mathcal{F}$-functional** (gradient steady soliton):

$$\mathcal{F}(g, f) = \int_M \left(R + |\nabla f|^2\right) e^{-f} \, dV$$

**$\mathcal{W}$-entropy** (shrinking soliton):

$$\mathcal{W}(g, f, \tau) = \int_M \left[\tau\left(R + |\nabla f|^2\right) + f - n\right] \frac{e^{-f}}{(4\pi\tau)^{n/2}} \, dV$$

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $\mathcal{F}$ | Perelman's $\mathcal{F}$-functional |
| $\mathcal{W}$ | Perelman's entropy functional |
| $R$ | Scalar curvature: $R = g^{ij} R_{ij}$ |
| $f$ | A smooth function on $M$ (auxiliary variable) |
| $\nabla f$ | Gradient of $f$ |
| $|\nabla f|^2$ | Squared norm of the gradient |
| $\tau$ | Backward time parameter |
| $n$ | Dimension of the manifold ($n = 3$ for Poincaré) |
| $dV$ | Volume element of the metric $g$ |
| $e^{-f}$ | Exponential weight |

Perelman proved $\mathcal{W}$ is **monotonically non-decreasing** along Ricci flow. This was the key tool for controlling the flow and ruling out certain types of singularities.

---

## ## The Geometrization Conjecture

Perelman actually proved something stronger than the Poincaré Conjecture: **Thurston's Geometrization Conjecture** (1982).

Thurston conjectured that every closed 3-manifold can be cut along tori into pieces, each of which admits one of **eight geometric structures**:

| Geometry                              | Curvature | Example                |
| ------------------------------------- | --------- | ---------------------- |
| $S^3$                                 | Positive  | Lens spaces            |
| $\mathbb{R}^3$                        | Flat      | 3-torus                |
| $H^3$                                 | Negative  | Hyperbolic 3-manifolds |
| $S^2 \times \mathbb{R}$               | Mixed     | $S^2 \times S^1$       |
| $H^2 \times \mathbb{R}$               | Mixed     | Surface bundles        |
| $\widetilde{\text{SL}(2,\mathbb{R})}$ | Mixed     | Seifert fibered spaces |
| Nil                                   | Mixed     | Nilmanifolds           |
| Sol                                   | Mixed     | Solvmanifolds          |

The Poincaré Conjecture follows immediately: a simply connected 3-manifold must have the $S^3$ geometry.

---

## ## History

| Year          | Event                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| **1904**      | Henri Poincaré states the conjecture in a paper on algebraic topology                                                |
| **1934**      | Poincaré dies; the conjecture remains open                                                                           |
| **1960**      | Stephen Smale proves the analogue for $n \geq 5$ (Poincaré conjecture in high dimensions) — Fields Medal 1966        |
| **1982**      | Michael Freedman proves the 4-dimensional case — Fields Medal 1986                                                   |
| **1982**      | Richard Hamilton introduces Ricci flow; proposes it as a tool for geometrization                                     |
| **1982**      | William Thurston states the Geometrization Conjecture — Fields Medal 1982                                            |
| **1986**      | Hamilton proves Ricci flow works for 3-manifolds with positive Ricci curvature                                       |
| **1990s**     | Hamilton develops Ricci flow theory; singularities remain an obstacle                                                |
| **Nov 2002**  | Grigori Perelman posts first paper to arXiv: "The entropy formula for the Ricci flow and its geometric applications" |
| **Mar 2003**  | Perelman posts second paper: "Ricci flow with surgery on three-manifolds"                                            |
| **Jul 2003**  | Perelman posts third paper: "Finite extinction time for the solutions to the Ricci flow on certain three-manifolds"  |
| **2003–2006** | Mathematical community verifies Perelman's proof                                                                     |
| **2006**      | Perelman awarded the Fields Medal — **he declines**                                                                  |
| **2010**      | Clay Mathematics Institute awards Perelman $1,000,000 — **he declines**                                              |
| **2006**      | Cao & Zhu, Kleiner & Lott, Morgan & Tian publish detailed expositions of the proof                                   |

---

## ## Perelman's Refusal

Grigori Perelman declined both the Fields Medal (2006) and the $1,000,000 Clay Prize (2010). His reasons, stated in interviews:

> _"I'm not interested in money or fame. I don't want to be on display like an animal in a zoo."_

He also expressed dissatisfaction with the mathematical community's ethics, particularly regarding credit attribution. He has largely withdrawn from mathematics and public life.

His three arXiv papers — totaling about 68 pages — contain one of the most significant mathematical achievements in history, presented without the usual journal publication process.

---

## ## The Proof in Outline

1. **Start**: Take a closed, simply connected 3-manifold $M$
2. **Equip with metric**: Give $M$ any smooth Riemannian metric $g_0$
3. **Run Ricci flow**: Evolve $g(t)$ by $\partial_t g_{ij} = -2R_{ij}$
4. **Handle singularities**: When singularities form, perform surgery (cut and cap)
5. **Monotonicity**: Use $\mathcal{W}$-entropy to control the flow
6. **Extinction**: Prove the flow becomes extinct in finite time (for simply connected $M$)
7. **Conclusion**: Extinction means $M$ was homeomorphic to $S^3$

---

## ## Status

🟢 **SOLVED** — The only Millennium Prize Problem to be resolved.

- **Proved by**: Grigori Perelman (2002–2003)
- **Method**: Ricci flow with surgery + entropy monotonicity
- **Stronger result**: Thurston's Geometrization Conjecture also proved
- **Prize**: $1,000,000 offered — **declined by Perelman**
- **Fields Medal**: Awarded 2006 — **declined by Perelman**

The proof has been fully verified by the mathematical community. Multiple independent expositions confirm its correctness.

> _"Perelman's proof of the Poincaré Conjecture is one of the great mathematical achievements of our time. It resolved a hundred-year-old problem using ideas of breathtaking originality."_
> — John Morgan

---

## ## Remaining Millennium Problems

The Poincaré Conjecture is the **only** Millennium Prize Problem solved. Six remain open:

- 🔴 [Riemann Hypothesis](riemann_hypothesis.md)
- 🔴 [P vs NP](p_vs_np.md)
- 🔴 [Navier–Stokes](navier_stokes.md)
- 🔴 [Yang–Mills](yang_mills.md)
- 🔴 [Hodge Conjecture](hodge_conjecture.md)
- 🔴 [Birch & Swinnerton-Dyer](birch_swinnerton-dyer.md)

---

_See also: [Index of Millennium Problems](index.md)_
