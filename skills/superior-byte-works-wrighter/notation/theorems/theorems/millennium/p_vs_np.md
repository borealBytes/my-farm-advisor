# P vs NP Problem

> **Status**: 🔴 UNSOLVED — Open since 1971
> **Prize**: $1,000,000 (Clay Mathematics Institute)
> **Field**: Computational Complexity Theory, Computer Science, Mathematics

---

## ## Plain English Statement

Imagine two tasks:

- **Solving a Sudoku puzzle** — finding the solution from scratch
- **Checking a Sudoku solution** — verifying that a given solution is correct

Checking is obviously easy. But is _solving_ just as easy? Intuitively, no — solving seems much harder. The P vs NP problem asks whether this intuition is actually true, for _all_ problems of this type.

More precisely:

- **P** (Polynomial time): Problems that can be **solved** quickly by a computer. "Quickly" means in time proportional to some polynomial in the input size — $n^2$, $n^3$, etc.
- **NP** (Nondeterministic Polynomial time): Problems whose solutions can be **verified** quickly. Given a candidate answer, you can check it in polynomial time.

Clearly $\text{P} \subseteq \text{NP}$ — if you can solve something quickly, you can certainly verify it quickly. The question is whether the reverse holds:

**Does $\text{P} = \text{NP}$?**

If yes: every problem whose solution is easy to check is also easy to solve. Cryptography would collapse. Drug discovery, logistics, AI — all would be revolutionized.

If no (the expected answer): there exist problems that are easy to verify but fundamentally hard to solve. This is the world we appear to live in.

No one has proven either answer.

---

## ## Formal Statement

**Definition (Complexity Class P)**:

$$\text{P} = \bigcup_{k \geq 1} \text{DTIME}(n^k)$$

The class of decision problems solvable by a deterministic Turing machine in time $O(n^k)$ for some constant $k$.

**Definition (Complexity Class NP)**:

$$\text{NP} = \bigcup_{k \geq 1} \text{NTIME}(n^k)$$

Equivalently, $L \in \text{NP}$ if and only if there exists a polynomial-time verifier $V$ and polynomial $p$ such that:

$$x \in L \iff \exists w \in \{0,1\}^{p(|x|)} : V(x, w) = 1$$

**The P vs NP Question**:

$$\boxed{\text{P} \stackrel{?}{=} \text{NP}}$$

---

## ## Full Legend

| Symbol               | Meaning                                                           |
| -------------------- | ----------------------------------------------------------------- | --- | -------------------- |
| $\text{P}$           | Class of problems solvable in polynomial time (deterministic)     |
| $\text{NP}$          | Class of problems verifiable in polynomial time                   |
| $\text{co-NP}$       | Complement class: problems whose "no" instances have short proofs |
| $\text{PSPACE}$      | Problems solvable in polynomial _space_                           |
| $\text{EXP}$         | Problems solvable in exponential time                             |
| $\text{DTIME}(f(n))$ | Problems solvable by a deterministic TM in time $O(f(n))$         |
| $\text{NTIME}(f(n))$ | Problems solvable by a nondeterministic TM in time $O(f(n))$      |
| $n$                  | Size of the input (number of bits)                                |
| $k$                  | A fixed positive integer (the polynomial degree)                  |
| $L$                  | A formal language (set of strings encoding problem instances)     |
| $x$                  | An input string (problem instance)                                |
| $w$                  | A witness or certificate (proposed solution)                      |
| $V(x, w)$            | Verifier: outputs 1 if $w$ is a valid solution for $x$            |
| $p(\cdot)$           | A polynomial bounding the length of witnesses                     |
| $                    | x                                                                 | $   | Length of string $x$ |
| $\{0,1\}^*$          | Set of all binary strings                                         |
| $\subseteq$          | Subset relation                                                   |
| $\stackrel{?}{=}$    | Equality that is conjectured but unproven                         |

---

## ## NP-Completeness

The concept of **NP-completeness** is central to P vs NP.

**Definition**: A problem $L$ is **NP-hard** if every problem in NP reduces to $L$ in polynomial time:

$$\forall L' \in \text{NP}: L' \leq_p L$$

**Definition**: $L$ is **NP-complete** if $L \in \text{NP}$ and $L$ is NP-hard.

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $L' \leq_p L$ | $L'$ polynomial-time many-one reduces to $L$ |
| $f: \{0,1\}^* \to \{0,1\}^*$ | The reduction function (computable in polynomial time) |
| $x \in L' \iff f(x) \in L$ | The reduction preserves membership |

**Cook–Levin Theorem (1971)**: **SAT** (Boolean satisfiability) is NP-complete.

$$\text{SAT} = \{\langle \phi \rangle : \phi \text{ is a satisfiable Boolean formula}\}$$

If _any_ NP-complete problem is in P, then $\text{P} = \text{NP}$.

---

## ## The Complexity Hierarchy

The known relationships between complexity classes:

$$\text{P} \subseteq \text{NP} \subseteq \text{PSPACE} \subseteq \text{EXP}$$

It is known that $\text{P} \subsetneq \text{EXP}$ (strict containment, by the time hierarchy theorem). Therefore, at least one of the inclusions above is strict. But we don't know which.

