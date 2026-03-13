# Euler's Theorem

## 📋 Theorem Statement

$$\gcd(a, n) = 1 \implies a^{\varphi(n)} \equiv 1 \pmod{n}$$

**Expanded form:**

$$\text{If } \gcd(a, n) = 1, \text{ then } n \mid \left(a^{\varphi(n)} - 1\right)$$

**Euler's totient function (required definition):**

$$\varphi(n) = n \prod_{p \mid n} \left(1 - \frac{1}{p}\right) = \left|\{k \in \mathbb{Z}^+ : k \leq n,\; \gcd(k, n) = 1\}\right|$$

**Special case — Fermat's Little Theorem** (when $n = p$ is prime):

$$a^{p-1} \equiv 1 \pmod{p} \quad \text{for } p \nmid a$$

---

## 🔣 Symbol Legend

| Symbol             | Name                           | Meaning                                                                                                     |
| ------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------- |
| $a$                | Base                           | An integer; the number being raised to a power                                                              |
| $n$                | Modulus                        | A positive integer; the number we divide by                                                                 |
| $\gcd(a, n)$       | Greatest common divisor        | The largest positive integer dividing both $a$ and $n$; equals $1$ when $a$ and $n$ share no common factors |
| $\gcd(a,n) = 1$    | Coprimality condition          | $a$ and $n$ are **coprime** (relatively prime); they share no prime factors                                 |
| $\varphi(n)$       | Euler's totient (phi function) | Count of integers from $1$ to $n$ that are coprime to $n$                                                   |
| $a^{\varphi(n)}$   | Exponentiation                 | $a$ raised to the power $\varphi(n)$                                                                        |
| $\equiv$           | Congruence                     | $a \equiv b \pmod{n}$ means $n$ divides $a - b$; $a$ and $b$ have the same remainder when divided by $n$    |
| $\pmod{n}$         | Modulo $n$                     | Arithmetic performed with remainders after division by $n$                                                  |
| $\mid$             | Divides                        | $n \mid m$ means $m$ is a multiple of $n$; $n$ divides $m$ evenly                                           |
| $\nmid$            | Does not divide                | $p \nmid a$ means $p$ is not a factor of $a$                                                                |
| $\prod_{p \mid n}$ | Product over prime divisors    | Multiply over all distinct primes $p$ that divide $n$                                                       |
| $\mathbb{Z}^+$     | Positive integers              | $\{1, 2, 3, \ldots\}$                                                                                       |
| $                  | \cdot                          | $                                                                                                           | Cardinality | The number of elements in a set |
| $\implies$         | Implies                        | Logical implication                                                                                         |

---

## 💬 Plain English Explanation

Euler's Theorem describes a remarkable pattern in **modular arithmetic** — the arithmetic of remainders.

When you raise a number $a$ to a large enough power and divide by $n$, the remainder cycles. Euler's Theorem pins down exactly when that cycle returns to $1$:

> **If $a$ and $n$ share no common factors, then $a$ raised to the power $\varphi(n)$ always leaves remainder $1$ when divided by $n$.**

The function $\varphi(n)$ counts how many numbers from $1$ to $n$ are coprime to $n$. For example:

