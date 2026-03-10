# DCF Valuation Model (Advanced)

<!-- Comprehensive discounted cash flow valuation with LaTeX formulas -->

---

## Document Control

| Field        | Value                                                     |
| ------------ | --------------------------------------------------------- |
| **Template** | DCF Valuation (Advanced)                                  |
| **Version**  | 1.0                                                       |
| **Tiers**    | Simple → Intermediate → **Advanced**                      |
| **Features** | 5-Year Model, Terminal Value, Sensitivity Analysis, LaTeX |

---

## Executive Summary

### Valuation Summary

$$Enterprise\ Value = \sum_{t=1}^{n} \frac{FCF_t}{(1+WACC)^t} + \frac{Terminal\ Value}{(1+WACC)^n} - Net\ Debt$$

| Metric                  | Value            |
| ----------------------- | ---------------- |
| **Enterprise Value**    | $[X,XXX] million |
| **Equity Value**        | $[X,XXX] million |
| **Implied Share Price** | $[XX.XX]         |
| **Current Share Price** | $[XX.XX]         |
| **Upside/(Downside)**   | [X]%             |

---

## DCF Methodology

### DCF Formula

$$EV = \sum_{t=1}^{5} \frac{FCF_t}{(1+WACC)^t} + \frac{TV_5}{(1+WACC)^5}$$

Where:

- $FCF_t$ = Free Cash Flow in year $t$
- $WACC$ = Weighted Average Cost of Capital
- $TV_5$ = Terminal Value at Year 5

### Terminal Value Calculation

$$Terminal\ Value = \frac{FCF_5 \times (1+g)}{WACC - g} = \frac{FCF_6}{WACC - g}$$

Where $g$ = perpetual growth rate (typically 2-3%)

---

## WACC Calculation

### Cost of Equity (CAPM)

$$r_e = r_f + \beta \times (r_m - r_f)$$

| Component                         | Value      |
| --------------------------------- | ---------- |
| Risk-free rate ($r_f$)            | [X.X]%     |
| Market risk premium ($r_m - r_f$) | [X.X]%     |
| Beta ($\beta$)                    | [X.XX]     |
| **Cost of Equity**                | **[X.X]%** |

### Cost of Debt

$$r_d = \frac{Interest\ Expense}{Total\ Debt} = [X.X]\%$$

### WACC Formula

$$WACC = \frac{E}{V} \times r_e + \frac{D}{V} \times r_d \times (1-T_c)$$

| Component                    | Value      |
| ---------------------------- | ---------- |
| Market Value of Equity ($E$) | $[X,XXX]   |
| Market Value of Debt ($D$)   | $[XXX]     |
| Total Value ($V = E + D$)    | $[X,XXX]   |
| Equity Ratio ($E/V$)         | [X]%       |
| Debt Ratio ($D/V$)           | [X]%       |
| Cost of Equity ($r_e$)       | [X.X]%     |
| Cost of Debt ($r_d$)         | [X.X]%     |
| Tax Rate ($T_c$)             | [X.X]%     |
| **WACC**                     | **[X.X]%** |

---

## Financial Projections

### Revenue Growth Model

$$Revenue_t = Revenue_{t-1} \times (1 + g_t)$$

Where $g_t$ = year-over-year growth rate

| Year | Revenue | YoY Growth | EBITDA | EBITDA Margin |
| ---- | ------- | ---------- | ------ | ------------- |
| 1    | $[X]    | [X]%       | $[X]   | [X]%          |
| 2    | $[X]    | [X]%       | $[X]   | [X]%          |
| 3    | $[X]    | [X]%       | $[X]   | [X]%          |
| 4    | $[X]    | [X]%       | $[X]   | [X]%          |
| 5    | $[X]    | [X]%       | $[X]   | [X]%          |

### Free Cash Flow Calculation

$$FCF = EBIT \times (1 - Tax\ Rate) + D&A - CapEx - \Delta NWC$$

| Component   | Year 1   | Year 2   | Year 3   | Year 4   | Year 5   |
| ----------- | -------- | -------- | -------- | -------- | -------- |
| EBIT        | $[X]     | $[X]     | $[X]     | $[X]     | $[X]     |
| Less: Taxes | ($[X])   | ($[X])   | ($[X])   | ($[X])   | ($[X])   |
| Plus: D&A   | $[X]     | $[X]     | $[X]     | $[X]     | $[X]     |
| Less: CapEx | ($[X])   | ($[X])   | ($[X])   | ($[X])   | ($[X])   |
| Less: ΔNWC  | ($[X])   | ($[X])   | ($[X])   | ($[X])   | ($[X])   |
| **FCF**     | **$[X]** | **$[X]** | **$[X]** | **$[X]** | **$[X]** |

---

## DCF Valuation

### Present Value Calculation

$$PV(FCF_t) = \frac{FCF_t}{(1+WACC)^t}$$

| Year    | FCF  | Discount Factor                  | Present Value |
| ------- | ---- | -------------------------------- | ------------- |
| 1       | $[X] | $\frac{1}{(1+[X])^1}$ = [X.XXXX] | $[X]          |
| 2       | $[X] | $\frac{1}{(1+[X])^2}$ = [X.XXXX] | $[X]          |
| 3       | $[X] | $\frac{1}{(1+[X])^3}$ = [X.XXXX] | $[X]          |
| 4       | $[X] | $\frac{1}{(1+[X])^4}$ = [X.XXXX] | $[X]          |
| 5       | $[X] | $\frac{1}{(1+[X])^5}$ = [X.XXXX] | $[X]          |
| **Sum** |      |                                  | **$[X]**      |

