# Chinese Remainder Theorem

## 📋 Theorem Statement

**Existence and Uniqueness:**

Let $n_1, n_2, \ldots, n_k$ be pairwise coprime positive integers (i.e., $\gcd(n_i, n_j) = 1$ for all $i \neq j$). Then for any integers $a_1, a_2, \ldots, a_k$, the system of simultaneous congruences:

$$\begin{cases} x \equiv a_1 \pmod{n_1} \\ x \equiv a_2 \pmod{n_2} \\ \quad \vdots \\ x \equiv a_k \pmod{n_k} \end{cases}$$

has a **unique solution** modulo $N = n_1 n_2 \cdots n_k$:

$$x \equiv \sum_{i=1}^{k} a_i \cdot M_i \cdot (M_i^{-1} \bmod n_i) \pmod{N}$$

where $M_i = N / n_i$ and $M_i^{-1} \bmod n_i$ is the modular inverse of $M_i$ modulo $n_i$.

**Ring isomorphism form:**

$$\mathbb{Z}/N\mathbb{Z} \;\cong\; \mathbb{Z}/n_1\mathbb{Z} \;\times\; \mathbb{Z}/n_2\mathbb{Z} \;\times\; \cdots \;\times\; \mathbb{Z}/n_k\mathbb{Z}$$

---

## 🔣 Symbol Legend

| Symbol                   | Name                     | Meaning                                                                                                  |
| ------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| $x$                      | Unknown                  | The integer we are solving for                                                                           |
| $a_i$                    | Remainders               | The target remainder for each congruence; $a_i$ is the desired remainder modulo $n_i$                    |
| $n_i$                    | Moduli                   | The divisors in each congruence; must be pairwise coprime                                                |
| $\equiv$                 | Congruence               | $x \equiv a \pmod{n}$ means $n$ divides $x - a$; $x$ and $a$ have the same remainder when divided by $n$ |
| $\pmod{n_i}$             | Modulo $n_i$             | Arithmetic of remainders after division by $n_i$                                                         |
| $\gcd(n_i, n_j)$         | Greatest common divisor  | Largest integer dividing both $n_i$ and $n_j$                                                            |
| $\gcd(n_i, n_j) = 1$     | Pairwise coprimality     | $n_i$ and $n_j$ share no common prime factors; essential hypothesis                                      |
| $N = n_1 n_2 \cdots n_k$ | Product of moduli        | The combined modulus; the solution is unique modulo $N$                                                  |
| $M_i = N/n_i$            | Complementary modulus    | The product of all moduli except $n_i$                                                                   |
| $M_i^{-1} \bmod n_i$     | Modular inverse          | The integer $y$ such that $M_i \cdot y \equiv 1 \pmod{n_i}$; exists because $\gcd(M_i, n_i) = 1$         |
| $\sum_{i=1}^{k}$         | Summation                | Sum over all $k$ congruences                                                                             |
| $\mathbb{Z}/N\mathbb{Z}$ | Integers mod $N$         | The ring of residues $\{0, 1, \ldots, N-1\}$ with addition and multiplication mod $N$                    |
| $\cong$                  | Ring isomorphism         | A bijective structure-preserving map; the two rings are algebraically identical                          |
| $\times$                 | Direct product           | The Cartesian product with componentwise operations                                                      |
| $\forall\, i \neq j$     | For all distinct indices | The condition holds for every pair of distinct moduli                                                    |

---

## 💬 Plain English Explanation

The Chinese Remainder Theorem (CRT) solves a puzzle: **given several different "clock" systems, find a number that shows a specific time on each clock simultaneously.**

Imagine three clocks:

- Clock A has 3 positions (mod 3): you want it to show **2**
- Clock B has 5 positions (mod 5): you want it to show **3**
- Clock C has 7 positions (mod 7): you want it to show **2**

CRT guarantees: **there is exactly one number between 0 and $3 \times 5 \times 7 = 105$ that satisfies all three conditions at once.** (Answer: $x = 23$.)

The key requirement is that the moduli (3, 5, 7) must be **pairwise coprime** — no two share a common factor. When this holds, the different "clock systems" are independent, and you can always find a unique combined solution.

