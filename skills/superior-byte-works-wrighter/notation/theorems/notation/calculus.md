# Calculus Notation

> **No math background needed.** Calculus is the mathematics of change and accumulation. This page explains every calculus symbol with real-world analogies — no prior calculus knowledge required.

Calculus is the mathematics of change. It provides tools to understand how quantities vary and accumulate.

---

## What Is Calculus?

Calculus has two main branches:

- **Differential calculus**: Studies rates of change (slopes, velocities)
- **Integral calculus**: Studies accumulation (areas, volumes, totals)

These two branches are connected by the Fundamental Theorem of Calculus.

---

## Limits

| Symbol        | Name       | LaTeX         | Meaning                    | Example               |
| ------------- | ---------- | ------------- | -------------------------- | --------------------- |
| $\lim$        | Limit      | `\lim`        | Value approached           | $\lim_{x \to a} f(x)$ |
| $\rightarrow$ | Approaches | `\rightarrow` | Tends toward               | $x \rightarrow a$     |
| $\to$         | To         | `\to`         | Alternative for approaches | $x \to a$             |
| $^+$          | From right | `^+`          | Right-hand limit           | $x \to a^+$           |
| $^-$          | From left  | `^-`          | Left-hand limit            | $x \to a^-$           |
| $\infty$      | Infinity   | `\infty`      | Unbounded                  | $\lim_{x \to \infty}$ |

---

### The Limit Concept

**LaTeX:** `\lim_{x \to a} f(x)`

**What it means:** The value that f(x) approaches as x gets arbitrarily close to a.

**Example:**
$$\lim_{x \to 2} x^2 = 4$$
"As x approaches 2, x squared approaches 4."

**Important:** The limit can exist even if f(a) is undefined or different.

**One-sided limits:**

- $\lim_{x \to a^+}$: Approach from the right (values greater than a)
- $\lim_{x \to a^-}$: Approach from the left (values less than a)

The limit exists only if both one-sided limits exist and are equal.

---

### Limits at Infinity

**LaTeX:** `\lim_{x \to \infty} f(x)`

**What it means:** The value f(x) approaches as x grows without bound.

**Example:**
$$\lim_{x \to \infty} \frac{1}{x} = 0$$
"As x gets larger and larger, 1/x gets closer and closer to 0."

$$\lim_{x \to \infty} \frac{2x + 1}{x} = 2$$
"As x approaches infinity, (2x+1)/x approaches 2."

---

## Derivatives

| Symbol          | Name                | LaTeX           | Meaning                           | Example                         |
| --------------- | ------------------- | --------------- | --------------------------------- | ------------------------------- |
| $'$             | Prime               | `'`             | Derivative                        | $f'(x)$                         |
| $\dot{x}$       | Dot                 | `\dot{x}`       | Time derivative                   | $\dot{x}(t)$                    |
| $\frac{dy}{dx}$ | Leibniz             | `\frac{dy}{dx}` | Derivative of y with respect to x | $\frac{dy}{dx}$                 |
| $\frac{d}{dx}$  | Derivative operator | `\frac{d}{dx}`  | Differentiate what follows        | $\frac{d}{dx}(x^2)$             |
| $\partial$      | Partial             | `\partial`      | Partial derivative                | $\frac{\partial f}{\partial x}$ |
| $\nabla$        | Nabla/Del           | `\nabla`        | Gradient                          | $\nabla f$                      |
| $f''(x)$        | Double prime        | `''`            | Second derivative                 | $f''(x)$                        |
| $f^{(n)}(x)$    | nth derivative      | `^{(n)}`        | nth derivative                    | $f^{(3)}(x)$                    |

---

### Prime Notation (Lagrange)

**LaTeX:** `f'(x)`

**What it means:** The derivative of f with respect to its variable.

**Example:**
If $f(x) = x^2$, then $f'(x) = 2x$.

**Higher derivatives:**

