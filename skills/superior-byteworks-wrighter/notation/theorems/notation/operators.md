# Mathematical Operators

> **No math background needed.** Operators are the verbs of mathematics — they tell you what action to perform. This page covers every common operator, from basic arithmetic to advanced calculus operations.

Operators are the action words of mathematics. They tell you what to do with numbers, variables, and expressions.

---

## Basic Arithmetic Operators

| Symbol   | Name       | LaTeX    | What It Does                 | Example                                |
| -------- | ---------- | -------- | ---------------------------- | -------------------------------------- |
| $+$      | Plus       | `+`      | Addition                     | $3 + 5 = 8$                            |
| $-$      | Minus      | `-`      | Subtraction                  | $8 - 3 = 5$                            |
| $\times$ | Times      | `\times` | Multiplication               | $4 \times 5 = 20$                      |
| $\cdot$  | Dot        | `\cdot`  | Multiplication (alternative) | $4 \cdot 5 = 20$                       |
| $\div$   | Divided by | `\div`   | Division                     | $20 \div 4 = 5$                        |
| $/$      | Slash      | `/`      | Division                     | $20 / 4 = 5$                           |
| $-$      | Negative   | `-`      | Makes a number negative      | $-5$ is negative five                  |
| $\pm$    | Plus-minus | `\pm`    | Both plus and minus          | $x = 2 \pm 1$ means $x = 3$ or $x = 1$ |
| $\mp$    | Minus-plus | `\mp`    | Both minus and plus          | Used with $\pm$ in formulas            |

---

## Detailed Explanations

### Addition (+)

**LaTeX:** `+`

**What it does:** Combines two quantities into their total.

**When to use:** When you need to find the total of two or more numbers.

**Example:**
$$3 + 5 = 8$$
"If you have 3 apples and get 5 more, you have 8 apples total."

**Properties:**

