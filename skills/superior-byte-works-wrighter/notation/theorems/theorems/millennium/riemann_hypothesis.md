# Riemann Hypothesis

> **Status**: 🔴 UNSOLVED — Open since 1859
> **Prize**: $1,000,000 (Clay Mathematics Institute)
> **Field**: Analytic Number Theory, Complex Analysis

---

## ## Plain English Statement

The prime numbers — 2, 3, 5, 7, 11, 13, … — appear scattered among the integers with no obvious pattern. Yet there is a hidden regularity: the **Riemann zeta function** encodes the distribution of primes as a complex-analytic object.

The Riemann Hypothesis says: **all the "interesting" zeros of this function lie on a single vertical line** in the complex plane — the line where the real part equals exactly one-half.

Think of it this way: the zeta function has infinitely many zeros. Some are trivial (at negative even integers). The rest — the **non-trivial zeros** — are the ones that control how primes are distributed. Riemann conjectured in 1859 that every single one of these non-trivial zeros has real part $\tfrac{1}{2}$. No exceptions. Ever.

More than **10 trillion zeros** have been computed numerically. Every single one lies on the critical line. But no one has proven this must always be true.

---

## ## Formal Statement

Let $\zeta(s)$ be the Riemann zeta function, defined for $\text{Re}(s) > 1$ by:

$$\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}$$

and extended to all $s \in \mathbb{C} \setminus \{1\}$ by analytic continuation.

**The Riemann Hypothesis**: Every non-trivial zero $\rho$ of $\zeta(s)$ satisfies:

$$\boxed{\text{Re}(\rho) = \frac{1}{2}}$$

Equivalently, all non-trivial zeros lie on the **critical line** $\left\{ s \in \mathbb{C} : \text{Re}(s) = \tfrac{1}{2} \right\}$.

---

## ## Full Legend

| Symbol            | Meaning                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| $s$               | Complex variable $s = \sigma + it$, where $\sigma, t \in \mathbb{R}$    |
| $\sigma$          | Real part of $s$: $\sigma = \text{Re}(s)$                               |
| $t$               | Imaginary part of $s$: $t = \text{Im}(s)$                               |
| $\zeta(s)$        | Riemann zeta function                                                   |
| $n$               | Positive integer summation index                                        |
| $n^s$             | Complex power: $e^{s \ln n}$                                            |
| $\rho$            | A non-trivial zero of $\zeta$: a complex number where $\zeta(\rho) = 0$ |
| $\text{Re}(\rho)$ | Real part of the zero $\rho$                                            |
| Critical line     | The vertical line $\text{Re}(s) = \tfrac{1}{2}$ in the complex plane    |
| Critical strip    | The region $0 < \text{Re}(s) < 1$ where non-trivial zeros must lie      |
| Trivial zeros     | Zeros at $s = -2, -4, -6, \ldots$ (negative even integers)              |
| Non-trivial zeros | All other zeros; these lie in the critical strip                        |
| $\mathbb{C}$      | The complex numbers                                                     |
| $\mathbb{R}$      | The real numbers                                                        |

---

## ## The Euler Product and Primes

The zeta function has a deep connection to primes via the **Euler product formula** (valid for $\text{Re}(s) > 1$):

$$\zeta(s) = \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}$$

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $\prod$ | Infinite product over all primes |
| $p$ | A prime number (2, 3, 5, 7, 11, …) |
| $p^{-s}$ | Complex power $e^{-s \ln p}$ |

This product encodes **every prime** in the zeta function. The zeros of $\zeta$ are the "shadow" of the primes — and their location determines how regularly primes are distributed.

---

## ## The Prime Counting Function

Define $\pi(x)$ as the number of primes $\leq x$. The **Prime Number Theorem** (proved 1896) states:

$$\pi(x) \sim \frac{x}{\ln x} \quad \text{as } x \to \infty$$

The **explicit formula** (Riemann, 1859) gives the exact error:

$$\pi(x) = \text{Li}(x) - \sum_{\rho} \text{Li}(x^\rho) - \ln 2 + \int_x^\infty \frac{dt}{t(t^2-1)\ln t}$$

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $\pi(x)$ | Number of primes $\leq x$ (prime counting function) |
| $\text{Li}(x)$ | Logarithmic integral: $\int_2^x \frac{dt}{\ln t}$ |
| $\sum_\rho$ | Sum over all non-trivial zeros $\rho$ of $\zeta$ |
| $x^\rho$ | Complex power $e^{\rho \ln x}$ |

If the Riemann Hypothesis is true, the error in approximating $\pi(x)$ by $\text{Li}(x)$ is as small as possible:

$$|\pi(x) - \text{Li}(x)| = O(\sqrt{x} \ln x)$$

This is the **best possible** error bound. Without RH, the error could be much larger.

---

## ## The Functional Equation

The zeta function satisfies a remarkable symmetry:

$$\xi(s) = \xi(1-s)$$

where the **completed zeta function** is:

$$\xi(s) = \frac{1}{2} s(s-1) \pi^{-s/2} \Gamma\!\left(\frac{s}{2}\right) \zeta(s)$$

