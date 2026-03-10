# Set Theory Notation

> **No math background needed.** A set is just a collection of things. This page explains every set symbol with everyday analogies and concrete examples.

Set theory is the foundation of modern mathematics. A set is simply a collection of distinct objects, called elements or members.

---

## What Is a Set?

Think of a set like a box containing items. The items don't need to be related in any way except that they're in the same box.

**Examples of sets:**

- The set of primary colors: {red, blue, yellow}
- The set of even numbers: {2, 4, 6, 8, ...}
- The set of students in a classroom
- The empty set: {} (a box with nothing in it)

---

## Basic Set Symbols

| Symbol      | Name              | LaTeX                        | Meaning               | Example                        |
| ----------- | ----------------- | ---------------------------- | --------------------- | ------------------------------ |
| $\in$       | Element of        | `\in`                        | Is a member of        | $2 \in \{1, 2, 3\}$            |
| $\notin$    | Not element of    | `\notin`                     | Is not a member of    | $4 \notin \{1, 2, 3\}$         |
| $\ni$       | Contains          | `\ni`                        | Set contains element  | $\{1, 2, 3\} \ni 2$            |
| $\subset$   | Subset            | `\subset`                    | Contained in (proper) | $\{1, 2\} \subset \{1, 2, 3\}$ |
| $\subseteq$ | Subset or equal   | `\subseteq`                  | Contained in          | $\{1, 2\} \subseteq \{1, 2\}$  |
| $\supset$   | Superset          | `\supset`                    | Contains (proper)     | $\{1, 2, 3\} \supset \{1, 2\}$ |
| $\supseteq$ | Superset or equal | `\supseteq`                  | Contains              | $\{1, 2\} \supseteq \{1, 2\}$  |
| $\emptyset$ | Empty set         | `\emptyset` or `\varnothing` | Set with no elements  | $A = \emptyset$                |
| $\{\}$      | Empty set         | `\{\}`                       | Alternative notation  | $A = \{\}$                     |

---

## Detailed Explanations

### Element Of (∈)

**LaTeX:** `\in`

**What it means:** The object on the left is a member of the set on the right.

**Memory aid:** Think of it as "in" — the element is IN the set.

**Example:**
$$2 \in \{1, 2, 3\}$$
"Two is an element of the set containing one, two, and three."

$$\text{red} \in \{\text{colors of the rainbow}\}$$
"Red is in the set of rainbow colors."

---

### Not Element Of (∉)

**LaTeX:** `\notin`

**What it means:** The object is NOT in the set.

**Example:**
$$4 \notin \{1, 2, 3\}$$
"Four is not an element of the set {1, 2, 3}."

---

### Subset (⊆)

**LaTeX:** `\subseteq` (or `\subset` for proper subset)

**What it means:** Every element of the left set is also in the right set.

**Proper vs. improper:**

- $\subset$ (or $\subsetneq$): Proper subset — strictly smaller
- $\subseteq$: Subset — could be equal

**Example:**
$$\{1, 2\} \subseteq \{1, 2, 3\}$$
"The set {1, 2} is a subset of {1, 2, 3}."

$$\{1, 2\} \subseteq \{1, 2\}$$
"A set is always a subset of itself."

**Visual:** If A ⊆ B, then A is entirely inside B.

---

### Superset (⊇)

**LaTeX:** `\supseteq` (or `\supset` for proper superset)

**What it means:** The left set contains all elements of the right set.

**Example:**
$$\{1, 2, 3\} \supseteq \{1, 2\}$$
"{1, 2, 3} is a superset of {1, 2}."

**Note:** A ⊇ B is the same as B ⊆ A.

---

### Empty Set (∅)

**LaTeX:** `\emptyset` or `\varnothing`

**What it means:** The set with no elements.

**Important facts:**

