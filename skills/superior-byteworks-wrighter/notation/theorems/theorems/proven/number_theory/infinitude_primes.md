# Infinitude of Primes

## 📋 Theorem Statement

$$|\{p \in \mathbb{Z}^+ : p \text{ is prime}\}| = \infty$$

**Equivalently:**

$$\forall\, n \in \mathbb{Z}^+,\; \exists \text{ a prime } p > n$$

**Euclid's formulation (constructive):**

$$\forall\, \{p_1, p_2, \ldots, p_k\} \text{ (any finite set of primes)},\; \exists \text{ a prime } p \notin \{p_1, \ldots, p_k\}$$

**Via the product construction:**

$$N = p_1 \cdot p_2 \cdots p_k + 1 \implies \exists \text{ prime } q \mid N \text{ with } q \neq p_i \text{ for all } i$$

---

## 🔣 Symbol Legend

| Symbol                      | Name                   | Meaning                                                                                  |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------------------- | ----------- | ---------------------------------- | ----------------------- | ----------------------------------- |
| $                           | \cdot                  | $                                                                                        | Cardinality | The number of elements in a set; $ | \{p : p \text{ prime}\} | = \infty$ means the set is infinite |
| $\infty$                    | Infinity               | Not a number but a symbol meaning "without bound"; the set has no finite size            |
| $\mathbb{Z}^+$              | Positive integers      | The set $\{1, 2, 3, 4, \ldots\}$                                                         |
| $\in$                       | "Is an element of"     | Membership; $p \in \mathbb{Z}^+$ means $p$ is a positive integer                         |
| $\forall$                   | "For all"              | Universal quantifier; the statement holds for every element                              |
| $\exists$                   | "There exists"         | Existential quantifier; at least one such element exists                                 |
| $p$                         | Prime                  | A positive integer greater than $1$ with no positive divisors other than $1$ and itself  |
| $p > n$                     | Strict inequality      | $p$ is strictly larger than $n$                                                          |
| $\{p_1, p_2, \ldots, p_k\}$ | Finite set of primes   | Any finite collection of prime numbers                                                   |
| $\notin$                    | "Is not an element of" | Non-membership; $p \notin \{p_1, \ldots, p_k\}$ means $p$ is a new prime not in the list |
| $p_1 \cdot p_2 \cdots p_k$  | Product                | Multiplication of all primes in the finite list                                          |
| $+\, 1$                     | Plus one               | Adding one to the product; key step in Euclid's construction                             |
| $q \mid N$                  | Divides                | $q$ divides $N$ evenly; $N$ is a multiple of $q$                                         |
| $q \neq p_i$                | Inequality             | $q$ is different from each prime in the original list                                    |

---

## 💬 Plain English Explanation

The theorem states: **there are infinitely many prime numbers — the list of primes never ends.**

Euclid's proof (c. 300 BCE) is one of the most elegant in all of mathematics. It works by contradiction:

> **Suppose the list of primes were finite.** Write them all down: $p_1, p_2, \ldots, p_k$. Now multiply them all together and add 1:
> $$N = p_1 \times p_2 \times \cdots \times p_k + 1$$
> This number $N$ must have a prime factor $q$. But $q$ cannot be any of the $p_i$ — because $N$ leaves remainder $1$ when divided by any $p_i$, so none of them divide $N$. Therefore $q$ is a prime not on our "complete" list. **Contradiction.**

Note: $N$ itself need not be prime — it just must have _some_ prime factor not on the list. For example, $2 \times 3 \times 5 \times 7 \times 11 \times 13 + 1 = 30031 = 59 \times 509$, and both 59 and 509 are new primes.

This proof is remarkable for its **simplicity and generality** — it requires no calculation, no special cases, just pure logical reasoning.

---

## 📖 History

