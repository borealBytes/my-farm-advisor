# Fundamental Theorem of Arithmetic

## ## LaTeX Statement

Every integer greater than 1 has a unique prime factorization:

$$\forall\, n \in \mathbb{Z},\; n > 1 : \exists!\; p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k} \text{ with } p_1 < p_2 < \cdots < p_k \text{ prime},\; e_i \in \mathbb{Z}^+ \text{ such that } n = \prod_{i=1}^{k} p_i^{e_i}$$

More precisely, the theorem asserts both **existence** and **uniqueness**:

$$\textbf{Existence:}\quad \forall\, n \in \mathbb{Z},\; n > 1 : \exists \text{ primes } p_1 \leq p_2 \leq \cdots \leq p_r \text{ such that } n = p_1 \cdot p_2 \cdots p_r$$

$$\textbf{Uniqueness:}\quad \text{If } n = p_1 \cdots p_r = q_1 \cdots q_s \text{ (primes)}, \text{ then } r = s \text{ and } p_i = q_i \text{ for all } i$$

---

## ## Legend

| Symbol                  | Pronunciation                   | Meaning                                                                                    |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------------------------ |
| $\forall$               | "for all"                       | Universal quantifier — the theorem applies to every integer greater than 1                 |
| $n$                     | "n"                             | A positive integer greater than 1 — the number being factored                              |
| $\in$                   | "in" or "element of"            | Set membership                                                                             |
| $\mathbb{Z}$            | "Z" or "the integers"           | The set $\{\ldots, -2, -1, 0, 1, 2, \ldots\}$ of all integers                              |
| $\mathbb{Z}^+$          | "Z plus" or "positive integers" | The set $\{1, 2, 3, \ldots\}$ of positive integers                                         |
| $\mathbb{N}$            | "N" or "natural numbers"        | The set $\{0, 1, 2, 3, \ldots\}$ (sometimes $\{1, 2, 3, \ldots\}$ depending on convention) |
| $>$                     | "greater than"                  | Strict inequality; $n > 1$ excludes 0 and 1 from the theorem                               |
| $:$                     | "such that"                     | Introduces the conclusion                                                                  |
| $\exists!$              | "there exists a unique"         | Existential quantifier with uniqueness — exactly one such object exists                    |
| $p_1, p_2, \ldots, p_k$ | "p-one, p-two, ..., p-k"        | Distinct prime numbers, listed in strictly increasing order                                |
| $<$                     | "less than"                     | Strict ordering; $p_1 < p_2 < \cdots < p_k$ means the primes are distinct and sorted       |
| $\text{prime}$          | "prime"                         | A positive integer $p > 1$ whose only positive divisors are 1 and $p$ itself               |
| $e_1, e_2, \ldots, e_k$ | "e-one, e-two, ..., e-k"        | Positive integer exponents — how many times each prime appears                             |
| $p_i^{e_i}$             | "p-i to the e-i"                | The prime $p_i$ raised to the power $e_i$                                                  |
| $\prod_{i=1}^{k}$       | "product from i equals 1 to k"  | Multiply together all terms as $i$ runs from 1 to $k$                                      |
| $\cdot$                 | "times"                         | Multiplication                                                                             |
| $\gcd(a, b)$            | "gcd of a and b"                | Greatest common divisor — the largest integer dividing both $a$ and $b$                    |
| $\text{lcm}(a, b)$      | "lcm of a and b"                | Least common multiple — the smallest positive integer divisible by both $a$ and $b$        |
| $\mid$                  | "divides"                       | $a \mid b$ means $b = ka$ for some integer $k$                                             |

### What Is a Prime Number?

A **prime** $p$ is an integer $p > 1$ such that its only positive divisors are 1 and $p$. The first few primes are:

$$2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, \ldots$$

The number 1 is **not** prime by convention — if it were, unique factorization would fail (e.g., $6 = 2 \times 3 = 1 \times 2 \times 3 = 1^{100} \times 2 \times 3$).

---

## ## Plain English Explanation

Every whole number bigger than 1 can be broken down into prime factors, and there is only one way to do it (if you ignore the order of the factors).

Think of primes as the "atoms" of arithmetic. Just as every molecule is built from atoms, every integer is built from primes. The Fundamental Theorem of Arithmetic says:

1. **Every integer can be built** from primes (existence)
2. **The recipe is unique** — no integer can be built from two different sets of prime atoms (uniqueness)

For example, $360 = 2^3 \times 3^2 \times 5$. No matter how you factor 360, you will always end up with exactly three 2's, two 3's, and one 5. You cannot get $360 = 2^2 \times 3^3 \times 5$ or any other combination.

The uniqueness part is the deep result. Existence is easy to prove (just keep dividing by the smallest prime factor). Uniqueness requires **Euclid's Lemma**: if a prime $p$ divides a product $ab$, then $p$ divides $a$ or $p$ divides $b$ (or both). This is the key property that distinguishes primes from composite numbers.