**Legend**:
| Symbol | Meaning |
|--------|---------|
| $\xi(s)$ | Completed (entire) zeta function |
| $\Gamma(s)$ | Euler gamma function: $\Gamma(n) = (n-1)!$ for positive integers |
| $\pi$ | The constant $\approx 3.14159\ldots$ (not the prime counting function here) |
| $s \mapsto 1-s$ | The symmetry that maps the critical strip to itself |

This symmetry means zeros come in **pairs**: if $\rho$ is a zero, so is $1 - \rho$. The critical line $\text{Re}(s) = \tfrac{1}{2}$ is the **fixed line** of this symmetry. RH says all zeros are fixed by this symmetry.

---

## ## Why It's Hard

### The zeros are transcendental

There is no algebraic formula for the zeros. They must be located by analysis, and the function's behavior is extraordinarily complex.

### Analytic continuation is subtle

The series $\sum n^{-s}$ only converges for $\text{Re}(s) > 1$. The zeros live in the region $0 < \text{Re}(s) < 1$ where the series _diverges_ — the function is defined there only by analytic continuation, making direct analysis difficult.

### No structural reason is known

We have no theorem that would force zeros onto the critical line. Every approach — spectral theory, random matrix theory, algebraic geometry — has yielded deep insights but no proof.

### Numerical evidence is not proof

Computing 10 trillion zeros on the line is impressive but proves nothing. The first counterexample could be at an astronomically large height $t$.

### Equivalent formulations resist proof

RH has hundreds of equivalent statements across mathematics. None has been easier to prove than the original.

---

## ## Key Equivalent Formulations

**1. Mertens function** (number theory):
$$M(x) = \sum_{n \leq x} \mu(n) = O(x^{1/2 + \varepsilon}) \text{ for all } \varepsilon > 0$$

where $\mu(n)$ is the Möbius function.

**2. Li's criterion** (1997):
$$\text{RH} \iff \lambda_n \geq 0 \text{ for all } n \geq 1$$

where $\lambda_n = \frac{1}{(n-1)!} \frac{d^n}{ds^n}\left[s^{n-1} \ln \xi(s)\right]_{s=1}$.

**3. Robin's inequality** (1984):
$$\text{RH} \iff \sigma(n) < e^\gamma n \ln \ln n \text{ for all } n > 5040$$

where $\sigma(n)$ is the sum of divisors of $n$ and $\gamma \approx 0.5772$ is the Euler–Mascheroni constant.

---

## ## History

| Year     | Event                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| **1737** | Euler discovers the product formula $\zeta(s) = \prod_p (1-p^{-s})^{-1}$ for real $s$                         |
| **1859** | Bernhard Riemann extends $\zeta$ to $\mathbb{C}$ and states the Hypothesis in his only paper on number theory |
| **1896** | Hadamard and de la Vallée Poussin prove the Prime Number Theorem (zeros not on $\text{Re}(s) = 1$)            |
| **1900** | Hilbert lists RH as Problem 8 on his famous list                                                              |
| **1914** | Hardy proves infinitely many zeros lie on the critical line                                                   |
| **1942** | Selberg proves a positive proportion of zeros lie on the critical line                                        |
| **1974** | Levinson shows at least $\tfrac{1}{3}$ of zeros are on the critical line                                      |
| **1989** | Conrey improves this to more than $\tfrac{2}{5}$                                                              |
| **2000** | Clay Mathematics Institute designates RH a Millennium Prize Problem                                           |
| **2004** | Gourdon & Demichel verify the first $10^{13}$ zeros are on the critical line                                  |
| **2026** | Still unsolved. Estimated $10^{13}+$ zeros verified; none off the line                                        |

---

## ## Connections to Other Mathematics

**Random Matrix Theory**: The statistical distribution of zeros of $\zeta$ matches the eigenvalue distribution of random Hermitian matrices (GUE). This suggests a hidden quantum-mechanical system whose eigenvalues are the zeros — but no such system has been found.

**Cryptography**: Many public-key cryptosystems rely on the difficulty of factoring large numbers. The distribution of primes (controlled by RH) underlies the security analysis of these systems.

**Physics**: The zeros of $\zeta$ may correspond to energy levels of a quantum chaotic system. This "Hilbert–Pólya conjecture" remains unproven but has driven decades of research.

**Algebraic geometry**: The Weil conjectures (proved by Deligne, 1974) are analogues of RH for finite fields. Deligne's proof uses deep algebraic geometry — but the techniques do not transfer to the classical case.

---

## ## Current Status

🔴 **UNSOLVED**

- No proof or disproof exists
- Considered by many mathematicians to be the most important unsolved problem in mathematics
- Hundreds of papers published annually on related topics
- Prize: **$1,000,000** from the Clay Mathematics Institute

> _"If I were to awaken after having slept for a thousand years, my first question would be: Has the Riemann Hypothesis been proven?"_
> — David Hilbert

---

_See also: [Index of Millennium Problems](index.md) · [Birch & Swinnerton-Dyer Conjecture](birch_swinnerton-dyer.md)_