- The empty set is a subset of every set
- The empty set is unique (there's only one)
- $|\emptyset| = 0$ (it has zero elements)

**Example:**
$$A = \emptyset$$
"A is the empty set."

$$\emptyset \subseteq S \text{ for any set } S$$
"The empty set is a subset of every set."

---

## Set Operations

| Symbol         | Name                 | LaTeX          | Meaning                          | Example         |
| -------------- | -------------------- | -------------- | -------------------------------- | --------------- |
| $\cup$         | Union                | `\cup`         | All elements in either set       | $A \cup B$      |
| $\cap$         | Intersection         | `\cap`         | Elements in both sets            | $A \cap B$      |
| $\setminus$    | Set difference       | `\setminus`    | Elements in first but not second | $A \setminus B$ |
| $\triangle$    | Symmetric difference | `\triangle`    | Elements in exactly one set      | $A \triangle B$ |
| $\times$       | Cartesian product    | `\times`       | All ordered pairs                | $A \times B$    |
| $\complement$  | Complement           | `\complement`  | Elements not in the set          | $A^\complement$ |
| $'$            | Complement           | `'`            | Alternative notation             | $A'$            |
| $\overline{A}$ | Complement           | `\overline{A}` | Alternative notation             | $\overline{A}$  |

---

### Union (∪)

**LaTeX:** `\cup`

**What it means:** All elements that are in A OR in B (or both).

**Example:**
$$\{1, 2, 3\} \cup \{3, 4, 5\} = \{1, 2, 3, 4, 5\}$$
"The union contains every element that appears in either set."

**Memory aid:** The symbol looks like a cup — it holds everything from both sets.

**Visual:** Think of merging two circles in a Venn diagram.

---

### Intersection (∩)

**LaTeX:** `\cap`

**What it means:** Only elements that are in BOTH A AND B.

**Example:**
$$\{1, 2, 3\} \cap \{3, 4, 5\} = \{3\}$$
"The intersection contains only elements that appear in both sets."

**Memory aid:** The symbol looks like a cap — it covers only the overlap.

**Visual:** Think of the overlapping region in a Venn diagram.

**Disjoint sets:** If $A \cap B = \emptyset$, the sets have no elements in common.

---

### Set Difference (\)

**LaTeX:** `\setminus`

**What it means:** Elements that are in A but NOT in B.

**Example:**
$$\{1, 2, 3, 4\} \setminus \{3, 4, 5\} = \{1, 2\}$$
"Remove from the first set any elements that appear in the second."

**Note:** $A \setminus B \neq B \setminus A$ (order matters!)

---

### Complement

**LaTeX:** `A^\complement` or `\overline{A}` or `A'`

**What it means:** All elements NOT in A (relative to some universal set).

**Example:**
If the universal set is $\{1, 2, 3, 4, 5\}$ and $A = \{1, 2, 3\}$:
$$A^\complement = \{4, 5\}$$
"The complement contains everything in the universal set that's not in A."

---

## Common Number Sets

| Symbol                       | Name             | LaTeX        | Contains                       | Example                      |
| ---------------------------- | ---------------- | ------------ | ------------------------------ | ---------------------------- |
| $\mathbb{N}$                 | Natural numbers  | `\mathbb{N}` | 1, 2, 3, ... (or 0, 1, 2, ...) | $5 \in \mathbb{N}$           |
| $\mathbb{Z}$                 | Integers         | `\mathbb{Z}` | ..., -2, -1, 0, 1, 2, ...      | $-3 \in \mathbb{Z}$          |
| $\mathbb{Q}$                 | Rational numbers | `\mathbb{Q}` | Fractions p/q                  | $\frac{1}{2} \in \mathbb{Q}$ |
| $\mathbb{R}$                 | Real numbers     | `\mathbb{R}` | All decimal numbers            | $\sqrt{2} \in \mathbb{R}$    |
| $\mathbb{C}$                 | Complex numbers  | `\mathbb{C}` | a + bi                         | $3 + 4i \in \mathbb{C}$      |
| $\mathbb{P}$ or $\mathbb{P}$ | Prime numbers    | `\mathbb{P}` | 2, 3, 5, 7, 11, ...            | $7 \in \mathbb{P}$           |

---

### Natural Numbers (ℕ)

**LaTeX:** `\mathbb{N}`

**What it contains:** Counting numbers. Usually {1, 2, 3, ...}, though some definitions include 0.

**Example:**
$$\mathbb{N} = \{1, 2, 3, 4, 5, ...\}$$
"The natural numbers are the positive whole numbers."

**Note:** Whether 0 ∈ ℕ depends on the convention being used.

---

### Integers (ℤ)

**LaTeX:** `\mathbb{Z}` (from German "Zahlen" meaning numbers)

**What it contains:** All whole numbers, positive, negative, and zero.

**Example:**
$$\mathbb{Z} = \{..., -3, -2, -1, 0, 1, 2, 3, ...\}$$
"The integers include negative numbers, zero, and positive numbers."

**Subsets:**

- $\mathbb{Z}^+$: Positive integers
- $\mathbb{Z}^-$: Negative integers
- $\mathbb{Z}_{\geq 0}$: Non-negative integers

---

### Rational Numbers (ℚ)

**LaTeX:** `\mathbb{Q}` (from "quotient")

**What it contains:** Any number that can be written as a fraction p/q where p and q are integers and q ≠ 0.

**Example:**
$$\frac{1}{2} \in \mathbb{Q}, \quad -\frac{3}{4} \in \mathbb{Q}, \quad 5 = \frac{5}{1} \in \mathbb{Q}$$
"Rational numbers include all fractions and integers."

**Important:** Decimals that terminate or repeat are rational.

- $0.5 = \frac{1}{2}$ ✓
- $0.333... = \frac{1}{3}$ ✓

---

### Real Numbers (ℝ)

**LaTeX:** `\mathbb{R}`

**What it contains:** All numbers on the number line. Includes rationals and irrationals.

**Example:**
$$\sqrt{2} \in \mathbb{R}, \quad \pi \in \mathbb{R}, \quad -5.7 \in \mathbb{R}$$
"Real numbers include all decimal numbers, whether they terminate, repeat, or go on forever without repeating."

**Irrational numbers:** Real numbers that aren't rational, like $\sqrt{2}$ and $\pi$.

---

### Complex Numbers (ℂ)

**LaTeX:** `\mathbb{C}`

**What it contains:** Numbers of the form a + bi, where a and b are real and i² = −1.

**Example:**
$$3 + 4i \in \mathbb{C}, \quad 5 = 5 + 0i \in \mathbb{C}, \quad 2i = 0 + 2i \in \mathbb{C}$$
"Complex numbers extend the real numbers by including imaginary numbers."

---

## Set Builder Notation

Instead of listing all elements, we describe the property that defines them.

**Syntax:**
$$\{x \in S \mid P(x)\}$$
"The set of all x in S such that P(x) is true."

**Examples:**

| Set                                           | Description                  | Meaning                         |
| --------------------------------------------- | ---------------------------- | ------------------------------- |
| $\{x \in \mathbb{R} \mid x > 0\}$             | Positive real numbers        | All real numbers greater than 0 |
| $\{n \in \mathbb{Z} \mid n \text{ is even}\}$ | Even integers                | ..., -4, -2, 0, 2, 4, ...       |
| $\{x \in \mathbb{N} \mid x < 10\}$            | Natural numbers less than 10 | {1, 2, 3, 4, 5, 6, 7, 8, 9}     |
| $\{x^2 \mid x \in \mathbb{Z}\}$               | Perfect squares              | {0, 1, 4, 9, 16, 25, ...}       |

**LaTeX:**

```latex
$$\{x \in \mathbb{R} \mid x > 0\}$$
$$\{n \in \mathbb{Z} \mid n \text{ is even}\}$$
```

---

## Cardinality and Size

| Symbol      | Name        | LaTeX      | Meaning                        |
| ----------- | ----------- | ---------- | ------------------------------ |
| $|A|$ | Cardinality | `|A|` | Number of elements in set |
| $\#A$ | Cardinality | `\#A` | Alternative notation |
| $\aleph_0$ | Aleph-null | `\aleph_0` | Cardinality of natural numbers |
| $2^{|A|}$ | Power set size | `2^{|A|}` | Number of subsets of A |

**Example:**
$$|\{1, 2, 3\}| = 3$$
"The set {1, 2, 3} has 3 elements."

$$|\emptyset| = 0$$
"The empty set has zero elements."

---

## Common Set Relationships

| Expression       | Meaning                                       |
| ---------------- | --------------------------------------------- |
| $x \in A$ | x is an element of A |
| $A \subseteq B$ | A is a subset of B |
| $A \subset B$ | A is a proper subset of B |
| $A \cup B$ | Union: elements in A or B |
| $A \cap B$ | Intersection: elements in both |
| $A \setminus B$ | Difference: elements in A but not B |
| $A \triangle B$ | Symmetric difference: elements in exactly one |
| $A \times B$ | Cartesian product: all pairs (a, b) |
| $A^\complement$ | Complement: elements not in A |
| $\mathcal{P}(A)$ | Power set: all subsets of A |
| $|A|$ | Cardinality: number of elements in A |

---

## Venn Diagram Regions

For two sets A and B:

| Region       | Expression                                | Description            |
| ------------ | ----------------------------------------- | ---------------------- |
| Only A       | $A \setminus B$ or $A \cap B^\complement$ | In A but not B         |
| Only B       | $B \setminus A$ or $B \cap A^\complement$ | In B but not A         |
| Both         | $A \cap B$                                | In both A and B        |
| Neither      | $(A \cup B)^\complement$                  | In neither set         |
| At least one | $A \cup B$                                | In A or B or both      |
| Exactly one  | $A \triangle B$                           | In A or B but not both |

---

## LaTeX Tips for Sets

**Basic set notation:**

```latex
$$A = \{1, 2, 3, 4, 5\}$$
$$x \in A$$
$$B \subseteq A$$
```

**Set builder notation:**

```latex
$$\{x \in \mathbb{R} \mid x > 0\}$$
$$\{n^2 : n \in \mathbb{N}\}$$
```

**Common number sets:**

```latex
$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}$$
```

**Set operations:**

```latex
$$A \cup B \cap C$$
$$A \setminus (B \cup C)$$
$$A^\complement \cup B^\complement = (A \cap B)^\complement$$
```

**Large operators:**

```latex
$$\bigcup_{i=1}^{n} A_i$$
$$\bigcap_{i=1}^{n} A_i$$
```
