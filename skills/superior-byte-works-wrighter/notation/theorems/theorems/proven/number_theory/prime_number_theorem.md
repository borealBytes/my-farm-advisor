# Prime Number Theorem

## 📋 Theorem Statement

$$\pi(x) \sim \frac{x}{\ln x}$$

**Equivalently:**

$$\lim_{x \to \infty} \frac{\pi(x)}{\dfrac{x}{\ln x}} = 1$$

**Refined form (Li approximation):**

$$\pi(x) \sim \operatorname{Li}(x) = \int_2^x \frac{dt}{\ln t}$$

---

## 🔣 Symbol Legend

| Symbol                 | Name                    | Meaning                                                                                           |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| $\pi(x)$               | Prime-counting function | The number of prime numbers less than or equal to $x$                                             |
| $x$                    | Real variable           | A positive real number (the upper bound)                                                          |
| $\ln x$                | Natural logarithm       | Logarithm base $e \approx 2.71828$; $\ln x = \log_e x$                                            |
| $\sim$                 | Asymptotic equivalence  | $f(x) \sim g(x)$ means $\lim_{x\to\infty} f(x)/g(x) = 1$; the two functions grow at the same rate |
| $\lim_{x \to \infty}$  | Limit at infinity       | The value approached as $x$ grows without bound                                                   |
| $\operatorname{Li}(x)$ | Logarithmic integral    | $\int_2^x \frac{dt}{\ln t}$; a more accurate approximation than $x/\ln x$                         |
| $\int_2^x$             | Definite integral       | Continuous sum from $2$ to $x$                                                                    |
| $dt$                   | Differential            | Infinitesimal element of integration variable $t$                                                 |
| $\frac{dt}{\ln t}$     | Integrand               | The function being integrated                                                                     |

---

## 💬 Plain English Explanation

The Prime Number Theorem tells us **how densely packed prime numbers are** among all integers.

Primes become rarer as numbers get larger — there are fewer primes near a billion than near a hundred. The theorem gives a precise formula for _how_ they thin out:

> **Near the number $x$, roughly $1$ in every $\ln x$ integers is prime.**

So near $x = 1{,}000{,}000$, about $1$ in $\ln(1{,}000{,}000) \approx 14$ numbers is prime. Near $x = 10^{100}$ (a googol), about $1$ in $230$ numbers is prime.

The total count of primes up to $x$ is approximately $x / \ln x$. For example:

- Primes up to $1{,}000$: actual $= 168$, estimate $\approx 145$ (error ~14%)
- Primes up to $10^6$: actual $= 78{,}498$, estimate $\approx 72{,}382$ (error ~8%)
- Primes up to $10^9$: actual $= 50{,}847{,}534$, estimate $\approx 48{,}254{,}942$ (error ~5%)

The error shrinks (in relative terms) as $x$ grows — that's what "asymptotic" means.

---

## 📖 History

| Year          | Event                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1792–1793     | Carl Friedrich Gauss (age ~15) conjectures $\pi(x) \approx x/\ln x$ from examining prime tables                         |
| 1798          | Adrien-Marie Legendre independently states a similar conjecture                                                         |
| 1848–1850     | Pafnuty Chebyshev proves partial bounds: $0.92 \cdot x/\ln x < \pi(x) < 1.11 \cdot x/\ln x$                             |
| 1859          | Bernhard Riemann connects $\pi(x)$ to the **Riemann zeta function** $\zeta(s)$, laying the analytic groundwork          |
| **1896**      | **Jacques Hadamard** and **Charles-Jean de la Vallée Poussin** independently prove the theorem using complex analysis   |
| 1949–1950     | Paul Erdős and Atle Selberg give an "elementary" proof (no complex analysis) — a sensation at the time                  |
| 1980s–present | Effective bounds and computational verification of the Riemann Hypothesis (which would sharpen the error term) continue |

---

## 🌍 Real-World Significance

### Cryptography (RSA, Diffie-Hellman)

Modern public-key cryptography relies on **large prime numbers** (512–4096 bits). The Prime Number Theorem guarantees that primes are plentiful enough to find efficiently:

- Among 1024-bit numbers, roughly $1$ in $\ln(2^{1024}) \approx 710$ is prime
- Random search finds a prime in ~710 trials on average
- Without this density guarantee, key generation would be computationally infeasible

### Primality Testing

Algorithms like Miller-Rabin and AKS are designed knowing the expected density of primes, allowing efficient probabilistic and deterministic tests.

### Random Number Generation

Cryptographically secure pseudorandom number generators (CSPRNGs) use prime-field arithmetic; the theorem informs parameter selection.

### Analytic Number Theory

The theorem is the cornerstone result connecting **discrete arithmetic** (primes) to **continuous analysis** (logarithms, integrals), opening the entire field of analytic number theory.

---

## 🔢 Examples

**Example 1 — Estimating $\pi(100)$:**
$$\frac{100}{\ln 100} = \frac{100}{4.605} \approx 21.7$$
Actual: $\pi(100) = 25$ primes. Error: ~13%.

**Example 2 — Estimating $\pi(10^6)$:**
$$\frac{10^6}{\ln 10^6} = \frac{10^6}{13.816} \approx 72{,}382$$
Actual: $\pi(10^6) = 78{,}498$. Error: ~8%.

**Example 3 — Li approximation for $\pi(10^6)$:**
$$\operatorname{Li}(10^6) \approx 78{,}628$$
Error: only ~0.2%. The logarithmic integral is dramatically more accurate.

**Example 4 — Probability a random large number is prime:**
For a random $n$-digit number, the probability it is prime is approximately:
$$P \approx \frac{1}{\ln(10^n)} = \frac{1}{n \ln 10} \approx \frac{1}{2.303 \, n}$$
For a 300-digit number: $P \approx 1/690$.

---

## ⚙️ Proof Sketch

The proof uses the **Riemann zeta function**:
$$\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}$$

Key steps:

1. Show $\zeta(s)$ has no zeros on the line $\operatorname{Re}(s) = 1$ (Hadamard/de la Vallée Poussin)
2. Apply a **Tauberian theorem** (Perron's formula) to convert analytic properties of $\zeta$ into asymptotics of $\pi(x)$
3. Conclude $\pi(x) \sim x/\ln x$

The **Riemann Hypothesis** (unproven) would give the sharp error bound:
$$\pi(x) = \operatorname{Li}(x) + O\!\left(\sqrt{x} \ln x\right)$$

---

## 🖥️ Lean 4 Status

**Status**: `partial` — foundational components available in Mathlib

```lean
-- Mathlib4: Mathlib.NumberTheory.PrimeCounting
-- π(x) is defined as Nat.card {p : ℕ | p.Prime ∧ p ≤ x}

-- The full asymptotic statement requires:
-- 1. Analytic continuation of ζ(s)  [available in Mathlib]
-- 2. Zero-free region of ζ(s)       [partial in Mathlib]
-- 3. Tauberian theorem               [not yet in Mathlib]

-- Full formalization: ongoing research project
-- See: https://leanprover-community.github.io/mathlib4_docs/
```

**Mathlib coverage**:

- ✅ `Nat.Prime` — primality predicate
- ✅ `Nat.primeCounting` — $\pi(x)$ function
- ✅ Riemann zeta function definition
- ⚠️ Zero-free region — partial
- ❌ Full PNT asymptotic — not yet formalized in Lean 4

---

_Theorem class: Analytic Number Theory | Difficulty: Graduate | Status: Proven (1896)_
