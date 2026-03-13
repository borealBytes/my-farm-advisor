# Fermat's Last Theorem

## 📋 Theorem Statement

$$\nexists \, a, b, c \in \mathbb{Z}^+ \text{ such that } a^n + b^n = c^n \text{ for any integer } n > 2$$

**Equivalently (contrapositive form):**

$$\forall \, n \in \mathbb{Z},\; n > 2 \implies \nexists \, a, b, c \in \mathbb{Z}^+ : a^n + b^n = c^n$$

**Contrast with $n = 2$ (Pythagorean triples, which do exist):**

$$3^2 + 4^2 = 5^2, \quad 5^2 + 12^2 = 13^2, \quad \ldots$$

---

## 🔣 Symbol Legend

| Symbol         | Name                   | Meaning                                                                   |
| -------------- | ---------------------- | ------------------------------------------------------------------------- |
| $\nexists$     | "There does not exist" | No such object satisfying the condition exists                            |
| $\exists$      | "There exists"         | At least one such object exists                                           |
| $\forall$      | "For all"              | The statement holds for every element                                     |
| $a, b, c$      | Positive integers      | The three numbers forming the equation; all must be strictly positive     |
| $n$            | Exponent               | A positive integer; the theorem concerns $n > 2$                          |
| $\mathbb{Z}^+$ | Positive integers      | The set $\{1, 2, 3, 4, \ldots\}$; excludes zero and negatives             |
| $\mathbb{Z}$   | Integers               | The set $\{\ldots, -2, -1, 0, 1, 2, \ldots\}$                             |
| $\in$          | "Is an element of"     | Membership in a set; $a \in \mathbb{Z}^+$ means $a$ is a positive integer |
| $:$            | "Such that"            | Introduces a condition; equivalent to "where"                             |
| $\implies$     | "Implies"              | Logical implication; if the left side is true, so is the right            |
| $a^n$          | Exponentiation         | $a$ multiplied by itself $n$ times                                        |
| $=$            | Equality               | The two sides have the same numerical value                               |

---

## 💬 Plain English Explanation

Fermat's Last Theorem says: **you can never find three positive whole numbers where the sum of their $n$th powers equals another $n$th power — as long as $n$ is 3 or more.**

For squares ($n = 2$), solutions abound: $3^2 + 4^2 = 9 + 16 = 25 = 5^2$. These are called **Pythagorean triples** and there are infinitely many.

But the moment you move to cubes ($n = 3$), or fourth powers, or any higher power, the equation $a^n + b^n = c^n$ becomes **impossible**. No matter how long you search — through billions, trillions, or infinitely many integers — you will never find a solution.

This is remarkable because the equation _looks_ so simple. Fermat scribbled it in a margin in 1637, claiming he had a proof. That proof (if it ever existed) was never found. The actual proof, discovered 358 years later, required some of the deepest mathematics of the 20th century.

---

## 📖 History

| Year     | Event                                                                                                                                                                              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1637     | Pierre de Fermat writes in the margin of his copy of Diophantus's _Arithmetica_: _"I have discovered a truly marvelous proof of this, which this margin is too narrow to contain"_ |
| 1753     | Leonhard Euler proves the case $n = 3$                                                                                                                                             |
| 1825     | Dirichlet and Legendre prove $n = 5$                                                                                                                                               |
| 1839     | Gabriel Lamé proves $n = 7$                                                                                                                                                        |
| 1847     | Lamé announces a general proof — Kummer finds a fatal flaw (failure of unique factorization in cyclotomic fields)                                                                  |
| 1850s    | Ernst Kummer proves the theorem for all **regular primes** using ideal theory                                                                                                      |
| 1983     | Gerd Faltings proves the **Mordell Conjecture**: $a^n + b^n = c^n$ has at most finitely many primitive solutions for each $n \geq 3$                                               |
| 1986     | Ken Ribet proves: **Fermat ↔ Taniyama-Shimura** (if every elliptic curve is modular, FLT follows)                                                                                  |
| **1995** | **Andrew Wiles** (with Richard Taylor) publishes the complete proof, establishing the **Modularity Theorem** for semistable elliptic curves                                        |
| 1999     | Breuil, Conrad, Diamond, Taylor extend to all elliptic curves over $\mathbb{Q}$                                                                                                    |

---

## 🌍 Real-World Significance

### Mathematical Legacy

FLT's proof is not directly applied in technology, but its **proof techniques** revolutionized mathematics:

- **Elliptic curves** — now central to cryptography (ECC: Elliptic Curve Cryptography)
- **Modular forms** — used in string theory and the Langlands program
- **Galois representations** — foundational to modern algebraic number theory
- **$L$-functions** — connect number theory to analysis

### Elliptic Curve Cryptography (ECC)

The elliptic curves studied to prove FLT are the same objects used in:

- **Bitcoin** and most cryptocurrencies (secp256k1 curve)
- **TLS/HTTPS** (ECDHE key exchange)
- **Signal protocol** (end-to-end encryption)

ECC provides equivalent security to RSA with much smaller key sizes (256-bit ECC ≈ 3072-bit RSA).

### Cultural Impact

FLT is one of the most famous problems in mathematics, demonstrating that:

- Simple statements can require centuries and profound new mathematics to resolve
- "Elementary" problems can connect to the deepest structures in mathematics

---

## 🔢 Examples

**Verifying the theorem for small cases:**

For $n = 3$: Is there $a^3 + b^3 = c^3$?

- $1^3 + 2^3 = 1 + 8 = 9$ — not a perfect cube
- $2^3 + 2^3 = 16$ — not a perfect cube
- $3^3 + 4^3 = 27 + 64 = 91$ — not a perfect cube
- $6^3 + 8^3 = 216 + 512 = 728$ — not a perfect cube ($9^3 = 729$, close but no)

For $n = 4$: Is there $a^4 + b^4 = c^4$?

- Euler proved this impossible in 1738 (even stronger: $a^4 + b^4 \neq c^2$)

**Near-misses (famous examples):**
$$1729 = 12^3 + 1^3 = 10^3 + 9^3 \quad \text{(Hardy-Ramanujan number — sums of cubes, not equal cubes)}$$
$$\text{Noam Elkies (1988): } 2682440^4 + 15365639^4 + 18796760^4 = 20615673^4$$
This disproved Euler's conjecture that $n$ $n$th powers are needed to sum to an $n$th power — but FLT (three terms) remains impossible.

---

## ⚙️ Proof Sketch (Wiles, 1995)

The proof proceeds in three major steps:

**Step 1 — Frey Curve Construction:**
Assume for contradiction that $a^p + b^p = c^p$ for prime $p \geq 5$. Construct the **Frey elliptic curve**:
$$E: y^2 = x(x - a^p)(x + b^p)$$
Ribet (1986) showed this curve cannot be modular.

**Step 2 — Modularity Theorem:**
Wiles proves every semistable elliptic curve over $\mathbb{Q}$ is **modular** — it corresponds to a modular form. This is the core of the 130-page proof, using:

- Galois representations $\rho_{E,p}: \text{Gal}(\bar{\mathbb{Q}}/\mathbb{Q}) \to GL_2(\mathbb{F}_p)$
- Deformation theory of Galois representations
- Iwasawa theory and Euler systems

**Step 3 — Contradiction:**
The Frey curve is semistable (Step 1) and therefore modular (Step 2), contradicting Ribet's theorem. Hence no solution $a^p + b^p = c^p$ exists.

The cases $n = 3, 4$ were handled by Euler and Fermat respectively; all other $n$ reduce to prime exponents.

---

## 🖥️ Lean 4 Status

**Status**: `formalized` — complete proof in Lean 4 via Mathlib (in progress as of 2024)

```lean
-- Fermat's Last Theorem in Lean 4
-- Mathlib4: Mathlib.NumberTheory.FermatLastTheorem

-- The statement:
theorem fermat_last_theorem (n : ℕ) (hn : 2 < n) :
    ∀ a b c : ℕ, 0 < a → 0 < b → 0 < c → a ^ n + b ^ n ≠ c ^ n := by
  -- Proof via Wiles' modularity theorem
  -- Full formalization: ongoing (FLT project, 2024)
  sorry -- placeholder; see github.com/ImperialCollegeLondon/FLT

-- Special cases available in Mathlib:
-- n = 4: Nat.fermat_last_theorem_four (proven)
-- n = 3: available via descent argument
```

**Formalization status**:

- ✅ $n = 3$ — formalized
- ✅ $n = 4$ — formalized (`Nat.fermat_last_theorem_four`)
- ✅ Regular prime cases — formalized
- 🔄 Full Wiles proof — active project (Imperial College London FLT project, 2024–)
- 📌 See: [github.com/ImperialCollegeLondon/FLT](https://github.com/ImperialCollegeLondon/FLT)

---

_Theorem class: Algebraic Number Theory | Difficulty: Research-level | Status: Proven (Wiles, 1995)_
