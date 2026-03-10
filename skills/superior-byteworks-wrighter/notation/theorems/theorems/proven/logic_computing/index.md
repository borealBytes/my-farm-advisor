---
name: Logic and Computing Theorems Index
description: Index of proven theorems in mathematical logic, computability theory, and complexity theory
version: 1.0.0
author: Omni Unified Writing
---

# Logic and Computing Theorems

Foundational theorems in mathematical logic, computability theory, and computational complexity.

---

## ## Mathematical Logic

### Gödel's First Incompleteness Theorem (1931)

**Statement:** Any consistent formal system $F$ that is sufficiently powerful to express basic arithmetic contains a sentence $G_F$ that is true but unprovable within $F$.

**Formal statement:** If $F$ is a consistent, recursively axiomatizable formal system that interprets Robinson arithmetic $Q$, then there exists a sentence $\phi$ such that neither $\phi$ nor $\neg\phi$ is provable in $F$.

**Significance:** Shatters Hilbert's program of finding a complete, consistent axiomatization of mathematics. No sufficiently powerful formal system can prove all true statements about natural numbers.

---

### Gödel's Second Incompleteness Theorem (1931)

**Statement:** No consistent formal system $F$ that is sufficiently powerful to express basic arithmetic can prove its own consistency.

**Formal statement:** If $F$ is consistent and satisfies the Hilbert-Bernays provability conditions, then $F \nvdash \text{Con}(F)$, where $\text{Con}(F)$ is the sentence asserting $F$'s consistency.

**Significance:** A system cannot bootstrap its own trustworthiness. Consistency must be established from outside the system.

---

### Löwenheim-Skolem Theorem (1915, 1920)

**Statement (Downward):** If a first-order theory has an infinite model, it has a countable model.

**Statement (Upward):** If a first-order theory has an infinite model of cardinality $\kappa$, it has a model of every cardinality $\lambda \geq \kappa$.

**Significance:** First-order logic cannot pin down the cardinality of infinite structures. The real numbers, for instance, have a countable first-order model (Skolem's paradox).

---

### Completeness Theorem (Gödel, 1929)

**Statement:** A first-order sentence is provable from a set of axioms $\Gamma$ if and only if it is true in every model of $\Gamma$.

$$\Gamma \vdash \phi \iff \Gamma \models \phi$$

**Significance:** Establishes that first-order logic is complete — syntactic provability and semantic truth coincide. Contrasts with the incompleteness of arithmetic.

---

## ## Computability Theory

### Church-Turing Thesis

**Statement (informal):** Every effectively computable function is computable by a Turing machine.

**Note:** This is a thesis, not a theorem — it cannot be formally proved because "effectively computable" is an informal notion. However, all known models of computation (lambda calculus, recursive functions, RAM machines) are equivalent to Turing machines.

---

### Halting Problem (Turing, 1936)

**Statement:** There is no Turing machine $H$ that, given any Turing machine $M$ and input $w$, correctly decides whether $M$ halts on $w$.

**Proof sketch (diagonalization):** Suppose $H$ exists. Construct $D$: on input $\langle M \rangle$, run $H(\langle M \rangle, \langle M \rangle)$; if $H$ says "halts," loop forever; if $H$ says "loops," halt. Then $D(\langle D \rangle)$ halts iff $D(\langle D \rangle)$ does not halt — contradiction.

**Significance:** The first undecidable problem. Establishes fundamental limits of computation.

---

### Rice's Theorem (1953)

**Statement:** For any non-trivial property $P$ of the language recognized by a Turing machine (i.e., $P$ is true for some TMs and false for others), the problem of deciding whether a given TM has property $P$ is undecidable.

**Significance:** No non-trivial semantic property of programs is decidable. You cannot write a program that correctly determines whether arbitrary programs have any interesting behavioral property.

---

## ## Complexity Theory

### Cook-Levin Theorem (1971, 1973)

**Statement:** SAT (Boolean satisfiability) is NP-complete. That is:

1. SAT $\in$ NP
2. Every problem in NP is polynomial-time reducible to SAT

**Significance:** The first NP-completeness result. Establishes SAT as the canonical hard problem in NP. Thousands of problems have since been shown NP-complete by reduction from SAT.

---

### Time Hierarchy Theorem

**Statement:** For time-constructible functions $f, g$ with $f(n) \log f(n) = o(g(n))$:

$$\text{DTIME}(f(n)) \subsetneq \text{DTIME}(g(n))$$

**Significance:** More time genuinely enables more computation. The complexity hierarchy is strict — there are problems solvable in $O(n^2)$ but not $O(n)$, etc.

---

### Space Hierarchy Theorem

**Statement:** For space-constructible functions $f, g$ with $f(n) = o(g(n))$:

$$\text{DSPACE}(f(n)) \subsetneq \text{DSPACE}(g(n))$$

---

### Savitch's Theorem (1970)

**Statement:** $\text{NSPACE}(f(n)) \subseteq \text{DSPACE}(f(n)^2)$ for $f(n) \geq \log n$.

**Corollary:** PSPACE = NPSPACE.

**Significance:** Nondeterminism provides at most a quadratic savings in space (vs. potentially exponential savings in time).

---

## ## See Also

- [../algebra/](../algebra/) — Algebra theorems
- [../number_theory/](../number_theory/) — Number theory
- [../information_theory/](../information_theory/) — Information theory
- [../../../../math/notation/logic.md](../../../../math/notation/logic.md) — Logic notation reference
- [../../../../math/theorems/millennium/p_vs_np.md](../../../../math/theorems/millennium/p_vs_np.md) — P vs NP (open problem)
