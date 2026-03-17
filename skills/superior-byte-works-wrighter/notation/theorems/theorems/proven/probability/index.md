---
name: Probability Theorems Index
description: Index of proven theorems in probability theory with LaTeX statements and explanations
version: 1.0.0
author: Omni Unified Writing
---

# Probability Theorems

Foundational theorems in probability theory, from the law of large numbers to measure-theoretic results.

---

## ## Laws of Large Numbers

### Weak Law of Large Numbers (Bernoulli, 1713; Chebyshev, 1867)

**Statement:** For i.i.d. random variables $X_1, X_2, \ldots$ with mean $\mu$ and finite variance $\sigma^2$, for any $\varepsilon > 0$:

$$\lim_{n \to \infty} P\!\left(\left|\bar{X}_n - \mu\right| > \varepsilon\right) = 0$$

where $\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i$.

**Plain English:** The sample mean converges in probability to the population mean. As $n \to \infty$, the probability of the sample mean being far from $\mu$ goes to zero.

**LaTeX:**

```latex
\lim_{n \to \infty} P\!\left(\left|\bar{X}_n - \mu\right| > \varepsilon\right) = 0
```

---

### Strong Law of Large Numbers (Kolmogorov, 1933)

**Statement:** For i.i.d. random variables $X_1, X_2, \ldots$ with $\mathbb{E}[|X_1|] < \infty$ and mean $\mu$:

$$P\!\left(\lim_{n \to \infty} \bar{X}_n = \mu\right) = 1$$

**Plain English:** The sample mean converges almost surely (with probability 1) to the population mean. Stronger than the weak law — the convergence is not just in probability but almost certain.

---

## ## Central Limit Theorem

### Classical CLT (Lindeberg-Lévy, 1922)

**Statement:** For i.i.d. random variables $X_1, X_2, \ldots$ with mean $\mu$ and variance $\sigma^2 < \infty$:

$$\frac{\bar{X}_n - \mu}{\sigma / \sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)$$

**Plain English:** The standardized sample mean converges in distribution to the standard normal, regardless of the original distribution. This is why the normal distribution appears everywhere in statistics.

**LaTeX:**

```latex
\frac{\bar{X}_n - \mu}{\sigma / \sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)
```

### Lindeberg-Feller CLT (generalization)

**Statement:** For independent (not necessarily identically distributed) random variables $X_1, \ldots, X_n$ satisfying the Lindeberg condition, the normalized sum converges to $\mathcal{N}(0,1)$.

**Significance:** Explains why the CLT holds even when observations come from different distributions, as long as no single observation dominates.

---

## ## Bayes' Theorem

**Statement:** For events $A$ and $B$ with $P(B) > 0$:

$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$$

**Continuous form:** For random variables $X$ (parameter) and $Y$ (data):

$$p(\theta \mid y) = \frac{p(y \mid \theta) \cdot p(\theta)}{p(y)} \propto p(y \mid \theta) \cdot p(\theta)$$

**Plain English:** The posterior probability is proportional to the likelihood times the prior. Bayes' theorem is the foundation of Bayesian inference.

**LaTeX:**

```latex
P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}
```

---

## ## Inequalities

### Markov's Inequality

For a non-negative random variable $X$ and $a > 0$:

$$P(X \geq a) \leq \frac{\mathbb{E}[X]}{a}$$

**Use:** Provides an upper bound on tail probabilities using only the mean.

### Chebyshev's Inequality

For a random variable $X$ with mean $\mu$ and variance $\sigma^2$, for $k > 0$:

$$P(|X - \mu| \geq k\sigma) \leq \frac{1}{k^2}$$

**Use:** At least $1 - 1/k^2$ of the probability mass lies within $k$ standard deviations of the mean, for any distribution.

### Jensen's Inequality

For a convex function $\varphi$ and random variable $X$:

$$\varphi(\mathbb{E}[X]) \leq \mathbb{E}[\varphi(X)]$$

For a concave function, the inequality reverses.

**Examples:**

- $e^{\mathbb{E}[X]} \leq \mathbb{E}[e^X]$ (exponential is convex)
- $\mathbb{E}[\log X] \leq \log \mathbb{E}[X]$ (log is concave)
- $\|\mathbb{E}[\mathbf{X}]\|^2 \leq \mathbb{E}[\|\mathbf{X}\|^2]$ (squared norm is convex)

**Use in information theory:** Proves that $H(X) \geq 0$ and that the KL divergence $D_{KL}(P \| Q) \geq 0$.

---

## ## Convergence Theorems

### Monotone Convergence Theorem

For a sequence of non-negative measurable functions $0 \leq f_1 \leq f_2 \leq \cdots$ converging pointwise to $f$:

$$\lim_{n \to \infty} \int f_n \, d\mu = \int f \, d\mu$$

### Dominated Convergence Theorem

If $f_n \to f$ pointwise and $|f_n| \leq g$ for an integrable $g$, then:

$$\lim_{n \to \infty} \int f_n \, d\mu = \int f \, d\mu$$

**Use:** Justifies exchanging limits and integrals/expectations in probability calculations.

---

## ## Borel-Cantelli Lemmas

### First Borel-Cantelli Lemma

If $\sum_{n=1}^{\infty} P(A_n) < \infty$, then $P(A_n \text{ i.o.}) = 0$.

### Second Borel-Cantelli Lemma

If $A_1, A_2, \ldots$ are independent and $\sum_{n=1}^{\infty} P(A_n) = \infty$, then $P(A_n \text{ i.o.}) = 1$.

**Notation:** "i.o." means "infinitely often" — $P(\limsup_n A_n)$.

**Use:** Proves the strong law of large numbers; characterizes which events occur infinitely often.

---

## ## See Also

- [../algebra/](../algebra/) — Algebra theorems
- [../calculus/](../calculus/) — Calculus theorems
- [../information_theory/](../information_theory/) — Information theory (entropy, mutual information)
- [../../../../math/notation/](../../../../math/notation/) — Notation reference
- [../../../../math/famous_equations/index.md](../../../../math/famous_equations/index.md) — Famous equations