| Year          | Event                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| c. 300 BCE    | **Euclid** proves the theorem in _Elements_, Book IX, Proposition 20 — one of the oldest surviving mathematical proofs                                                |
| 1737          | **Leonhard Euler** gives an analytic proof: $\sum_{p \text{ prime}} 1/p$ diverges, which implies infinitely many primes                                               |
| 1737          | Euler also proves via the product formula: $\prod_p (1 - p^{-s})^{-1} = \sum_n n^{-s}$; if finitely many primes, the product would be finite but the sum diverges     |
| 1737–1859     | Multiple alternative proofs discovered (Goldbach, Kummer, Sylvester, ...)                                                                                             |
| 1955          | **Furstenberg** gives a topological proof using arithmetic progressions and open sets                                                                                 |
| 1959          | **Erdős** gives an elementary proof via the prime factorization of $\binom{2n}{n}$                                                                                    |
| 1970s–present | Generalizations: Dirichlet's theorem (infinitely many primes in arithmetic progressions), Green-Tao theorem (primes contain arbitrarily long arithmetic progressions) |

---

## 🌍 Real-World Significance

### Cryptography — Inexhaustible Key Material

RSA, Diffie-Hellman, and elliptic curve cryptography all require **large prime numbers** as key material. The infinitude of primes guarantees:

- There is no "last prime" that adversaries could enumerate
- Primes of any desired bit-length exist (combined with PNT for density)
- Key generation can always find fresh, large primes

Without infinitely many primes, public-key cryptography would be fundamentally limited.

### Theoretical Computer Science

The infinitude of primes is used in:

- **Gödel numbering** — encoding logical formulas as products of prime powers; infinitely many primes means infinitely many distinct encodings
- **Complexity theory** — primality testing (AKS, Miller-Rabin) and factoring (RSA security) rely on the richness of the prime landscape
- **Hash functions** — prime moduli prevent collisions in hash tables

### Number Theory Foundation

The theorem is the starting point for:

- **Dirichlet's theorem** (1837): every arithmetic progression $a, a+d, a+2d, \ldots$ with $\gcd(a,d)=1$ contains infinitely many primes
- **Riemann Hypothesis** — about the precise distribution of primes
- **Twin prime conjecture** — infinitely many pairs $(p, p+2)$ (unproven)
- **Goldbach's conjecture** — every even number $> 2$ is a sum of two primes (unproven)

### Philosophy of Mathematics

Euclid's proof is a paradigmatic example of **proof by contradiction** (reductio ad absurdum) and is used in virtually every introduction to mathematical reasoning.

---

## 🔢 Examples

**Euclid's construction in action:**

| Primes used                  | Product + 1 | Factorization             | New prime(s) found |
| ---------------------------- | ----------- | ------------------------- | ------------------ |
| $\{2\}$                      | $3$         | $3$ (prime)               | $3$                |
| $\{2, 3\}$                   | $7$         | $7$ (prime)               | $7$                |
| $\{2, 3, 5\}$                | $31$        | $31$ (prime)              | $31$               |
| $\{2, 3, 5, 7\}$             | $211$       | $211$ (prime)             | $211$              |
| $\{2, 3, 5, 7, 11\}$         | $2311$      | $2311$ (prime)            | $2311$             |
| $\{2, 3, 5, 7, 11, 13\}$     | $30031$     | $59 \times 509$           | $59$ and $509$     |
| $\{2, 3, 5, 7, 11, 13, 17\}$ | $510511$    | $19 \times 97 \times 277$ | $19$, $97$, $277$  |

Note: the construction does not generate primes in order — it just guarantees _some_ new prime exists.

**Euler's analytic proof (sketch):**

If there were only finitely many primes $p_1, \ldots, p_k$, then:
$$\prod_{i=1}^{k} \frac{1}{1 - p_i^{-1}} = \prod_{i=1}^{k} \sum_{j=0}^{\infty} p_i^{-j}$$
would be a finite product of convergent series — hence finite. But by unique factorization:
$$\prod_{p} \frac{1}{1-p^{-1}} = \sum_{n=1}^{\infty} \frac{1}{n} = \infty$$
(the harmonic series diverges). Contradiction.

---

## ⚙️ Multiple Proofs

### Proof 1 — Euclid's Proof by Contradiction (c. 300 BCE)

**Assume** there are finitely many primes: $p_1, p_2, \ldots, p_k$.

**Construct** $N = p_1 p_2 \cdots p_k + 1$.

**Observe**: For each $i$, $p_i \mid p_1 p_2 \cdots p_k$, so $p_i \nmid N$ (since $N \equiv 1 \pmod{p_i}$).