The two possible worlds:

**If $\text{P} = \text{NP}$**:
$$\text{P} = \text{NP} = \text{co-NP}$$

**If $\text{P} \neq \text{NP}$** (expected):
$$\text{P} \subsetneq \text{NP}, \quad \text{NP} \neq \text{co-NP} \text{ (likely)}$$

---

## ## Famous NP-Complete Problems

These are all equivalent in difficulty — solving any one in polynomial time solves all:

| Problem                           | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| **SAT**                           | Is a Boolean formula satisfiable?               |
| **3-SAT**                         | SAT restricted to clauses of size 3             |
| **Traveling Salesman (decision)** | Is there a tour of length $\leq k$?             |
| **Graph Coloring**                | Can a graph be colored with $k$ colors?         |
| **Subset Sum**                    | Does a subset sum to exactly $T$?               |
| **Clique**                        | Does a graph contain a clique of size $k$?      |
| **Hamiltonian Path**              | Does a graph have a Hamiltonian path?           |
| **Integer Programming**           | Does an integer linear program have a solution? |

---

## ## Why It's Hard

### We can't prove lower bounds

To show $\text{P} \neq \text{NP}$, we need to prove that some NP problem requires superpolynomial time. But we have almost no techniques for proving _lower bounds_ on computation time. The best known lower bound for SAT is barely above linear.

### Relativization barrier (Baker–Gill–Solovay, 1975)

For any oracle $A$, there exist oracles $B, C$ such that $\text{P}^B = \text{NP}^B$ and $\text{P}^C \neq \text{NP}^C$. This means any proof technique that "relativizes" (works the same with oracles) cannot resolve P vs NP. Most known proof techniques relativize.

### Natural proofs barrier (Razborov–Rudich, 1994)

A large class of "natural" proof strategies cannot separate P from NP, assuming cryptographic pseudorandom generators exist.

### Algebrization barrier (Aaronson–Wigderson, 2009)

Even algebraic extensions of relativization cannot resolve P vs NP.

These three barriers rule out most known mathematical techniques. A proof would require genuinely new ideas.

### The problem is self-referential

A proof that $\text{P} \neq \text{NP}$ would itself be a mathematical proof — and verifying mathematical proofs is in NP. This creates subtle self-referential complications.

---

## ## Consequences of $\text{P} = \text{NP}$

If someone proved $\text{P} = \text{NP}$ (even non-constructively):

**Cryptography collapses**: RSA, elliptic curve cryptography, and most public-key systems rely on NP-hard problems. All would be broken.

**Mathematics is automated**: Finding proofs is in NP (given a proof, you can verify it). So finding proofs would be in P — a computer could prove any theorem with a short proof.

**Drug discovery**: Protein folding and molecular docking are NP-hard. Optimal drugs could be designed efficiently.

**Optimization**: Scheduling, routing, resource allocation — all solved optimally.

**AI**: Many machine learning problems are NP-hard. Optimal learning would become tractable.

---

## ## History

| Year     | Event                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------- |
| **1936** | Turing defines the Turing machine; Church–Turing thesis formulated                                |
| **1965** | Cobham and Edmonds independently propose polynomial time as the notion of "efficient" computation |
| **1971** | Stephen Cook proves SAT is NP-complete (Cook's theorem)                                           |
| **1972** | Richard Karp shows 21 combinatorial problems are NP-complete                                      |
| **1972** | Leonid Levin independently develops NP-completeness in the USSR                                   |
| **1975** | Baker, Gill, Solovay prove the relativization barrier                                             |
| **1979** | Garey & Johnson publish _Computers and Intractability_, cataloguing NP-complete problems          |
| **1994** | Razborov & Rudich prove the natural proofs barrier                                                |
| **2000** | Clay Mathematics Institute designates P vs NP a Millennium Prize Problem                          |
| **2009** | Aaronson & Wigderson prove the algebrization barrier                                              |
| **2010** | Vinay Deolalikar claims a proof of $\text{P} \neq \text{NP}$ — quickly found to be flawed         |
| **2026** | Still unsolved. Consensus: $\text{P} \neq \text{NP}$, but unproven                                |

---

## ## Expert Opinion

A 2012 survey of complexity theorists found:

- **83%** believe $\text{P} \neq \text{NP}$
- **9%** believe $\text{P} = \text{NP}$
- **8%** unsure or believe the question is independent of standard axioms

The problem may be **independent of ZFC** (the standard axioms of mathematics) — meaning it could be true but unprovable, like the Continuum Hypothesis. This is a minority view but taken seriously.

---

## ## Current Status

🔴 **UNSOLVED**

- No proof or disproof exists
- Three major barriers (relativization, natural proofs, algebrization) rule out most known techniques
- Considered by many the most important open problem in computer science
- Prize: **$1,000,000** from the Clay Mathematics Institute

> _"If P = NP, then the world would be a profoundly different place than we usually assume it to be. There would be no special value in 'creative leaps,' no fundamental gap between solving a problem and recognizing the solution once it's found."_
> — Scott Aaronson

---

_See also: [Index of Millennium Problems](index.md) · [Riemann Hypothesis](riemann_hypothesis.md)_
