# Binomial Theorem

## ## LaTeX Statement

For any non-negative integer $n$ and any elements $a$, $b$ of a commutative ring:

$$\forall\, n \in \mathbb{N},\; \forall\, a, b \in \mathbb{R} : (a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k$$

Expanded explicitly:

$$(a + b)^n = \binom{n}{0}a^n + \binom{n}{1}a^{n-1}b + \binom{n}{2}a^{n-2}b^2 + \cdots + \binom{n}{n-1}ab^{n-1} + \binom{n}{n}b^n$$

The binomial coefficient is defined as:

$$\binom{n}{k} = \frac{n!}{k!\,(n-k)!}$$

---

## ## Legend

| Symbol           | Pronunciation                | Meaning                                                                                           |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| $\forall$        | "for all"                    | Universal quantifier — the theorem holds for every valid $n$, $a$, $b$                            |
| $n$              | "n"                          | A non-negative integer; the exponent to which the binomial is raised                              |
| $\in$            | "in" or "element of"         | Set membership                                                                                    |
| $\mathbb{N}$     | "N" or "the natural numbers" | The set $\{0, 1, 2, 3, \ldots\}$ of non-negative integers                                         |
| $a, b$           | "a", "b"                     | Real numbers (or elements of any commutative ring — the theorem holds in full generality)         |
| $\mathbb{R}$     | "R" or "the real numbers"    | The set of all real numbers                                                                       |
| $:$              | "such that"                  | Introduces the conclusion                                                                         |
| $(a + b)^n$      | "a plus b, to the n"         | The binomial $a + b$ raised to the $n$-th power                                                   |
| $=$              | "equals"                     | Equality                                                                                          |
| $\sum_{k=0}^{n}$ | "sum from k equals 0 to n"   | Add together all terms as the index $k$ runs from 0 to $n$                                        |
| $k$              | "k"                          | The summation index; counts which term we are computing                                           |
| $\binom{n}{k}$   | "n choose k"                 | The binomial coefficient — the number of ways to choose $k$ items from $n$ items                  |
| $a^{n-k}$        | "a to the n minus k"         | $a$ raised to the power $(n-k)$; decreases from $a^n$ to $a^0 = 1$ as $k$ increases               |
| $b^k$            | "b to the k"                 | $b$ raised to the power $k$; increases from $b^0 = 1$ to $b^n$ as $k$ increases                   |
| $n!$             | "n factorial"                | The product $n \times (n-1) \times (n-2) \times \cdots \times 2 \times 1$; by convention $0! = 1$ |
| $k!$             | "k factorial"                | The product $k \times (k-1) \times \cdots \times 1$                                               |
| $(n-k)!$         | "n minus k factorial"        | The product $(n-k) \times (n-k-1) \times \cdots \times 1$                                         |
| $\cdots$         | "and so on"                  | Ellipsis indicating the pattern continues                                                         |

### Pascal's Triangle Connection

The binomial coefficients $\binom{n}{k}$ form Pascal's triangle, where each entry is the sum of the two entries above it:

$$\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k} \quad \text{(Pascal's Identity)}$$

| $n$ | Coefficients       | Row sum    |
| --- | ------------------ | ---------- |
| 0   | 1                  | $2^0 = 1$  |
| 1   | 1, 1               | $2^1 = 2$  |
| 2   | 1, 2, 1            | $2^2 = 4$  |
| 3   | 1, 3, 3, 1         | $2^3 = 8$  |
| 4   | 1, 4, 6, 4, 1      | $2^4 = 16$ |
| 5   | 1, 5, 10, 10, 5, 1 | $2^5 = 32$ |

---

## ## Plain English Explanation

The Binomial Theorem answers the question: _what do you get when you multiply $(a + b)$ by itself $n$ times?_

Multiplying $(a + b)^n$ by hand means choosing, from each of the $n$ factors, either $a$ or $b$, and then multiplying your choices together. The term $a^{n-k}b^k$ arises when you choose $b$ from exactly $k$ of the $n$ factors (and $a$ from the remaining $n-k$). The number of ways to make that choice is $\binom{n}{k}$ — "n choose k."

So the theorem is really a counting argument: each term in the expansion corresponds to a selection pattern, and the coefficient counts how many patterns produce that term.

**Key structural features:**

- There are exactly $n + 1$ terms in the expansion
- The powers of $a$ decrease: $a^n, a^{n-1}, \ldots, a^1, a^0$
- The powers of $b$ increase: $b^0, b^1, \ldots, b^{n-1}, b^n$
- In every term, the exponents of $a$ and $b$ sum to $n$
- The coefficients are symmetric: $\binom{n}{k} = \binom{n}{n-k}$

**Special cases:**

- Setting $a = b = 1$: $(1+1)^n = \sum_{k=0}^n \binom{n}{k}$, so the sum of all binomial coefficients in row $n$ is $2^n$
- Setting $a = 1$, $b = -1$: $0 = \sum_{k=0}^n (-1)^k \binom{n}{k}$, so the alternating sum is zero

---

## ## Real-World Significance

**Probability and Statistics — The Binomial Distribution**
If an experiment has probability $p$ of success and is repeated $n$ times independently, the probability of exactly $k$ successes is:
$$P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$$
This is the binomial distribution, directly derived from the theorem. It models coin flips, quality control sampling, clinical trial outcomes, election polling, and any yes/no repeated experiment.

**Computer Science — Algorithm Analysis**
Counting problems in combinatorics and algorithm analysis constantly involve binomial coefficients. The number of subsets of size $k$ from $n$ elements is $\binom{n}{k}$. Hash table collision analysis, randomized algorithm bounds, and network reliability calculations all use these counts.

**Finance — Binomial Options Pricing Model (BOPM)**
The Cox-Ross-Rubinstein model prices financial options by building a binomial tree of possible asset prices. At each node, the asset can go up or down. The probability of reaching a particular terminal node involves binomial coefficients, making the theorem foundational to quantitative finance.

**Genetics — Hardy-Weinberg Equilibrium**
In a population with two alleles $A$ and $a$ at frequencies $p$ and $q = 1-p$, the genotype frequencies after random mating are $(p + q)^2 = p^2 + 2pq + q^2$. The three terms give the frequencies of $AA$, $Aa$, and $aa$ genotypes — a direct application of the binomial theorem with $n = 2$.

**Physics — Approximations**
For small $\epsilon$, $(1 + \epsilon)^n \approx 1 + n\epsilon$ (keeping only the first two terms). This linearization is used throughout physics: relativistic corrections, perturbation theory, and small-angle approximations all rely on this binomial approximation.

**Cryptography — Polynomial Arithmetic**
Operations in finite fields $\mathbb{F}_{2^n}$ (used in AES encryption) involve polynomial arithmetic where the binomial theorem applies with coefficients modulo 2. The Frobenius endomorphism $(a + b)^{2^k} = a^{2^k} + b^{2^k}$ in characteristic 2 is a direct consequence.

---

## ## History

**Ancient India (~200 BCE)**
Pingala's _Chandaḥśāstra_ (Science of Prosody, ~200 BCE) contains what we now recognize as Pascal's triangle, used to count the number of metrical patterns in Sanskrit poetry with $n$ syllables. This is the earliest known appearance of binomial coefficients.

**Islamic Golden Age (953–1131 CE)**
Al-Karajī (953–1029) gave a proof by induction for the binomial theorem for positive integer exponents. Omar Khayyam (1048–1131), better known as a poet, extended this work and knew the expansion for general $n$, using it to extract roots of numbers.

**China — Yang Hui's Triangle (1261)**
Yang Hui published the arithmetic triangle (Pascal's triangle) in 1261, attributing it to Jia Xian (c. 1050). The triangle was used for extracting roots and solving polynomial equations.

**Europe — Pascal's Triangle (1654)**
Blaise Pascal (1623–1662) published _Traité du triangle arithmétique_ (Treatise on the Arithmetic Triangle) in 1654, systematically studying the triangle and its properties. Though the triangle predates him by centuries, his name became attached to it in Western mathematics.

**Newton's Generalization (1665)**
Isaac Newton (1643–1727) made the decisive leap: he generalized the theorem to non-integer and even negative exponents, discovering the **generalized binomial series**:

$$(1 + x)^\alpha = \sum_{k=0}^{\infty} \binom{\alpha}{k} x^k, \quad |x| < 1$$

where $\binom{\alpha}{k} = \frac{\alpha(\alpha-1)\cdots(\alpha-k+1)}{k!}$ for any real $\alpha$. This infinite series converges for $|x| < 1$ and opened the door to power series methods in calculus.

---

## ## Examples

### Example 1: $(a + b)^2$ — The Perfect Square Identity

$$\binom{2}{0}a^2b^0 + \binom{2}{1}a^1b^1 + \binom{2}{2}a^0b^2 = 1 \cdot a^2 + 2 \cdot ab + 1 \cdot b^2$$

$$(a + b)^2 = a^2 + 2ab + b^2$$

This identity is used constantly in algebra, geometry (area of a square with side $a+b$), and completing the square.

---

### Example 2: $(a + b)^3$ — The Cube of a Sum

$$\binom{3}{0}a^3 + \binom{3}{1}a^2b + \binom{3}{2}ab^2 + \binom{3}{3}b^3 = a^3 + 3a^2b + 3ab^2 + b^3$$

$$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$

---

### Example 3: Numerical Verification

Expand $(2 + 3)^4$ using the theorem, then verify:

$$\sum_{k=0}^{4}\binom{4}{k}2^{4-k}3^k = 1(16)(1) + 4(8)(3) + 6(4)(9) + 4(2)(27) + 1(1)(81)$$
$$= 16 + 96 + 216 + 216 + 81 = 625$$

Check: $(2 + 3)^4 = 5^4 = 625$ ✓

---

### Example 4: Finding a Specific Term

Find the coefficient of $x^3 y^5$ in $(x + y)^8$.

We need the term where $b^k = y^5$, so $k = 5$:

$$\binom{8}{5} x^{8-5} y^5 = \binom{8}{5} x^3 y^5$$

$$\binom{8}{5} = \frac{8!}{5!\,3!} = \frac{8 \times 7 \times 6}{3 \times 2 \times 1} = 56$$

The coefficient of $x^3 y^5$ is **56**.

---

### Example 5: Expansion with Subtraction

Expand $(x - 2)^5$. Treat as $(x + (-2))^5$:

$$\sum_{k=0}^{5}\binom{5}{k}x^{5-k}(-2)^k$$

| $k$ | $\binom{5}{k}$ | $x^{5-k}$ | $(-2)^k$ | Term     |
| --- | -------------- | --------- | -------- | -------- |
| 0   | 1              | $x^5$     | $1$      | $x^5$    |
| 1   | 5              | $x^4$     | $-2$     | $-10x^4$ |
| 2   | 10             | $x^3$     | $4$      | $40x^3$  |
| 3   | 10             | $x^2$     | $-8$     | $-80x^2$ |
| 4   | 5              | $x$       | $16$     | $80x$    |
| 5   | 1              | $1$       | $-32$    | $-32$    |

$$(x - 2)^5 = x^5 - 10x^4 + 40x^3 - 80x^2 + 80x - 32$$

---

### Example 6: Probability Application

A fair coin is flipped 10 times. What is the probability of exactly 6 heads?

$$P(X = 6) = \binom{10}{6}\left(\frac{1}{2}\right)^6\left(\frac{1}{2}\right)^4 = \binom{10}{6}\left(\frac{1}{2}\right)^{10}$$

$$\binom{10}{6} = \frac{10!}{6!\,4!} = \frac{10 \times 9 \times 8 \times 7}{4 \times 3 \times 2 \times 1} = 210$$

$$P(X = 6) = \frac{210}{1024} = \frac{105}{512} \approx 20.5\%$$

---

### Example 7: Newton's Generalized Binomial Series

Approximate $\sqrt{1.04} = (1 + 0.04)^{1/2}$ using the first three terms:

$$\binom{1/2}{0} = 1, \quad \binom{1/2}{1} = \frac{1}{2}, \quad \binom{1/2}{2} = \frac{(1/2)(1/2 - 1)}{2!} = \frac{(1/2)(-1/2)}{2} = -\frac{1}{8}$$

$$(1 + 0.04)^{1/2} \approx 1 + \frac{1}{2}(0.04) - \frac{1}{8}(0.04)^2 = 1 + 0.02 - 0.0002 = 1.0198$$

Exact value: $\sqrt{1.04} \approx 1.01980\ldots$ ✓

---

## ## Lean Status

**Status**: Proven in Lean 4 (Mathlib)

The Binomial Theorem is fully formalized in Lean 4's `mathlib4`:

```lean4
import Mathlib.Algebra.BigOperators.Ring
import Mathlib.Data.Nat.Choose.Sum

-- The Binomial Theorem in a commutative semiring
-- This is `Commute.add_pow` or `add_pow` in Mathlib
theorem add_pow {R : Type*} [CommSemiring R] (x y : R) (n : ℕ) :
    (x + y) ^ n = ∑ k ∈ Finset.range (n + 1),
      x ^ k * y ^ (n - k) * n.choose k := by
  -- Proof by induction on n
  induction n with
  | zero => simp
  | succ n ih =>
    rw [pow_succ, ih, Finset.sum_mul]
    simp_rw [mul_comm (x ^ _) (y ^ _), ← mul_assoc, pow_succ, mul_assoc]
    rw [Finset.sum_range_succ', Finset.sum_range_succ]
    simp [Nat.choose_succ_succ, Nat.choose_zero_right, Nat.choose_self,
          add_mul, mul_add, ← add_assoc]
    ring

-- Pascal's Identity (used in the inductive step)
theorem Nat.choose_succ_succ (n k : ℕ) :
    (n + 1).choose (k + 1) = n.choose k + n.choose (k + 1) :=
  Nat.choose_succ_succ n k
```

**Mathlib Location**: `Mathlib.Algebra.BigOperators.Ring` (theorem `add_pow`), `Mathlib.Data.Nat.Choose.Sum`

**Proof Approach**: The standard Lean proof uses mathematical induction on $n$:

1. **Base case** ($n = 0$): $(a+b)^0 = 1 = \binom{0}{0}a^0b^0$ — trivially true
2. **Inductive step**: Assume $(a+b)^n = \sum_{k=0}^n \binom{n}{k}a^{n-k}b^k$. Then:
   - $(a+b)^{n+1} = (a+b) \cdot (a+b)^n$
   - Distribute and reindex using Pascal's identity $\binom{n+1}{k} = \binom{n}{k-1} + \binom{n}{k}$
   - Combine like terms to obtain the formula for $n+1$

**Verification Level**: Complete — `add_pow` in Mathlib has no `sorry`. The proof is a standard induction argument fully mechanized in Lean.
