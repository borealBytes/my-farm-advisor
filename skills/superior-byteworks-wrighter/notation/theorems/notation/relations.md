# Mathematical Relations

> **No math background needed.** Relations are the comparison words of mathematics — they describe how two quantities relate to each other. This page covers every common relation symbol with plain-English explanations.

Relations describe how two quantities compare or connect to each other. They answer questions like: Are they equal? Which is larger? How are they related?

---

## Equality and Inequality

| Symbol    | Name                 | LaTeX     | Meaning                 | Example                             |
| --------- | -------------------- | --------- | ----------------------- | ----------------------------------- |
| $=$       | Equals               | `=`       | Same value              | $2 + 3 = 5$                         |
| $\neq$    | Not equal            | `\neq`    | Different values        | $2 + 3 \neq 6$                      |
| $\approx$ | Approximately        | `\approx` | Close in value          | $\pi \approx 3.14$                  |
| $\sim$    | Similar to           | `\sim`    | Proportional or similar | $\triangle ABC \sim \triangle DEF$  |
| $\simeq$  | Asymptotically equal | `\simeq`  | Equal in the limit      | $f(x) \simeq g(x)$                  |
| $\equiv$  | Equivalent/Identical | `\equiv`  | Always equal            | $a \equiv b \pmod{m}$               |
| $\propto$ | Proportional to      | `\propto` | Scaled by constant      | $y \propto x$                       |
| $\cong$   | Congruent            | `\cong`   | Same shape and size     | $\triangle ABC \cong \triangle DEF$ |

---

## Detailed Explanations

### Equals (=)

**LaTeX:** `=`

**What it means:** Two quantities have exactly the same value.

**When to use:** When stating that two expressions represent the same number.

**Example:**
$$2 + 3 = 5$$
"Two plus three equals five."

**Important distinction:**

- $=$ means "equals" (statement of fact)
- $:=$ means "defined as" (assignment)
- $\equiv$ means "identically equal" (always true)

---

### Not Equal (≠)

**LaTeX:** `\neq`

**What it means:** Two quantities have different values.

**When to use:** When explicitly stating that two things are not the same.

**Example:**
$$\sqrt{2} \neq 1.414$$
"The square root of 2 is not exactly equal to 1.414 (it's irrational)."

---

### Approximately Equal (≈)

**LaTeX:** `\approx`

**What it means:** Two quantities are close in value, but not exactly equal.

**When to use:** When rounding, estimating, or when exact equality is impossible (irrational numbers).

**Example:**
$$\pi \approx 3.14159$$
"Pi is approximately 3.14159."

**Variants:**

- $\approx$: Approximately equal
- $\sim$: Of the same order (roughly proportional)
- $\simeq$: Asymptotically equal (equal in some limit)

---

### Proportional To (∝)

**LaTeX:** `\propto`

**What it means:** Two quantities are related by a constant factor. If $y \propto x$, then $y = kx$ for some constant $k$.

**When to use:** When describing relationships where one quantity scales with another.

**Example:**
$$F \propto \frac{1}{r^2}$$
"Gravitational force is proportional to the inverse square of distance."

This means $F = \frac{G}{r^2}$ where $G$ is a constant.

---

## Comparison Relations

| Symbol | Name                        | LaTeX  | Meaning                             | Example          |
| ------ | --------------------------- | ------ | ----------------------------------- | ---------------- |
| $<$    | Less than                   | `<`    | Left side is smaller                | $3 < 5$          |
| $>$    | Greater than                | `>`    | Left side is larger                 | $5 > 3$          |
| $\leq$ | Less than or equal          | `\leq` | Left side is not larger             | $x \leq 10$      |
| $\geq$ | Greater than or equal       | `\geq` | Left side is not smaller            | $x \geq 0$       |
| $\ll$  | Much less than              | `\ll`  | Left side is tiny compared to right | $\epsilon \ll 1$ |
| $\gg$  | Much greater than           | `\gg`  | Left side is huge compared to right | $N \gg 1$        |
| $<$<   | Much less than (variant)    |        |                                     |                  |
| $>$>   | Much greater than (variant) |        |                                     |                  |

---

### Less Than (<)

**LaTeX:** `<`

**What it means:** The quantity on the left is smaller than the quantity on the right.

**Memory aid:** The symbol points to the smaller number. Think of it as a hungry mouth eating the larger number.

**Example:**
$$3 < 5$$
"Three is less than five."

---

### Greater Than (>)

**LaTeX:** `>`

**What it means:** The quantity on the left is larger than the quantity on the right.

**Memory aid:** Same as less than, but reversed. The mouth still opens toward the larger number.

**Example:**
$$5 > 3$$
"Five is greater than three."

---

### Less Than or Equal To (≤)

**LaTeX:** `\leq` or `\le`

**What it means:** The left side is either smaller than OR equal to the right side.

**When to use:** When setting upper bounds or constraints.

**Example:**
$$x \leq 10$$
"x can be 10 or any number smaller than 10."

**Common uses:**

- Age restrictions: "Must be ≤ 12 years old"
- Speed limits: "Speed ≤ 65 mph"
- Budgets: "Cost ≤ $100"

---

### Greater Than or Equal To (≥)

**LaTeX:** `\geq` or `\ge`