The theorem also says something deeper: working modulo $N = n_1 n_2 \cdots n_k$ is _exactly the same_ as working in all the smaller systems simultaneously. This is the ring isomorphism statement.

---

## 📖 History

| Year            | Event                                                                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ~3rd century CE | **Sun Tzu** (_Sunzi Suanjing_, "Mathematical Classic of Sun Tzu") poses the problem: "Find a number that leaves remainder 2 when divided by 3, remainder 3 when divided by 5, remainder 2 when divided by 7" |
| ~5th century CE | Chinese mathematician **Zu Chongzhi** uses similar methods                                                                                                                                                   |
| 1247 CE         | **Qin Jiushao** (_Shushu Jiuzhang_) gives a complete algorithm — the **Dayan method** — for solving simultaneous congruences                                                                                 |
| 1801            | Carl Friedrich Gauss proves the theorem in full generality in _Disquisitiones Arithmeticae_                                                                                                                  |
| 1852            | The theorem is named "Chinese Remainder Theorem" by Western mathematicians                                                                                                                                   |
| 20th century    | CRT becomes fundamental in **abstract algebra** (ring theory) and **computational number theory**                                                                                                            |
| 1977–present    | CRT is incorporated into RSA, multi-prime RSA, and numerous cryptographic protocols                                                                                                                          |

---

## 🌍 Real-World Significance

### Cryptography — RSA Speedup (CRT-RSA)

CRT dramatically speeds up RSA decryption. Instead of computing $m \equiv c^d \pmod{n}$ directly (slow for large $n = pq$), compute:
$$m_p \equiv c^{d_p} \pmod{p}, \quad m_q \equiv c^{d_q} \pmod{q}$$
where $d_p = d \bmod (p-1)$ and $d_q = d \bmod (q-1)$, then combine via CRT.

**Speedup**: ~4× faster than direct computation. Used in virtually all RSA implementations (OpenSSL, Java, .NET).

### Secret Sharing (Asmuth-Bloom Scheme)

CRT enables **threshold secret sharing**: split a secret $S$ into $k$ shares using $k$ coprime moduli. Any $t$ shares reconstruct $S$ via CRT; fewer than $t$ shares reveal nothing.

### Parallel Computation

Large integer arithmetic can be parallelized: represent a big number as its residues modulo several small primes, compute in parallel, then reconstruct via CRT. Used in:

- Computer algebra systems (Mathematica, Maple, SageMath)
- Polynomial multiplication (NTT — Number Theoretic Transform)
- Cryptographic multi-party computation

### Calendar and Scheduling

The **Metonic cycle** (19 years), **Julian period** (7980 years), and similar astronomical cycles are computed using CRT-like reasoning about simultaneous periodicities.

### Error-Correcting Codes

CRT underlies certain algebraic error-correcting codes and is used in **residue number systems** (RNS) for fault-tolerant computing.

---

## 🔢 Examples

**Example 1 — Sun Tzu's original problem:**

$$\begin{cases} x \equiv 2 \pmod{3} \\ x \equiv 3 \pmod{5} \\ x \equiv 2 \pmod{7} \end{cases}$$

$N = 3 \times 5 \times 7 = 105$

$M_1 = 35,\; M_2 = 21,\; M_3 = 15$

Modular inverses: $35^{-1} \equiv 2 \pmod{3}$, $21^{-1} \equiv 1 \pmod{5}$, $15^{-1} \equiv 1 \pmod{7}$

$$x \equiv 2 \cdot 35 \cdot 2 + 3 \cdot 21 \cdot 1 + 2 \cdot 15 \cdot 1 = 140 + 63 + 30 = 233 \equiv 23 \pmod{105}$$

**Verification**: $23 = 7 \times 3 + 2$ ✓, $23 = 4 \times 5 + 3$ ✓, $23 = 3 \times 7 + 2$ ✓

**Example 2 — Two congruences:**

$$\begin{cases} x \equiv 1 \pmod{4} \\ x \equiv 3 \pmod{5} \end{cases}$$

$N = 20$, $M_1 = 5$, $M_2 = 4$

