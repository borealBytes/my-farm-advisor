---
name: Information Theory Theorems Index
description: Index of proven theorems in information theory with LaTeX statements and proofs
version: 1.0.0
author: Omni Unified Writing
---

# Information Theory Theorems

Proven theorems in information theory, from Shannon's foundational results to modern coding theory.

---

## ## Core Shannon Theorems

### Shannon's Source Coding Theorem (1948)

**Statement:** For a discrete memoryless source with entropy $H(X)$ bits per symbol, the minimum average code length $L$ satisfies:

$$H(X) \leq L < H(X) + 1$$

**Significance:** Establishes entropy as the fundamental limit of lossless data compression. No lossless code can compress below $H(X)$ bits per symbol on average.

**LaTeX:**

```latex
H(X) \leq L < H(X) + 1
```

---

### Shannon's Channel Coding Theorem (Noisy Channel Theorem, 1948)

**Statement:** For a discrete memoryless channel with capacity $C$ bits per channel use, for any rate $R < C$ and any $\varepsilon > 0$, there exists a code with rate $R$ and block error probability $P_e < \varepsilon$. Conversely, for $R > C$, the error probability is bounded away from zero.

$$C = \max_{p(x)} I(X; Y)$$

where the maximum is over all input distributions $p(x)$.

**Significance:** Proves that reliable communication is possible at any rate below channel capacity, and impossible above it.

**LaTeX:**

```latex
C = \max_{p(x)} I(X; Y)
```

---

### Shannon-Hartley Theorem

**Statement:** The capacity of a continuous-time channel with bandwidth $B$ Hz and signal-to-noise ratio $S/N$ is:

$$C = B \log_2\!\left(1 + \frac{S}{N}\right) \text{ bits per second}$$

**Significance:** Quantifies the fundamental trade-off between bandwidth and SNR in analog channels. Basis for all modern wireless communication standards.

**LaTeX:**

```latex
C = B \log_2\!\left(1 + \frac{S}{N}\right)
```

---

## ## Entropy Properties

### Chain Rule for Entropy

$$H(X_1, X_2, \ldots, X_n) = \sum_{i=1}^{n} H(X_i \mid X_1, \ldots, X_{i-1})$$

### Data Processing Inequality

For a Markov chain $X \to Y \to Z$:

$$I(X; Z) \leq I(X; Y)$$

**Significance:** Processing data cannot increase the mutual information. Any transformation of $Y$ to produce $Z$ can only lose information about $X$.

### Fano's Inequality

For any estimator $\hat{X}$ of $X$ given $Y$, with error probability $P_e = P(\hat{X} \neq X)$:

$$H(X \mid Y) \leq H(P_e) + P_e \log_2(|\mathcal{X}| - 1)$$

**Significance:** Lower bounds the conditional entropy in terms of the error probability. Used to prove converse theorems in coding theory.

---

## ## Rate-Distortion Theory

### Rate-Distortion Theorem

For a source $X$ with distortion measure $d(x, \hat{x})$, the minimum rate $R(D)$ needed to achieve average distortion $\leq D$ is:

$$R(D) = \min_{p(\hat{x}|x): \mathbb{E}[d(X,\hat{X})] \leq D} I(X; \hat{X})$$

**Significance:** Establishes the fundamental limit of lossy compression. Generalizes the source coding theorem to allow controlled distortion.

---

## ## Kolmogorov Complexity

### Invariance Theorem

For any two universal Turing machines $U$ and $V$, there exists a constant $c$ such that for all strings $x$:

$$|K_U(x) - K_V(x)| \leq c$$

where $K_U(x)$ is the Kolmogorov complexity of $x$ with respect to $U$.

**Significance:** The choice of universal Turing machine affects complexity by at most a constant, making Kolmogorov complexity machine-independent up to a constant.

---

## ## See Also

- [../algebra/](../algebra/) — Algebra theorems
- [../calculus/](../calculus/) — Calculus theorems
- [../probability/](../probability/) — Probability theorems
- [../../../../math/famous_equations/index.md](../../../../math/famous_equations/index.md) — Famous equations including information theory
- [../../../../math/notation/index.md](../../../../math/notation/index.md) — Notation reference