- **Commutative**: $a + b = b + a$ (order doesn't matter)
- **Associative**: $(a + b) + c = a + (b + c)$ (grouping doesn't matter)
- **Identity**: $a + 0 = a$ (adding zero changes nothing)

---

### Subtraction (−)

**LaTeX:** `-`

**What it does:** Finds the difference between two quantities.

**When to use:** When you need to find how much more one number is than another, or when removing quantities.

**Example:**
$$8 - 3 = 5$$
"If you have 8 apples and eat 3, you have 5 left."

**Important note:** Subtraction is **not** commutative. $8 - 3 \neq 3 - 8$.

---

### Multiplication (× or ·)

**LaTeX:** `\times` or `\cdot`

**What it does:** Repeated addition. $4 \times 5$ means $5 + 5 + 5 + 5$.

**When to use:** When you need to scale a number, find area, or calculate totals from groups.

**Example:**
$$4 \times 5 = 20$$
"If you have 4 boxes with 5 apples each, you have 20 apples total."

**Notation choices:**

- $\times$ is common in elementary math and cross products
- $\cdot$ is common in algebra and higher math
- In algebra, we often just write $ab$ to mean $a \times b$

**Properties:**

- **Commutative**: $a \times b = b \times a$
- **Associative**: $(a \times b) \times c = a \times (b \times c)$
- **Identity**: $a \times 1 = a$
- **Zero**: $a \times 0 = 0$

---

### Division (÷ or /)

**LaTeX:** `\div` or `/`

**What it does:** Splitting into equal parts. $20 \div 4$ asks "how many groups of 4 make 20?"

**When to use:** When distributing quantities evenly or finding rates.

**Example:**
$$20 \div 4 = 5$$
"If you divide 20 apples among 4 people, each gets 5."

**Important note:** Division by zero is undefined. You cannot divide by zero.

---

### Plus-Minus (±)

**LaTeX:** `\pm`

**What it does:** Indicates two values: one with plus, one with minus.

**When to use:** When a formula gives two solutions, or when expressing error margins.

**Example:**
$$x = 2 \pm 1$$
This means $x = 3$ OR $x = 1$.

**Common use:** The quadratic formula:
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

---

## Advanced Operators

| Symbol                  | Name               | LaTeX         | What It Does                            | Example                         |
| ----------------------- | ------------------ | ------------- | --------------------------------------- | ------------------------------- |
| $\sum$                  | Summation          | `\sum`        | Add a sequence                          | $\sum_{i=1}^{5} i = 15$         |
| $\prod$                 | Product            | `\prod`       | Multiply a sequence                     | $\prod_{i=1}^{5} i = 120$       |
| $\int$                  | Integral           | `\int`        | Area under curve                        | $\int_0^1 x^2 dx = \frac{1}{3}$ |
| $\oint$                 | Contour integral   | `\oint`       | Integral around closed path             | $\oint_C f(z) dz$               |
| $\partial$              | Partial derivative | `\partial`    | Derivative with respect to one variable | $\frac{\partial f}{\partial x}$ |
| $\nabla$                | Nabla/Del          | `\nabla`      | Gradient, divergence, curl              | $\nabla f$                      |
| $\sqrt{\phantom{x}}$    | Square root        | `\sqrt{x}`    | Number that squares to x                | $\sqrt{16} = 4$                 |
| $\sqrt[n]{\phantom{x}}$ | nth root           | `\sqrt[n]{x}` | Number that to power n gives x          | $\sqrt[3]{8} = 2$               |
| $!$                     | Factorial          | `!`           | Multiply all positive integers up to n  | $5! = 120$                      |
| $\%$                    | Percent            | `\%`          | Per hundred                             | $50\% = 0.5$                    |

---

### Summation (Σ)

**LaTeX:** `\sum` (display: `\sum_{i=1}^{n}`)

**What it does:** Adds up a sequence of terms.

**Structure:**
$$\sum_{i=1}^{n} a_i = a_1 + a_2 + a_3 + ... + a_n$$

**Parts:**

- $i = 1$: Starting value of index
- $n$: Ending value
- $a_i$: The term being summed

**Example:**
$$\sum_{i=1}^{5} i = 1 + 2 + 3 + 4 + 5 = 15$$

**When to use:** When adding many similar terms, especially in statistics and series.

---

### Product (Π)

**LaTeX:** `\prod` (display: `\prod_{i=1}^{n}`)

**What it does:** Multiplies a sequence of terms.

**Structure:**
$$\prod_{i=1}^{n} a_i = a_1 \times a_2 \times a_3 \times ... \times a_n$$

**Example:**
$$\prod_{i=1}^{5} i = 1 \times 2 \times 3 \times 4 \times 5 = 120 = 5!$$

**When to use:** When multiplying many terms, especially in probability and combinatorics.

---

### Integral (∫)

**LaTeX:** `\int` (display: `\int_a^b`)

**What it does:** Calculates the area under a curve (or more generally, accumulation).

**Structure:**
$$\int_a^b f(x) \, dx$$

**Parts:**

- $a$: Lower limit
- $b$: Upper limit
- $f(x)$: Function being integrated
- $dx$: Variable of integration

**Example:**
$$\int_0^1 x^2 \, dx = \frac{1}{3}$$
"The area under the curve $y = x^2$ from 0 to 1 is one-third."

**When to use:** Calculus, physics, probability, any situation involving continuous accumulation.

---

### Square Root (√)

**LaTeX:** `\sqrt{x}` for square root, `\sqrt[n]{x}` for nth root

**What it does:** Finds the number that, when multiplied by itself, gives the original.

**Example:**
$$\sqrt{16} = 4 \text{ because } 4 \times 4 = 16$$

$$\sqrt[3]{8} = 2 \text{ because } 2 \times 2 \times 2 = 8$$

**When to use:** Solving equations, distances (Pythagorean theorem), standard deviations.

---

### Factorial (!)

**LaTeX:** `!`

**What it does:** Multiplies all positive integers from 1 up to that number.

**Definition:**
$$n! = n \times (n-1) \times (n-2) \times ... \times 2 \times 1$$

**Example:**
$$5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$$

**Special case:** $0! = 1$ (by definition)

**When to use:** Counting permutations, combinations, probability.

---

## Operator Precedence

When multiple operators appear together, they execute in a specific order:

1. **Parentheses** (innermost first)
2. **Exponents** and roots
3. **Multiplication** and **division** (left to right)
4. **Addition** and **subtraction** (left to right)

**Memory aid:** PEMDAS (Please Excuse My Dear Aunt Sally)

- **P**arentheses
- **E**xponents
- **M**ultiplication and **D**ivision
- **A**ddition and **S**ubtraction

**Example:**
$$3 + 4 \times 5 = 3 + 20 = 23$$
NOT $(3 + 4) \times 5 = 35$

With parentheses:
$$(3 + 4) \times 5 = 7 \times 5 = 35$$

---

## Common Combinations

| Expression                  | Meaning                            |
| --------------------------- | ---------------------------------- |
| $a + b - c$                 | Add a and b, then subtract c       |
| $a \times b \div c$         | Multiply a and b, then divide by c |
| $a(b + c)$                  | Multiply a by the sum of b and c   |
| $\frac{a + b}{c}$           | Add a and b, then divide by c      |
| $\sum_{i=1}^{n} i^2$        | Sum of squares from 1 to n         |
| $\prod_{i=1}^{n} (1 + r_i)$ | Compound growth calculation        |
| $\sqrt{a^2 + b^2}$          | Pythagorean theorem (hypotenuse)   |
| $\int_0^\infty e^{-x} dx$   | Area under exponential decay curve |

---

## LaTeX Tips

**Display style (larger, on its own line):**

```latex
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$
```

**Inline style (smaller, within text):**

```latex
The sum $\sum_{i=1}^{n} i$ equals $\frac{n(n+1)}{2}$.
```

**Multiple integrals:**

```latex
$$\iint_D f(x,y) \, dx \, dy$$
$$\iiint_V f(x,y,z) \, dx \, dy \, dz$$
```

**Limits on integrals:**

```latex
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```