### Terminal Value

$$TV_5 = \frac{FCF_5 \times (1+g)}{WACC - g} = \frac{\$[X] \times (1+[X]\%)}{[X]\% - [X]\%} = \$[X]$$

$$PV(TV_5) = \frac{TV_5}{(1+WACC)^5} = \frac{\$[X]}{[X]} = \$[X]$$

### Enterprise Value

| Component             | Value    |
| --------------------- | -------- |
| PV of FCF (Years 1-5) | $[X]     |
| PV of Terminal Value  | $[X]     |
| **Enterprise Value**  | **$[X]** |
| Less: Net Debt        | ($[X])   |
| **Equity Value**      | **$[X]** |

---

## Sensitivity Analysis

### WACC vs. Terminal Growth

```mermaid
quadrantChart
    title "Enterprise Value Sensitivity: WACC vs Terminal Growth"
    x-axis Low WACC (7%) --> High WACC (12%)
    y-axis Low Growth (1%) --> High Growth (4%)
    quadrant-1 High EV (Good)
    quadrant-2 Optimize
    quadrant-3 Low EV (Bad)
    quadrant-4 Risk
    "Base Case": [0.5, 0.5]
    "Optimistic": [0.3, 0.8]
    "Pessimistic": [0.8, 0.2]
```

### Sensitivity Matrix

| WACC \ Growth | 1.0% | 1.5% | 2.0% | 2.5% | 3.0% |
| ------------- | ---- | ---- | ---- | ---- | ---- |
| **7.0%**      | $[X] | $[X] | $[X] | $[X] | $[X] |
| **8.0%**      | $[X] | $[X] | $[X] | $[X] | $[X] |
| **9.0%**      | $[X] | $[X] | $[X] | $[X] | $[X] |
| **10.0%**     | $[X] | $[X] | $[X] | $[X] | $[X] |
| **11.0%**     | $[X] | $[X] | $[X] | $[X] | $[X] |

### Key Drivers

$$\frac{\partial EV}{\partial FCF} > 0,\quad \frac{\partial EV}{\partial WACC} < 0,\quad \frac{\partial EV}{\partial g} > 0$$

| Driver          | Base | Optimistic | Pessimistic | Impact on EV |
| --------------- | ---- | ---------- | ----------- | ------------ |
| Revenue Growth  | [X]% | [X]%       | [X]%        | [X]%         |
| EBITDA Margin   | [X]% | [X]%       | [X]%        | [X]%         |
| CapEx Intensity | [X]% | [X]%       | [X]%        | [X]%         |
| WACC            | [X]% | [X]%       | [X]%        | [X]%         |
| Terminal Growth | [X]% | [X]%       | [X]%        | [X]%         |

---

## Comparable Analysis

### Trading Comps

| Metric     | Target | Peer 1 | Peer 2 | Peer 3 | Median |
| ---------- | ------ | ------ | ------ | ------ | ------ |
| EV/Revenue | [X]x   | [X]x   | [X]x   | [X]x   | [X]x   |
| EV/EBITDA  | [X]x   | [X]x   | [X]x   | [X]x   | [X]x   |
| P/E        | [X]x   | [X]x   | [X]x   | [X]x   | [X]x   |
| P/B        | [X]x   | [X]x   | [X]x   | [X]x   | [X]x   |

### DCF vs. Market

| Valuation Method  | Value    | Weight   |
| ----------------- | -------- | -------- |
| DCF (Base Case)   | $[X]     | 50%      |
| Trading Comps     | $[X]     | 25%      |
| Transaction Comps | $[X]     | 25%      |
| **Blended Value** | **$[X]** | **100%** |

---

## Investment Recommendation

### Key Assumptions

| Assumption      | Value | Rationale                   |
| --------------- | ----- | --------------------------- |
| Revenue CAGR    | [X]%  | Market growth + share gains |
| EBITDA Margin   | [X]%  | Operational leverage        |
| CapEx/Rev       | [X]%  | Maintenance + growth        |
| WACC            | [X]%  | Industry average            |
| Terminal Growth | [X]%  | GDP + inflation             |

### Risk Factors

$$Risk\ Adjusted\ Value = \sum_{i=1}^{n} p_i \times Value_i$$

Where $p_i$ = probability of scenario $i$

| Scenario                 | Probability | Value | Weighted Value |
| ------------------------ | ----------- | ----- | -------------- |
| Bull                     | 25%         | $[X]  | $[X]           |
| Base                     | 50%         | $[X]  | $[X]           |
| Bear                     | 25%         | $[X]  | $[X]           |
| **Probability-Weighted** | **100%**    |       | **$[X]**       |

---

## Appendices

### Appendix A: Detailed Financial Model

### Appendix B: WACC Calculation Details

### Appendix C: Comparable Company Financials

### Appendix D: Management Guidance vs. Actuals

### Appendix E: Historical Trading Multiples

---

_This DCF model follows investment banking standards. All calculations use standard financial formulas._
