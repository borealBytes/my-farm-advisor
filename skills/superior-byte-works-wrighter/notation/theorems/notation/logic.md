# Mathematical Logic Symbols

> **No math background needed.** Logic symbols let us write precise statements about what is true or false. This page explains every logic symbol with truth tables and everyday examples.

Logic symbols let us express precise statements about what is true or false, and how statements relate to each other.

---

## What Is Mathematical Logic?

Logic is the study of reasoning. Mathematical logic gives us symbols to express statements and their relationships with perfect clarity.

**Key idea:** In logic, every statement is either TRUE or FALSE. There's no "maybe" or "sort of."

---

## Basic Logical Connectives

| Symbol                                 | Name            | LaTeX             | Meaning                | Example               |
| -------------------------------------- | --------------- | ----------------- | ---------------------- | --------------------- |
| $\neg$ or $!$                          | Not/Negation    | `\neg` or `!`     | Opposite truth value   | $\neg P$              |
| $\land$ or $\&$                        | And/Conjunction | `\land`           | Both true              | $P \land Q$           |
| $\lor$ or $\|$                         | Or/Disjunction  | `\lor`            | At least one true      | $P \lor Q$            |
| $\rightarrow$ or $\Rightarrow$         | Implies         | `\rightarrow`     | If...then              | $P \rightarrow Q$     |
| $\leftrightarrow$ or $\Leftrightarrow$ | If and only if  | `\leftrightarrow` | Both imply each other  | $P \leftrightarrow Q$ |
| $\oplus$                               | Exclusive or    | `\oplus`          | One or other, not both | $P \oplus Q$          |

---

## Detailed Explanations

### Negation (¬)

**LaTeX:** `\neg` or `\lnot`

**What it means:** The opposite truth value. If P is true, ¬P is false. If P is false, ¬P is true.

**Truth table:**

| P   | ¬P  |
| --- | --- |
| T   | F   |
| F   | T   |

**Example:**

- P: "It is raining." (True)
- ¬P: "It is not raining." (False)

**In mathematics:**

- P: $x = 5$
- ¬P: $x \neq 5$

---

### Conjunction/And (∧)

**LaTeX:** `\land` or `\wedge`

**What it means:** Both statements are true. P ∧ Q is true only when P is true AND Q is true.

**Truth table:**

| P   | Q   | P ∧ Q |
| --- | --- | ----- |
| T   | T   | T     |
| T   | F   | F     |
| F   | T   | F     |
| F   | F   | F     |

**Memory aid:** Think "A for And" — the symbol looks like an A without the crossbar.

**Example:**

- P: "I have a cat." (True)
- Q: "I have a dog." (False)
- P ∧ Q: "I have a cat and a dog." (False — because Q is false)

**In mathematics:**
"$x > 0$ ∧ $x < 10$" means x is between 0 and 10.

---

### Disjunction/Or (∨)

**LaTeX:** `\lor` or `\vee`

**What it means:** At least one statement is true. P ∨ Q is true when P is true, or Q is true, or both are true.

**Truth table:**

| P   | Q   | P ∨ Q |
| --- | --- | ----- |
| T   | T   | T     |
| T   | F   | T     |
| F   | T   | T     |
| F   | F   | F     |

**Important:** In mathematics, "or" is INCLUSIVE — it includes the case where both are true.

**Memory aid:** Think "V for Victory" or "v for or."

**Example:**

- P: "I'll have tea." (True)
- Q: "I'll have coffee." (True)
- P ∨ Q: "I'll have tea or coffee." (True — and I might have both!)