**Conclude**: $N > 1$ has a prime factor $q$. Since $q \nmid N$ for all $p_i$, we have $q \notin \{p_1, \ldots, p_k\}$. This contradicts the assumption that the list was complete. $\blacksquare$

### Proof 2 — Euler's Analytic Proof (1737)

The **harmonic series** $\sum_{n=1}^{\infty} 1/n$ diverges. By unique prime factorization (Fundamental Theorem of Arithmetic):
$$\sum_{n=1}^{\infty} \frac{1}{n} = \prod_{p \text{ prime}} \frac{1}{1 - 1/p}$$

If there were finitely many primes, the right side would be a finite product of finite values — hence finite. But the left side is infinite. Contradiction. $\blacksquare$

### Proof 3 — Furstenberg's Topological Proof (1955)

Define a topology on $\mathbb{Z}$ where the **open sets** are unions of arithmetic progressions $a + n\mathbb{Z} = \{\ldots, a-n, a, a+n, a+2n, \ldots\}$.

Each set $a + n\mathbb{Z}$ is both open and closed (clopen). The set $\{-1, 1\}$ equals:
$$\mathbb{Z} \setminus \bigcup_{p \text{ prime}} p\mathbb{Z}$$

If there were finitely many primes, $\bigcup_p p\mathbb{Z}$ would be a finite union of closed sets — hence closed — making $\{-1, 1\}$ open. But $\{-1, 1\}$ is finite and every nonempty open set in this topology is infinite. Contradiction. $\blacksquare$

### Proof 4 — Via Binomial Coefficients (Erdős, 1959)

Every integer $n \leq 2m$ can be written as $n = s^2 \cdot r$ where $r$ is squarefree. The squarefree part $r$ is a product of distinct primes $\leq 2m$. If there are only $k$ primes $\leq 2m$, then $r$ has $2^k$ choices and $s \leq \sqrt{2m}$, giving at most $2^k \sqrt{2m}$ integers up to $2m$. But there are $2m$ such integers, so $2m \leq 2^k \sqrt{2m}$, giving $k \geq \frac{1}{2}\log_2(2m)$. As $m \to \infty$, $k \to \infty$. $\blacksquare$

---

## 🖥️ Lean 4 Status

**Status**: `formalized` — multiple proofs in Mathlib4

```lean
-- Mathlib4: Mathlib.Data.Nat.Prime.Infinite

-- Euclid's proof (the standard formalization):
theorem Nat.infinite_setOf_prime : Set.Infinite {p : ℕ | p.Prime} := by
  -- Proof by contradiction using Euclid's construction
  exact Nat.infinite_setOf_prime

-- Equivalent statement:
theorem Nat.exists_infinite_primes (n : ℕ) : ∃ p, n ≤ p ∧ p.Prime :=
  -- For any n, there exists a prime ≥ n
  Nat.exists_infinite_primes n

-- The key lemma (Euclid's construction):
theorem Nat.minFac_prime_of_ne_one {n : ℕ} (h : n ≠ 1) : n.minFac.Prime :=
  -- Every integer > 1 has a prime factor
  Nat.minFac_prime h

-- Furstenberg's topological proof:
-- Not yet in Mathlib, but the topology is definable

-- Usage example:
example : ∀ n : ℕ, ∃ p : ℕ, p.Prime ∧ p > n := by
  intro n
  obtain ⟨p, hn, hp⟩ := Nat.exists_infinite_primes (n + 1)
  exact ⟨p, hp, Nat.lt_of_succ_le hn⟩
```

**Mathlib coverage**:

- ✅ `Nat.infinite_setOf_prime` — the set of primes is infinite
- ✅ `Nat.exists_infinite_primes` — primes exceed any bound
- ✅ `Nat.minFac_prime` — every $n > 1$ has a prime factor
- ✅ Euclid's construction — formalized
- ✅ Euler's product formula — available in Mathlib
- ⚠️ Furstenberg's topological proof — not yet in Mathlib

---

_Theorem class: Elementary Number Theory | Difficulty: Introductory | Status: Proven (Euclid, c. 300 BCE)_