---

## ## Real-World Significance

**Cryptography — RSA Encryption**
The RSA algorithm, which secures most internet traffic (HTTPS, banking, email), relies on the fact that multiplying two large primes is easy, but factoring their product back into primes is computationally infeasible. The theorem guarantees that the factorization is unique — there is no ambiguity about which primes were used. A 2048-bit RSA key involves primes with ~300 decimal digits.

**Number Theory — Multiplicative Functions**
Functions like Euler's totient $\phi(n)$ (counting integers coprime to $n$), the divisor function $\sigma(n)$ (sum of divisors), and the Möbius function $\mu(n)$ are all defined in terms of prime factorizations. The theorem makes these functions well-defined and computable.

**Computer Science — Hashing and Data Structures**
Many hash functions use prime numbers to minimize collisions. The Chinese Remainder Theorem (which enables efficient modular arithmetic) relies on unique factorization. Polynomial hashing, used in string matching algorithms, exploits prime properties.

**Error-Correcting Codes**
Reed-Solomon codes (used in CDs, DVDs, QR codes, and deep-space communication) operate in finite fields $\mathbb{F}_{p^n}$ where $p$ is prime. The structure of these fields depends on unique factorization in polynomial rings, which mirrors the theorem.

**Music Theory — Just Intonation**
Musical intervals are ratios of frequencies. The prime factorization of these ratios determines the "complexity" of an interval. The perfect fifth (3:2), major third (5:4), and minor seventh (7:4) involve primes 2, 3, 5, 7. Unique factorization explains why these intervals cannot be combined to form a perfect octave (the "comma problem").

**Chemistry — Molecular Formulas**
Chemical formulas like $\text{H}_2\text{O}$ or $\text{C}_6\text{H}_{12}\text{O}_6$ are analogous to prime factorizations: each element is a "prime," and the subscripts are "exponents." The uniqueness of molecular formulas mirrors the uniqueness of prime factorizations.

---

## ## History

**Euclid's Elements (~300 BCE)**
Euclid proved the existence of prime factorization in _Elements_ Book VII (Propositions 30–32) and Book IX (Proposition 14). Proposition VII.30 is essentially Euclid's Lemma: if a prime divides a product, it divides one of the factors. Proposition IX.14 states that if a number is the least divisible by certain primes, no other prime can divide it — a form of uniqueness. However, Euclid did not state the theorem in its modern form.

**Gauss's Disquisitiones Arithmeticae (1801)**
Carl Friedrich Gauss (1777–1855) gave the first clear, explicit statement and proof of both existence and uniqueness in his landmark _Disquisitiones Arithmeticae_ (Arithmetic Investigations). Gauss recognized this as the cornerstone of number theory and called it "fundamental." He was 24 years old when he published this work.

**Failure of Unique Factorization (19th century)**
Mathematicians discovered that unique factorization fails in certain generalizations of the integers. In the ring $\mathbb{Z}[\sqrt{-5}] = \{a + b\sqrt{-5} \mid a, b \in \mathbb{Z}\}$, the number 6 factors in two distinct ways:

$$6 = 2 \times 3 = (1 + \sqrt{-5})(1 - \sqrt{-5})$$

None of $2, 3, 1 \pm \sqrt{-5}$ can be factored further in this ring, yet the factorizations are different. This failure motivated Ernst Kummer (1810–1893) to invent "ideal numbers" and Richard Dedekind (1831–1916) to develop ideal theory — the foundation of modern algebraic number theory.

**Modern Algebraic Context**
Rings where unique factorization holds are called **Unique Factorization Domains (UFDs)**. The integers $\mathbb{Z}$, polynomial rings $k[x]$ over a field, and the Gaussian integers $\mathbb{Z}[i]$ are UFDs. The theorem is now understood as a special property of $\mathbb{Z}$, not a universal truth about all number systems.

---

## ## Examples

### Example 1: Factoring a Small Number

Factor $84$:

$$84 = 2 \times 42 = 2 \times 2 \times 21 = 2 \times 2 \times 3 \times 7 = 2^2 \times 3^1 \times 7^1$$

Prime factorization: $84 = 2^2 \cdot 3 \cdot 7$

Primes: $p_1 = 2$, $p_2 = 3$, $p_3 = 7$; Exponents: $e_1 = 2$, $e_2 = 1$, $e_3 = 1$.

---

### Example 2: A Prime Number

Factor $97$:

Since 97 is prime (not divisible by 2, 3, 5, 7 — and $\sqrt{97} < 10$), its factorization is:

$$97 = 97^1$$

Here $k = 1$, $p_1 = 97$, $e_1 = 1$.

---

### Example 3: A Highly Composite Number

Factor $720$:

$$720 = 72 \times 10 = 8 \times 9 \times 10 = 2^3 \times 3^2 \times 2 \times 5 = 2^4 \times 3^2 \times 5$$

Prime factorization: $720 = 2^4 \cdot 3^2 \cdot 5$

Number of divisors: $(4+1)(2+1)(1+1) = 30$ divisors.

---

### Example 4: Computing GCD via Factorization

Find $\gcd(360, 504)$:

$$360 = 2^3 \times 3^2 \times 5$$
$$504 = 2^3 \times 3^2 \times 7$$

The GCD takes the **minimum** exponent for each prime appearing in both:

$$\gcd(360, 504) = 2^{\min(3,3)} \times 3^{\min(2,2)} = 2^3 \times 3^2 = 8 \times 9 = 72$$

---

### Example 5: Computing LCM via Factorization

Find $\text{lcm}(360, 504)$:

The LCM takes the **maximum** exponent for each prime appearing in either:

$$\text{lcm}(360, 504) = 2^{\max(3,3)} \times 3^{\max(2,2)} \times 5^{\max(1,0)} \times 7^{\max(0,1)} = 2^3 \times 3^2 \times 5 \times 7 = 2520$$

Verification: $\gcd \times \text{lcm} = 72 \times 2520 = 181440 = 360 \times 504$ ✓

---

### Example 6: Perfect Power Test

Is $1764$ a perfect square?

$$1764 = 4 \times 441 = 2^2 \times 21^2 = 2^2 \times (3 \times 7)^2 = 2^2 \times 3^2 \times 7^2$$

All exponents are even (2, 2, 2), so yes:

$$1764 = (2 \times 3 \times 7)^2 = 42^2$$

A number is a perfect square if and only if all exponents in its prime factorization are even.

---

### Example 7: Euclid's Lemma in Action

Claim: If $7 \mid 3n$, then $7 \mid n$.

Since $\gcd(7, 3) = 1$ (7 and 3 share no prime factors), Euclid's Lemma says $7 \mid n$.

This is the key step in proving uniqueness: if $p$ is prime and $p \mid p_1 p_2 \cdots p_r$ (a product of primes), then $p = p_i$ for some $i$.

---

## ## Lean Status

**Status**: Proven in Lean 4 (Mathlib)

The Fundamental Theorem of Arithmetic is fully formalized in Lean 4's `mathlib4`:

```lean4
import Mathlib.Data.Nat.Factors
import Mathlib.Data.Nat.Prime.Basic

-- Every natural number > 1 has a prime factorization
-- `Nat.factors` returns the sorted list of prime factors with repetition
-- e.g., Nat.factors 12 = [2, 2, 3]
#eval Nat.factors 360  -- [2, 2, 2, 3, 3, 5]

-- The product of the factors equals the original number
theorem Nat.factors_prod {n : ℕ} (hn : n ≠ 0) :
    (Nat.factors n).prod = n :=
  Nat.factors_prod hn

-- All elements of the factor list are prime
theorem Nat.prime_of_mem_factors {n p : ℕ} (h : p ∈ n.factors) :
    p.Prime :=
  (Nat.mem_factors.mp h).1

-- Uniqueness: the factorization is unique (as a multiset)
-- This is encoded by the fact that `Nat.factors` is a function (deterministic)
-- and `Nat.factors_unique` in Mathlib:
theorem Nat.factors_unique {n : ℕ} {l : List ℕ}
    (hl : ∀ p ∈ l, Nat.Prime p) (hn : l.prod = n) :
    l.mergeSort (· ≤ ·) = n.factors :=
  Nat.factors_unique hl hn

-- Euclid's Lemma: the key to uniqueness
theorem Nat.Prime.dvd_mul {p m n : ℕ} (hp : p.Prime) :
    p ∣ m * n ↔ p ∣ m ∨ p ∣ n :=
  hp.dvd_mul
```

**Mathlib Location**: `Mathlib.Data.Nat.Factors`, `Mathlib.Data.Nat.Prime.Basic`

**Proof Approach**: The Lean proof has two parts:

1. **Existence** (by strong induction):
   - If $n$ is prime, done: $n = n^1$
   - If $n$ is composite, write $n = ab$ with $1 < a, b < n$
   - By induction hypothesis, $a$ and $b$ have prime factorizations
   - Concatenate them to get a factorization of $n$

2. **Uniqueness** (using Euclid's Lemma):
   - Suppose $p_1 \cdots p_r = q_1 \cdots q_s$ (two prime factorizations)
   - Since $p_1$ divides the left side, it divides the right side
   - By Euclid's Lemma applied repeatedly, $p_1 = q_j$ for some $j$
   - Cancel $p_1 = q_j$ from both sides and repeat by induction on $r$

**Verification Level**: Complete — all relevant lemmas in Mathlib have no `sorry`. The theorem is considered one of the foundational results of Mathlib's number theory library.