**What it means:** The left side is either larger than OR equal to the right side.

**When to use:** When setting lower bounds or minimums.

**Example:**
$$x \geq 0$$
"x can be zero or any positive number."

**Common uses:**

- Minimum age: "Must be ≥ 18 years old"
- Minimum scores: "Grade ≥ 70% to pass"
- Non-negative quantities: "Time ≥ 0"

---

### Much Less Than (<<) and Much Greater Than (>>)

**LaTeX:** `\ll` and `\gg`

**What they mean:** Not just smaller or larger, but dramatically so. Often used when one quantity is negligible compared to another.

**Example:**
$$\epsilon \ll 1$$
"Epsilon is much less than 1" (used in approximations)

$$M_{\text{sun}} \gg M_{\text{earth}}$$
"The sun's mass is much greater than Earth's mass."

---

## Ordering Relations

| Symbol    | Name               | LaTeX     | Meaning                   |
| --------- | ------------------ | --------- | ------------------------- |
| $<$       | Precedes           | `<`       | Comes before in order     |
| $>$       | Succeeds           | `>`       | Comes after in order      |
| $\prec$   | Precedes           | `\prec`   | Precedes in partial order |
| $\succ$   | Succeeds           | `\succ`   | Succeeds in partial order |
| $\preceq$ | Precedes or equals | `\preceq` | Precedes or is equal      |
| $\succeq$ | Succeeds or equals | `\succeq` | Succeeds or is equal      |

---

## Equivalence Relations

| Symbol           | Name                 | LaTeX            | Meaning                 | Example                  |
| ---------------- | -------------------- | ---------------- | ----------------------- | ------------------------ |
| $\equiv$         | Congruent/Equivalent | `\equiv`         | Equal in specific sense | $a \equiv b \pmod{n}$    |
| $\sim$           | Equivalent/Similar   | `\sim`           | Related by equivalence  | $x \sim y$               |
| $\approx$        | Approximately        | `\approx`        | Nearly equal            | $\sqrt{2} \approx 1.414$ |
| $\doteq$         | Equal by definition  | `\doteq`         | Defined to be equal     |                          |
| $\overset{?}{=}$ | Equal?               | `\overset{?}{=}` | Checking if equal       |                          |

---

### Congruence (≡)

**LaTeX:** `\equiv`

**What it means:** Equality in a specific context or modulo some number.

**Modular arithmetic:**
$$17 \equiv 5 \pmod{12}$$
"17 is congruent to 5 modulo 12" (both give remainder 5 when divided by 12)

**Identity:**
$$\sin^2 \theta + \cos^2 \theta \equiv 1$$
"This is identically true for all θ."

---

## Common Combinations

| Expression            | Meaning                                       |
| --------------------- | --------------------------------------------- |
| $a \leq x \leq b$     | x is between a and b (inclusive)              |
| $a < x < b$           | x is strictly between a and b                 |
| $x \approx y$         | x is approximately equal to y                 |
| $x \propto y$         | x is proportional to y                        |
| $x \sim y$            | x is of the same order as y                   |
| $x \equiv y \pmod{n}$ | x and y have same remainder when divided by n |
| $x \neq y$            | x is not equal to y                           |
| $x \ll y$             | x is much smaller than y                      |
| $x \gg y$             | x is much larger than y                       |

---

## Chained Relations

You can chain multiple relations together:

$$a < b \leq c < d$$
"a is less than b, which is less than or equal to c, which is less than d."

**Example:**
$$0 < x \leq 10$$
"x is greater than 0 and at most 10."

**Valid chains:**

- $a = b = c$ (all equal)
- $a < b < c$ (strictly increasing)
- $a \leq b \leq c$ (non-decreasing)
- $a > b > c$ (strictly decreasing)

**Invalid chains:**

- $a < b > c$ (don't mix directions)
- $a = b \neq c$ (contradictory)

---

## Relations in Different Contexts

### In Arithmetic

- $=$ : Two numbers have the same value
- $<$, $>$ : Comparing magnitudes

### In Algebra

- $=$ : Two expressions are equivalent
- $\equiv$ : Identically equal (for all values)

### In Geometry

- $\cong$ : Congruent (same shape and size)
- $\sim$ : Similar (same shape, proportional size)

### In Set Theory

- $\subseteq$ : Subset
- $\supseteq$ : Superset
- $\in$ : Element of (see [Sets](sets.md))

### In Calculus

- $\rightarrow$ : Approaches (limit)
- $\sim$ : Asymptotic to
- $\propto$ : Varies as

---

## Reading Relations Aloud

| Symbol    | Read as                                 |
| --------- | --------------------------------------- |
| $=$       | "equals" or "is equal to"               |
| $\neq$    | "is not equal to"                       |
| $\approx$ | "is approximately"                      |
| $<$       | "is less than"                          |
| $>$       | "is greater than"                       |
| $\leq$    | "is less than or equal to"              |
| $\geq$    | "is greater than or equal to"           |
| $\ll$     | "is much less than"                     |
| $\gg$     | "is much greater than"                  |
| $\propto$ | "is proportional to"                    |
| $\equiv$  | "is congruent to" or "is equivalent to" |
| $\sim$    | "is similar to" or "is of order"        |
| $\cong$   | "is congruent to"                       |