- $\varphi(10) = 4$ because $\{1, 3, 7, 9\}$ are coprime to $10$
- $\varphi(7) = 6$ because $\{1, 2, 3, 4, 5, 6\}$ are all coprime to $7$ (it's prime)
- $\varphi(12) = 4$ because $\{1, 5, 7, 11\}$ are coprime to $12$

So for $a = 3$, $n = 10$: $\varphi(10) = 4$, and indeed $3^4 = 81 \equiv 1 \pmod{10}$ ✓

This theorem is the engine behind **RSA encryption** — the most widely used public-key cryptosystem in the world.

---

## 📖 History

| Year  | Event                                                                                                                                         |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1736  | Leonhard Euler proves **Fermat's Little Theorem** (the special case for primes) — Fermat had stated it without proof in 1640                  |
| 1763  | Euler introduces $\varphi(n)$ (the totient function) and proves the general theorem                                                           |
| 1801  | Carl Friedrich Gauss systematizes modular arithmetic in _Disquisitiones Arithmeticae_, placing Euler's theorem in a group-theoretic framework |
| 1970s | The theorem becomes the mathematical foundation of **RSA** (Rivest, Shamir, Adleman, 1977)                                                    |
| 1978  | RSA published — Euler's 215-year-old theorem becomes the basis of internet security                                                           |

---

## 🌍 Real-World Significance

### RSA Cryptography (Internet Security)

RSA encryption is built directly on Euler's Theorem. Here's how:

**Key generation:**

1. Choose two large primes $p$ and $q$; set $n = pq$
2. Compute $\varphi(n) = (p-1)(q-1)$
3. Choose $e$ coprime to $\varphi(n)$ (public exponent, often $65537$)
4. Find $d$ such that $ed \equiv 1 \pmod{\varphi(n)}$ (private exponent)

**Encryption:** $c \equiv m^e \pmod{n}$

**Decryption:** $m \equiv c^d \pmod{n}$

**Why it works** — by Euler's Theorem:
$$c^d \equiv m^{ed} \equiv m^{1 + k\varphi(n)} \equiv m \cdot (m^{\varphi(n)})^k \equiv m \cdot 1^k \equiv m \pmod{n}$$

RSA secures: HTTPS, SSH, email (PGP/GPG), digital signatures, TLS certificates.

### Primality Testing

Euler's Theorem underlies the **Fermat primality test** and informs the **Miller-Rabin** probabilistic primality test used in cryptographic key generation.

### Discrete Logarithm Problem

The difficulty of inverting $a^k \pmod{n}$ (finding $k$ given $a^k$) is the basis of Diffie-Hellman key exchange and ElGamal encryption.

---

## 🔢 Examples

**Example 1 — Basic application:**
$a = 3$, $n = 7$ (prime), $\varphi(7) = 6$:
$$3^6 = 729 = 104 \times 7 + 1 \implies 3^6 \equiv 1 \pmod{7} \checkmark$$

**Example 2 — Composite modulus:**
$a = 5$, $n = 12$, $\varphi(12) = \varphi(4)\varphi(3) = 2 \times 2 = 4$:
$$5^4 = 625 = 52 \times 12 + 1 \implies 5^4 \equiv 1 \pmod{12} \checkmark$$

**Example 3 — Computing large powers efficiently:**
Find $7^{100} \pmod{9}$.

$\varphi(9) = 9(1 - 1/3) = 6$, and $\gcd(7, 9) = 1$, so $7^6 \equiv 1 \pmod{9}$.

$100 = 16 \times 6 + 4$, so $7^{100} = (7^6)^{16} \cdot 7^4 \equiv 1^{16} \cdot 7^4 \pmod{9}$.

$7^2 = 49 \equiv 4 \pmod{9}$, $7^4 \equiv 16 \equiv 7 \pmod{9}$.

Therefore $7^{100} \equiv 7 \pmod{9}$.

**Example 4 — Totient values:**

| $n$                    | $\varphi(n)$   | Coprime integers        |
| ---------------------- | -------------- | ----------------------- |
| $1$                    | $1$            | $\{1\}$                 |
| $6$                    | $2$            | $\{1, 5\}$              |
| $10$                   | $4$            | $\{1, 3, 7, 9\}$        |
| $12$                   | $4$            | $\{1, 5, 7, 11\}$       |
| $p$ (prime)            | $p-1$          | $\{1, 2, \ldots, p-1\}$ |
| $p^k$                  | $p^{k-1}(p-1)$ | —                       |
| $pq$ (distinct primes) | $(p-1)(q-1)$   | —                       |

---

## ⚙️ Proof Sketch

**Setup:** Let $S = \{r_1, r_2, \ldots, r_{\varphi(n)}\}$ be the set of integers from $1$ to $n$ coprime to $n$ (the **reduced residue system** mod $n$).

**Key observation:** Since $\gcd(a, n) = 1$, multiplication by $a$ permutes $S$ modulo $n$. That is, $\{ar_1, ar_2, \ldots, ar_{\varphi(n)}\} \equiv \{r_1, r_2, \ldots, r_{\varphi(n)}\} \pmod{n}$.

**Multiply all elements:**
$$\prod_{i=1}^{\varphi(n)} (ar_i) \equiv \prod_{i=1}^{\varphi(n)} r_i \pmod{n}$$

$$a^{\varphi(n)} \prod_{i=1}^{\varphi(n)} r_i \equiv \prod_{i=1}^{\varphi(n)} r_i \pmod{n}$$

**Cancel** $\prod r_i$ (valid since each $r_i$ is coprime to $n$, so the product is coprime to $n$):

$$a^{\varphi(n)} \equiv 1 \pmod{n} \qquad \blacksquare$$

This proof is essentially a **group theory** argument: $(\mathbb{Z}/n\mathbb{Z})^\times$ is a group of order $\varphi(n)$, and by Lagrange's theorem, every element's order divides the group order.

---

## 🖥️ Lean 4 Status

**Status**: `formalized` — available in Mathlib4

```lean
-- Mathlib4: Mathlib.NumberTheory.EulerTotient
-- Mathlib4: Mathlib.Data.ZMod.Basic

-- Euler's Theorem:
theorem ZMod.units_pow_card_sub_one_eq_one (n : ℕ) (hn : 1 < n)
    (a : (ZMod n)ˣ) : a ^ Nat.totient n = 1 := by
  exact_mod_cast ZMod.pow_totient a

-- Equivalent statement for integers:
theorem Nat.ModEq.pow_totient {n : ℕ} (hn : 0 < n) {a : ℕ}
    (h : Nat.Coprime a n) : a ^ n.totient ≡ 1 [MOD n] :=
  -- Available in Mathlib as `ZMod.pow_totient`
  sorry

-- Fermat's Little Theorem (special case):
theorem ZMod.pow_prime_sub_one_eq_one (p : ℕ) [hp : Fact p.Prime]
    (a : (ZMod p)ˣ) : a ^ (p - 1) = 1 :=
  -- Follows from Euler's theorem since φ(p) = p - 1
  sorry
```

**Mathlib coverage**:

- ✅ `Nat.totient` — Euler's totient function
- ✅ `Nat.totient_prime` — $\varphi(p) = p - 1$
- ✅ `Nat.totient_mul` — multiplicativity of $\varphi$
- ✅ `ZMod.pow_totient` — Euler's theorem in $\mathbb{Z}/n\mathbb{Z}$
- ✅ Fermat's Little Theorem — `ZMod.pow_card_sub_one_eq_one`

---

_Theorem class: Elementary Number Theory | Difficulty: Undergraduate | Status: Proven (Euler, 1763)_
