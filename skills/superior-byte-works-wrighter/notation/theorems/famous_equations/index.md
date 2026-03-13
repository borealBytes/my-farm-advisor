---
name: Famous Equations Index
description: Index of famous equations in physics, mathematics, and information theory with LaTeX and explanations
version: 1.0.0
author: Omni Unified Writing
---

# Famous Equations

A curated collection of the most important equations in science and mathematics, with LaTeX source, plain-English explanations, and historical context.

---

## ## Physics

| Equation                                               | Name                    | LaTeX                                                  |
| ------------------------------------------------------ | ----------------------- | ------------------------------------------------------ |
| $E = mc^2$                                             | Mass-energy equivalence | `E = mc^2`                                             |
| $F = ma$                                               | Newton's second law     | `F = ma`                                               |
| $E = hf$                                               | Planck's relation       | `E = hf`                                               |
| $\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}$ | Gauss's law             | `\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}` |
| $i\hbar \frac{\partial}{\partial t}\Psi = \hat{H}\Psi$ | Schrödinger equation    | `i\hbar \frac{\partial}{\partial t}\Psi = \hat{H}\Psi` |
| $S = k_B \ln W$                                        | Boltzmann entropy       | `S = k_B \ln W`                                        |
| $\Delta x \cdot \Delta p \geq \frac{\hbar}{2}$         | Heisenberg uncertainty  | `\Delta x \cdot \Delta p \geq \frac{\hbar}{2}`         |

---

## ## Mathematics

| Equation                                              | Name                   | LaTeX                                                 |
| ----------------------------------------------------- | ---------------------- | ----------------------------------------------------- |
| $e^{i\pi} + 1 = 0$                                    | Euler's identity       | `e^{i\pi} + 1 = 0`                                    |
| $a^2 + b^2 = c^2$                                     | Pythagorean theorem    | `a^2 + b^2 = c^2`                                     |
| $\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$ | Basel problem          | `\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}` |
| $\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}$   | Gaussian integral      | `\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}`   |
| $\frac{d}{dx} e^x = e^x$                              | Exponential derivative | `\frac{d}{dx} e^x = e^x`                              |

---

## ## Information Theory

| Equation                                              | Name                    | LaTeX                                                 |
| ----------------------------------------------------- | ----------------------- | ----------------------------------------------------- |
| $H(X) = -\sum_i p_i \log_2 p_i$                       | Shannon entropy         | `H(X) = -\sum_i p_i \log_2 p_i`                       |
| $C = B \log_2\!\left(1 + \frac{S}{N}\right)$          | Shannon-Hartley theorem | `C = B \log_2\!\left(1 + \frac{S}{N}\right)`          |
| $I(X;Y) = H(X) - H(X\|Y)$                             | Mutual information      | `I(X;Y) = H(X) - H(X\|Y)`                             |
| $D_{KL}(P \| Q) = \sum_i P(i) \log \frac{P(i)}{Q(i)}$ | KL divergence           | `D_{KL}(P \| Q) = \sum_i P(i) \log \frac{P(i)}{Q(i)}` |

---

## ## Statistics and Probability

| Equation                                                              | Name                  | LaTeX                                                                 |
| --------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------- |
| $P(A\|B) = \frac{P(B\|A)P(A)}{P(B)}$                                  | Bayes' theorem        | `P(A\|B) = \frac{P(B\|A)P(A)}{P(B)}`                                  |
| $\bar{X} \xrightarrow{d} \mathcal{N}(\mu, \sigma^2/n)$                | Central limit theorem | `\bar{X} \xrightarrow{d} \mathcal{N}(\mu, \sigma^2/n)`                |
| $f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ | Normal distribution   | `f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}` |

---

## ## Machine Learning

| Equation                                                                          | Name                         | LaTeX                                                                             |
| --------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------- |
| $\mathcal{L} = -\sum_i y_i \log \hat{y}_i$                                        | Cross-entropy loss           | `\mathcal{L} = -\sum_i y_i \log \hat{y}_i`                                        |
| $\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right)V$ | Scaled dot-product attention | `\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right)V` |
| $\theta \leftarrow \theta - \eta \nabla_\theta \mathcal{L}$                       | Gradient descent             | `\theta \leftarrow \theta - \eta \nabla_\theta \mathcal{L}`                       |
| $\hat{y} = \sigma(\mathbf{w}^T \mathbf{x} + b)$                                   | Logistic regression          | `\hat{y} = \sigma(\mathbf{w}^T \mathbf{x} + b)`                                   |

---

## ## Using These Equations

### Inline math

```markdown
The mass-energy equivalence $E = mc^2$ shows that mass and energy are interchangeable.
```

### Display math

```markdown
Shannon entropy measures the average information content of a distribution:

$$H(X) = -\sum_{i=1}^{n} p_i \log_2 p_i$$

where $p_i$ is the probability of outcome $i$.
```

### Always define symbols

Every equation needs a legend:

```markdown
$$C = B \log_2\!\left(1 + \frac{S}{N}\right)$$

where $C$ is channel capacity in bits per second, $B$ is bandwidth in Hz,
$S$ is signal power, and $N$ is noise power.
```

---

## ## See Also

- [../notation/index.md](../notation/index.md) — Full notation reference
- [../theorems/proven/](../theorems/proven/) — Proven theorems with proofs
- [../../core/principles.md](../../core/principles.md) — Principle 8: Math is prose