- $f'(x)$: First derivative (rate of change)
- $f''(x)$: Second derivative (rate of change of rate of change)
- $f'''(x)$: Third derivative
- $f^{(n)}(x)$: nth derivative

**When to use:** When the variable is clear from context.

---

### Leibniz Notation

**LaTeX:** `\frac{dy}{dx}`

**What it means:** The derivative of y with respect to x. The rate at which y changes when x changes.

**Example:**
If $y = x^2$, then $\frac{dy}{dx} = 2x$.

**Reading it:** "dy dx" or "the derivative of y with respect to x"

**Why it looks like a fraction:** It behaves like one in many ways (chain rule, substitution), though it's actually a limit.

**Second derivative:**
$$\frac{d^2y}{dx^2}$$
"The second derivative of y with respect to x."

---

### Dot Notation (Newton)

**LaTeX:** `\dot{x}`

**What it means:** Derivative with respect to time.

**Example:**

- $x(t)$: Position at time t
- $\dot{x}(t)$: Velocity (rate of change of position)
- $\ddot{x}(t)$: Acceleration (rate of change of velocity)

**When to use:** Physics and engineering, especially for time derivatives.

---

### Partial Derivatives

**LaTeX:** `\frac{\partial f}{\partial x}` or `\partial_x f`

**What it means:** The derivative of f with respect to x, treating other variables as constant.

**Example:**
If $f(x, y) = x^2 y + y^3$:
$$\frac{\partial f}{\partial x} = 2xy$$
"Treat y as a constant and differentiate with respect to x."

$$\frac{\partial f}{\partial y} = x^2 + 3y^2$$
"Treat x as a constant and differentiate with respect to y."

**When to use:** Functions of multiple variables.

---

### The Gradient (∇)

**LaTeX:** `\nabla f` or `\text{grad } f`

**What it means:** Vector of all partial derivatives. Points in the direction of steepest increase.

**Example:**
For $f(x, y) = x^2 + y^2$:
$$\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right) = (2x, 2y)$$

**In 3D:**
$$\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z}\right)$$

**Other uses of ∇:**

- **Divergence**: $\nabla \cdot \mathbf{F}$ (measures spreading out)
- **Curl**: $\nabla \times \mathbf{F}$ (measures rotation)
- **Laplacian**: $\nabla^2 f = \nabla \cdot \nabla f$

---

## Integrals

| Symbol        | Name              | LaTeX         | Meaning                     | Example                    |
| ------------- | ----------------- | ------------- | --------------------------- | -------------------------- |
| $\int$        | Integral          | `\int`        | Antiderivative or area      | $\int f(x) dx$             |
| $\int_a^b$    | Definite integral | `\int_a^b`    | Area from a to b            | $\int_0^1 x^2 dx$          |
| $\iint$       | Double integral   | `\iint`       | Area/volume in 2D           | $\iint_D f(x,y) dA$        |
| $\iiint$      | Triple integral   | `\iiint`      | Volume in 3D                | $\iiint_V f(x,y,z) dV$     |
| $\oint$       | Contour integral  | `\oint`       | Integral around closed path | $\oint_C f(z) dz$          |
| $dx$          | Differential      | `dx`          | Variable of integration     | $\int f(x) dx$             |
| $\mathrm{d}x$ | Upright d         | `\mathrm{d}x` | Alternative notation        | $\int f(x) \, \mathrm{d}x$ |

---

### Indefinite Integral

**LaTeX:** `\int f(x) dx`

**What it means:** The antiderivative — a function whose derivative is f(x). Includes an arbitrary constant C.

**Example:**
$$\int x^2 dx = \frac{x^3}{3} + C$$
"The integral of x squared is x cubed over three, plus a constant."

**Why +C?** Because the derivative of any constant is zero, many functions have the same derivative.

---

### Definite Integral

**LaTeX:** `\int_a^b f(x) dx`

**What it means:** The area under the curve f(x) from x = a to x = b.

**Example:**
$$\int_0^1 x^2 dx = \frac{1}{3}$$
"The area under the curve y = x² from 0 to 1 equals one-third."

**Fundamental Theorem of Calculus:**
$$\int_a^b f(x) dx = F(b) - F(a)$$
where F is any antiderivative of f.

**Notation:**
$$\left[\frac{x^3}{3}\right]_0^1 = \frac{1}{3} - 0 = \frac{1}{3}$$

---

### Multiple Integrals

**Double integral (LaTeX: `\iint`):**
$$\iint_D f(x, y) \, dA$$
"Integrate f over the region D in the plane."

**Triple integral (LaTeX: `\iiint`):**
$$\iiint_V f(x, y, z) \, dV$$
"Integrate f over the volume V."

**Example:**
$$\iint_{[0,1]\times[0,1]} xy \, dx \, dy = \frac{1}{4}$$

---

### Contour Integral

**LaTeX:** `\oint`

**What it means:** Integral around a closed path or curve.

**Example:**
$$\oint_C f(z) \, dz$$
"Integrate f around the closed contour C."

**Important in:** Complex analysis, electromagnetism, fluid dynamics.

---

## Differential Notation

| Symbol     | Name              | LaTeX      | Meaning                   |
| ---------- | ----------------- | ---------- | ------------------------- |
| $dx$       | Differential      | `dx`       | Infinitesimal change in x |
| $dy$       | Differential      | `dy`       | Infinitesimal change in y |
| $\Delta x$ | Delta x           | `\Delta x` | Finite change in x        |
| $\Delta y$ | Delta y           | `\Delta y` | Finite change in y        |
| $\delta x$ | Small delta x     | `\delta x` | Small change in x         |
| $df$       | Differential of f | `df`       | Total differential        |

---

### Differentials

**LaTeX:** `dx`, `dy`, `df`

**What they mean:** Infinitesimally small changes in variables.

**Relationship:**
$$dy = \frac{dy}{dx} dx = f'(x) dx$$

**Example:**
If $y = x^2$, then $dy = 2x \, dx$.

**When to use:** Linear approximations, differential equations, integration.

---

### Delta vs. d

| Notation   | Meaning               | Example                             |
| ---------- | --------------------- | ----------------------------------- |
| $\Delta x$ | Actual, finite change | $\Delta x = x_2 - x_1$              |
| $dx$       | Infinitesimal change  | Used in derivatives and integrals   |
| $\Delta y$ | Actual change in y    | $\Delta y = f(x + \Delta x) - f(x)$ |
| $dy$       | Approximate change    | $dy = f'(x) dx$                     |

**Approximation:**
$$\Delta y \approx dy = f'(x) \Delta x$$
(for small $\Delta x$)

---

## Common Calculus Expressions

| Expression                                                | Meaning                             |
| --------------------------------------------------------- | ----------------------------------- |
| $\frac{dy}{dx} = 0$                                       | Horizontal tangent (critical point) |
| $\frac{d^2y}{dx^2} > 0$                                   | Concave up (local minimum)          |
| $\frac{d^2y}{dx^2} < 0$                                   | Concave down (local maximum)        |
| $\int f'(x) dx = f(x) + C$                                | Antiderivative                      |
| $\frac{d}{dx} \int_a^x f(t) dt = f(x)$                    | Fundamental Theorem (Part 1)        |
| $\int_a^b f(x) dx = F(b) - F(a)$                          | Fundamental Theorem (Part 2)        |
| $\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$                  | Definition of derivative            |
| $\sum_{i=1}^{n} f(x_i) \Delta x \approx \int_a^b f(x) dx$ | Riemann sum approximation           |

---

## Applications

### Derivatives

| Application   | Meaning                    | Example                                    |
| ------------- | -------------------------- | ------------------------------------------ |
| Velocity      | Rate of change of position | $v(t) = \frac{dx}{dt}$                     |
| Acceleration  | Rate of change of velocity | $a(t) = \frac{dv}{dt} = \frac{d^2x}{dt^2}$ |
| Slope         | Rate of change of function | $m = \frac{dy}{dx}$                        |
| Marginal cost | Cost of one more unit      | $\frac{dC}{dq}$                            |
| Growth rate   | Relative rate of change    | $\frac{1}{P}\frac{dP}{dt}$                 |

### Integrals

| Application    | Meaning                 | Example                                               |
| -------------- | ----------------------- | ----------------------------------------------------- |
| Area           | Under curve             | $A = \int_a^b f(x) dx$                                |
| Volume         | Solid of revolution     | $V = \pi \int_a^b [f(x)]^2 dx$                        |
| Work           | Force over distance     | $W = \int F(x) dx$                                    |
| Center of mass | Average position        | $\bar{x} = \frac{\int x \rho(x) dx}{\int \rho(x) dx}$ |
| Probability    | Cumulative distribution | $P(a \leq X \leq b) = \int_a^b f(x) dx$               |
| Total change   | Accumulated quantity    | $\Delta Q = \int_{t_1}^{t_2} \frac{dQ}{dt} dt$        |

---

## Special Notation

| Symbol                                       | Name          | LaTeX                                        | Meaning                             |
| -------------------------------------------- | ------------- | -------------------------------------------- | ----------------------------------- | -------- | ----------------------------- |
| $\frac{\partial^2 f}{\partial x \partial y}$ | Mixed partial | `\frac{\partial^2 f}{\partial x \partial y}` | Differentiate first by y, then by x |
| $\left.\frac{dy}{dx}\right                   | \_{x=a}$      | Evaluated at                                 | `\left.\frac{dy}{dx}\right          | \_{x=a}` | Derivative evaluated at x = a |
| $\frac{\partial(f, g)}{\partial(x, y)}$      | Jacobian      |                                              | Matrix of partial derivatives       |
| $\int f(x) \, dx$                            | Spacing       | `\,` before dx                               | Proper spacing in integrals         |
| $\mathrm{d}x$                                | Upright d     | `\mathrm{d}x`                                | Some style guides prefer this       |

---

## LaTeX Tips for Calculus

**Limits:**

```latex
$$\lim_{x \to \infty} \frac{1}{x} = 0$$
$$\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$
$$\lim_{x \to a^+} f(x) \neq \lim_{x \to a^-} f(x)$$
```

**Derivatives:**

```latex
$$f'(x) = \frac{d}{dx}f(x) = \frac{df}{dx}$$
$$\frac{d^2y}{dx^2} = \frac{d}{dx}\left(\frac{dy}{dx}\right)$$
$$\dot{x} = \frac{dx}{dt}, \quad \ddot{x} = \frac{d^2x}{dt^2}$$
```

**Partial derivatives:**

```latex
$$\frac{\partial f}{\partial x}, \quad \frac{\partial^2 f}{\partial x^2}, \quad \frac{\partial^2 f}{\partial x \partial y}$$
$$\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z}\right)$$
```

**Integrals:**

```latex
$$\int f(x) \, dx = F(x) + C$$
$$\int_a^b f(x) \, dx = F(b) - F(a) = \left[F(x)\right]_a^b$$
$$\iint_D f(x,y) \, dA, \quad \iiint_V f(x,y,z) \, dV$$
$$\oint_C \mathbf{F} \cdot d\mathbf{r}$$
```

**Differentials:**

```latex
$$dy = \frac{dy}{dx} dx = f'(x) dx$$
$$df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy$$
```

**Evaluated at:**

```latex
$$\left.\frac{d}{dx}(x^3)\right|_{x=2} = 12$$
```