**In mathematics:**
"$x < 0$ ∨ $x > 10$" means x is either negative or greater than 10 (or both, though that's impossible here).

---

### Exclusive Or (⊕)

**LaTeX:** `\oplus`

**What it means:** One or the other, but NOT both.

**Truth table:**

| P   | Q   | P ⊕ Q |
| --- | --- | ----- |
| T   | T   | F     |
| T   | F   | T     |
| F   | T   | T     |
| F   | F   | F     |

**Example:**
"You can have cake ⊕ you can have pie" means you can have one or the other, but not both.

**In mathematics:**
P ⊕ Q is equivalent to $(P \lor Q) \land \neg(P \land Q)$.

---

### Implication (→)

**LaTeX:** `\rightarrow` or `\Rightarrow` (stronger)

**What it means:** "If P, then Q." P implies Q.

**Truth table:**

| P   | Q   | P → Q |
| --- | --- | ----- |
| T   | T   | T     |
| T   | F   | F     |
| F   | T   | T     |
| F   | F   | T     |

**Important:** P → Q is only FALSE when P is true and Q is false. If P is false, the implication is automatically true (this is called "vacuously true").

**Ways to read P → Q:**

- If P, then Q
- P implies Q
- Q if P
- P only if Q
- Q whenever P

**Example:**

- P: "It is raining."
- Q: "The ground is wet."
- P → Q: "If it is raining, then the ground is wet."

This is false only if it's raining but the ground is dry.

**In mathematics:**
"$x > 5$ → $x > 3$" is always true. If x is greater than 5, it must be greater than 3.

---

### Biconditional/If and Only If (↔)

**LaTeX:** `\leftrightarrow` or `\Leftrightarrow` (stronger)

**What it means:** P and Q are either both true or both false. P implies Q AND Q implies P.

**Truth table:**

| P   | Q   | P ↔ Q |
| --- | --- | ----- |
| T   | T   | T     |
| T   | F   | F     |
| F   | T   | F     |
| F   | F   | T     |

**Ways to read P ↔ Q:**

- P if and only if Q (abbreviated "P iff Q")
- P is equivalent to Q
- P and Q have the same truth value

**Example:**

- P: "A number is even."
- Q: "A number is divisible by 2."
- P ↔ Q: "A number is even if and only if it is divisible by 2."

**In mathematics:**
"$x^2 = 4$ ↔ $(x = 2$ ∨ $x = -2)$"

---

## Quantifiers

| Symbol     | Name                     | LaTeX      | Meaning              | Example                    |
| ---------- | ------------------------ | ---------- | -------------------- | -------------------------- |
| $\forall$  | For all/Universal        | `\forall`  | For every element    | $\forall x \in \mathbb{R}$ |
| $\exists$  | There exists/Existential | `\exists`  | At least one element | $\exists x \in \mathbb{R}$ |
| $\exists!$ | There exists unique      | `\exists!` | Exactly one element  | $\exists! x$               |
| $\nexists$ | There does not exist     | `\nexists` | No such element      | $\nexists x$               |

---

### Universal Quantifier (∀)

**LaTeX:** `\forall`

**What it means:** "For all," "for every," "for any." The statement is true for every element in the domain.

**Example:**
$$\forall x \in \mathbb{R}, x^2 \geq 0$$
"For all real numbers x, x squared is greater than or equal to zero."

$$\forall n \in \mathbb{N}, n + 1 > n$$
"For every natural number n, n plus 1 is greater than n."

**Memory aid:** The symbol looks like an upside-down A, for "All."

---

### Existential Quantifier (∃)

**LaTeX:** `\exists`

**What it means:** "There exists," "there is at least one," "for some." The statement is true for at least one element.

**Example:**
$$\exists x \in \mathbb{R}, x^2 = 4$$
"There exists a real number x such that x squared equals 4." (True: x = 2 or x = -2)

$$\exists n \in \mathbb{N}, n > 100$$
"There exists a natural number greater than 100." (True: 101, 102, ...)

**Memory aid:** The symbol looks like a backwards E, for "Exists."

---

### Unique Existence (∃!)

**LaTeX:** `\exists!`

**What it means:** "There exists exactly one." There is one and only one element satisfying the condition.

**Example:**
$$\exists! x \in \mathbb{R}, x + 3 = 7$$
"There exists a unique real number x such that x plus 3 equals 7." (x = 4)

$$\exists! n \in \mathbb{N}, n < 1$$
"There exists a unique natural number less than 1." (If 0 ∈ ℕ, then n = 0)

---

## Combining Quantifiers

Order matters when combining quantifiers!

| Expression            | Meaning                                                       |
| --------------------- | ------------------------------------------------------------- |
| $\forall x \exists y$ | For every x, there exists a y (y can depend on x)             |
| $\exists y \forall x$ | There exists a y that works for all x (single y for everyone) |

**Example:**

"For every person, there exists a mother":
$$\forall p \exists m, \text{Mother}(m, p)$$
True — everyone has a mother.

"There exists a mother for all people":
$$\exists m \forall p, \text{Mother}(m, p)$$
False — there's no single mother of all people!

---

## Logical Equivalences

These statements are always equivalent (have the same truth value):

| Equivalence                                                            | Name                    |
| ---------------------------------------------------------------------- | ----------------------- |
| $\neg(\neg P) \equiv P$                                                | Double negation         |
| $P \land Q \equiv Q \land P$                                           | Commutativity of AND    |
| $P \lor Q \equiv Q \lor P$                                             | Commutativity of OR     |
| $(P \land Q) \land R \equiv P \land (Q \land R)$                       | Associativity of AND    |
| $(P \lor Q) \lor R \equiv P \lor (Q \lor R)$                           | Associativity of OR     |
| $\neg(P \land Q) \equiv \neg P \lor \neg Q$                            | De Morgan's Law         |
| $\neg(P \lor Q) \equiv \neg P \land \neg Q$                            | De Morgan's Law         |
| $P \rightarrow Q \equiv \neg P \lor Q$                                 | Implication equivalence |
| $P \rightarrow Q \equiv \neg Q \rightarrow \neg P$                     | Contrapositive          |
| $P \leftrightarrow Q \equiv (P \rightarrow Q) \land (Q \rightarrow P)$ | Biconditional           |

---

## De Morgan's Laws

**For propositions:**

- $\neg(P \land Q) \equiv \neg P \lor \neg Q$
  "Not (P and Q)" is the same as "(not P) or (not Q)"

- $\neg(P \lor Q) \equiv \neg P \land \neg Q$
  "Not (P or Q)" is the same as "(not P) and (not Q)"

**For quantifiers:**

- $\neg(\forall x, P(x)) \equiv \exists x, \neg P(x)$
  "Not (for all x, P(x))" is the same as "there exists x such that not P(x)"

- $\neg(\exists x, P(x)) \equiv \forall x, \neg P(x)$
  "Not (there exists x, P(x))" is the same as "for all x, not P(x)"

**Example:**
"Not everyone likes pizza" ≡ "Someone doesn't like pizza"

---

## Tautologies and Contradictions

| Type              | Definition                      | Example                                  |
| ----------------- | ------------------------------- | ---------------------------------------- |
| **Tautology**     | Always true                     | $P \lor \neg P$ (law of excluded middle) |
| **Contradiction** | Always false                    | $P \land \neg P$                         |
| **Contingency**   | Sometimes true, sometimes false | $P \land Q$                              |

**Common tautologies:**

- $P \lor \neg P$ (Law of excluded middle: either P is true or P is false)
- $P \rightarrow P$ (Self-implication)
- $\neg\neg P \rightarrow P$ (Double negation)

---

## Inference Rules

| Rule                   | Form                                                     | Meaning                                         |
| ---------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Modus Ponens           | $P \rightarrow Q$, $P$ ∴ $Q$                             | If P implies Q, and P is true, then Q is true   |
| Modus Tollens          | $P \rightarrow Q$, $\neg Q$ ∴ $\neg P$                   | If P implies Q, and Q is false, then P is false |
| Hypothetical Syllogism | $P \rightarrow Q$, $Q \rightarrow R$ ∴ $P \rightarrow R$ | Chain implications                              |
| Disjunctive Syllogism  | $P \lor Q$, $\neg P$ ∴ $Q$                               | If P or Q, and not P, then Q                    |
| Conjunction            | $P$, $Q$ ∴ $P \land Q$                                   | If P and Q separately, then P and Q together    |
| Simplification         | $P \land Q$ ∴ $P$                                        | From P and Q, deduce P                          |
| Addition               | $P$ ∴ $P \lor Q$                                         | From P, deduce P or Q                           |

---

## Common Logical Patterns

| Pattern                                                                       | Meaning          | Example                        |
| ----------------------------------------------------------------------------- | ---------------- | ------------------------------ |
| $\forall x (P(x) \rightarrow Q(x))$                                           | All P are Q      | All cats are mammals           |
| $\exists x (P(x) \land Q(x))$                                                 | Some P are Q     | Some cats are black            |
| $\forall x (P(x) \rightarrow \neg Q(x))$                                      | No P are Q       | No cats are dogs               |
| $\exists x (P(x) \land \neg Q(x))$                                            | Some P are not Q | Some cats are not black        |
| $\forall x \forall y (R(x, y) \rightarrow R(y, x))$                           | R is symmetric   | If x likes y, then y likes x   |
| $\forall x \forall y \forall z ((R(x, y) \land R(y, z)) \rightarrow R(x, z))$ | R is transitive  | If x > y and y > z, then x > z |

---

## LaTeX Tips for Logic

**Basic symbols:**

```latex
$$P \land Q \lor \neg R$$
$$P \rightarrow Q \leftrightarrow R$$
```

**Quantifiers:**

```latex
$$\forall x \in \mathbb{R}, x^2 \geq 0$$
$$\exists x \in \mathbb{Z}, x^2 = 4$$
$$\forall \epsilon > 0, \exists \delta > 0, |x - a| < \delta \rightarrow |f(x) - L| < \epsilon$$
```

**Multiple quantifiers:**

```latex
$$\forall x \exists y, P(x, y)$$
$$\exists x \forall y, P(x, y)$$
```

**Negation:**

```latex
$$\neg(P \land Q) \equiv \neg P \lor \neg Q$$
$$\neg \forall x, P(x) \equiv \exists x, \neg P(x)$$
```

**Inference:**

```latex
$$P \rightarrow Q, P \vdash Q \quad \text{(Modus Ponens)}$$
```