$5^{-1} \equiv 1 \pmod{4}$ (since $5 \equiv 1$), $4^{-1} \equiv 4 \pmod{5}$ (since $4 \times 4 = 16 \equiv 1$)

$x \equiv 1 \cdot 5 \cdot 1 + 3 \cdot 4 \cdot 4 = 5 + 48 = 53 \equiv 13 \pmod{20}$

**Verification**: $13 = 3 \times 4 + 1$ ✓, $13 = 2 \times 5 + 3$ ✓

**Example 3 — Why coprimality is necessary:**

$$\begin{cases} x \equiv 1 \pmod{4} \\ x \equiv 2 \pmod{6} \end{cases}$$

$\gcd(4, 6) = 2 \neq 1$. The system has **no solution**: $x \equiv 1 \pmod{4}$ means $x$ is odd, but $x \equiv 2 \pmod{6}$ means $x$ is even. Contradiction.

---

## ⚙️ Proof Sketch

**Existence:** Construct the solution explicitly.

For each $i$, let $M_i = N/n_i$. Since $\gcd(n_i, n_j) = 1$ for $i \neq j$, we have $\gcd(M_i, n_i) = 1$, so the modular inverse $y_i = M_i^{-1} \bmod n_i$ exists.

Define:
$$x_0 = \sum_{i=1}^{k} a_i M_i y_i$$

For each $j$: when $i \neq j$, $n_j \mid M_i$ (since $n_j$ is a factor of $M_i$), so $a_i M_i y_i \equiv 0 \pmod{n_j}$. The $j$th term gives $a_j M_j y_j \equiv a_j \cdot 1 = a_j \pmod{n_j}$.

Therefore $x_0 \equiv a_j \pmod{n_j}$ for all $j$. ✓

**Uniqueness:** If $x$ and $x'$ both satisfy the system, then $n_i \mid (x - x')$ for all $i$. Since the $n_i$ are pairwise coprime, $N = \prod n_i$ divides $x - x'$, so $x \equiv x' \pmod{N}$. ✓

**Ring isomorphism:** The map $\phi: \mathbb{Z}/N\mathbb{Z} \to \prod \mathbb{Z}/n_i\mathbb{Z}$ defined by $\phi([x]_N) = ([x]_{n_1}, \ldots, [x]_{n_k})$ is a ring homomorphism. Existence gives surjectivity; uniqueness gives injectivity. Since both rings have the same finite size $N$, $\phi$ is an isomorphism. $\blacksquare$

---

## 🖥️ Lean 4 Status

**Status**: `formalized` — fully available in Mathlib4

```lean
-- Mathlib4: Mathlib.Data.Int.ModCast, Mathlib.RingTheory.Int.Basic

-- Ring isomorphism form (the algebraic CRT):
theorem Int.chineseRemainder {m n : ℤ} (h : IsCoprime m n) :
    ZMod (m * n).natAbs ≃+* ZMod m.natAbs × ZMod n.natAbs :=
  -- Available as ZMod.chineseRemainder in Mathlib

-- Constructive solution:
-- Mathlib.Data.Int.GCD provides:
-- Int.chineseRemainder' : pairwise coprime moduli → unique solution

-- Example usage:
example : ∃ x : ZMod 105, x = 23 ∧
    (x : ZMod 3) = 2 ∧ (x : ZMod 5) = 3 ∧ (x : ZMod 7) = 2 := by
  exact ⟨23, rfl, rfl, rfl, rfl⟩

-- General CRT for lists of moduli:
-- Mathlib.RingTheory.Ideal.Quotient provides
-- Ideal.quotientInfRingEquivPiQuotient for the general case
```

**Mathlib coverage**:

- ✅ `ZMod.chineseRemainder` — two-modulus ring isomorphism
- ✅ `IsCoprime` — coprimality predicate
- ✅ `Int.chineseRemainder` — integer version
- ✅ General $k$-modulus version via ideal theory
- ✅ Constructive algorithm for finding $x$

---

_Theorem class: Elementary Number Theory / Ring Theory | Difficulty: Undergraduate | Status: Proven (Qin Jiushao, 1247; Gauss, 1801)_
