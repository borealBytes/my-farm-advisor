# ETF Performance Report

> **Template Type**: Performance Reporting | **Audience**: Board, Investors, Compliance

---

## Document Control

| Field                | Value                                 |
| -------------------- | ------------------------------------- |
| **Document ID**      | `ETF-PERF-RPT-001`                    |
| **Version**          | 1.0                                   |
| **Classification**   | External — Public                     |
| **Fund Name**        | `{{fund_name}}`                       |
| **Ticker**           | `{{ticker}}`                          |
| **CUSIP**            | `{{cusip}}`                           |
| **Reporting Period** | `{{period_start}}` — `{{period_end}}` |
| **Report Date**      | `{{report_date}}`                     |
| **Prepared By**      | `{{prepared_by}}`                     |
| **Status**           | Final                                 |

---

## 1. Fund Overview

| Parameter              | Value                    |
| ---------------------- | ------------------------ |
| **Inception Date**     | `{{inception_date}}`     |
| **Benchmark Index**    | `{{benchmark_index}}`    |
| **Net Assets**         | $`{{net_assets}}`M       |
| **Shares Outstanding** | `{{shares_outstanding}}` |
| **NAV per Share**      | $`{{nav_per_share}}`     |
| **Market Price**       | $`{{market_price}}`      |
| **Net Expense Ratio**  | `{{net_er}}` bps         |
| **30-Day SEC Yield**   | `{{sec_yield}}`%         |
| **Distribution Yield** | `{{dist_yield}}`%        |

---

## 2. Performance Summary

### 2.1 Total Returns (as of `{{period_end}}`)

| Period                 | Fund (NAV)       | Fund (Market)    | Benchmark          | Difference (NAV) |
| ---------------------- | ---------------- | ---------------- | ------------------ | ---------------- |
| 1 Month                | `{{r_1m_nav}}`%  | `{{r_1m_mkt}}`%  | `{{r_1m_bench}}`%  | `{{d_1m}}`%      |
| 3 Months               | `{{r_3m_nav}}`%  | `{{r_3m_mkt}}`%  | `{{r_3m_bench}}`%  | `{{d_3m}}`%      |
| 6 Months               | `{{r_6m_nav}}`%  | `{{r_6m_mkt}}`%  | `{{r_6m_bench}}`%  | `{{d_6m}}`%      |
| YTD                    | `{{r_ytd_nav}}`% | `{{r_ytd_mkt}}`% | `{{r_ytd_bench}}`% | `{{d_ytd}}`%     |
| 1 Year                 | `{{r_1y_nav}}`%  | `{{r_1y_mkt}}`%  | `{{r_1y_bench}}`%  | `{{d_1y}}`%      |
| 3 Years (ann.)         | `{{r_3y_nav}}`%  | `{{r_3y_mkt}}`%  | `{{r_3y_bench}}`%  | `{{d_3y}}`%      |
| 5 Years (ann.)         | `{{r_5y_nav}}`%  | `{{r_5y_mkt}}`%  | `{{r_5y_bench}}`%  | `{{d_5y}}`%      |
| Since Inception (ann.) | `{{r_si_nav}}`%  | `{{r_si_mkt}}`%  | `{{r_si_bench}}`%  | `{{d_si}}`%      |

_Performance data quoted represents past performance and does not guarantee future results._

### 2.2 Calendar Year Returns

| Year         | Fund (NAV)      | Benchmark        | Difference      |
| ------------ | --------------- | ---------------- | --------------- |
| `{{year_1}}` | `{{cy1_fund}}`% | `{{cy1_bench}}`% | `{{cy1_diff}}`% |
| `{{year_2}}` | `{{cy2_fund}}`% | `{{cy2_bench}}`% | `{{cy2_diff}}`% |
| `{{year_3}}` | `{{cy3_fund}}`% | `{{cy3_bench}}`% | `{{cy3_diff}}`% |
| `{{year_4}}` | `{{cy4_fund}}`% | `{{cy4_bench}}`% | `{{cy4_diff}}`% |
| `{{year_5}}` | `{{cy5_fund}}`% | `{{cy5_bench}}`% | `{{cy5_diff}}`% |

---

## 3. Risk-Adjusted Performance

### 3.1 Key Risk Metrics

| Metric                    | Formula                                                          | Fund                     | Benchmark            |
| ------------------------- | ---------------------------------------------------------------- | ------------------------ | -------------------- |
| **Annualized Return**     | $\bar{R} \times 252$                                             | `{{ann_ret_fund}}`%      | `{{ann_ret_bench}}`% |
| **Annualized Volatility** | $\sigma \times \sqrt{252}$                                       | `{{ann_vol_fund}}`%      | `{{ann_vol_bench}}`% |
| **Sharpe Ratio**          | $\frac{\bar{R}_p - R_f}{\sigma_p}$                               | `{{sharpe_fund}}`        | `{{sharpe_bench}}`   |
| **Sortino Ratio**         | $\frac{\bar{R}_p - R_f}{\sigma_d}$                               | `{{sortino_fund}}`       | `{{sortino_bench}}`  |
| **Max Drawdown**          | $\max_{t} \frac{\text{Peak}_t - \text{Trough}_t}{\text{Peak}_t}$ | `{{mdd_fund}}`%          | `{{mdd_bench}}`%     |
| **Beta**                  | $\frac{\text{Cov}(R_p, R_b)}{\text{Var}(R_b)}$                   | `{{beta}}`               | 1.00                 |
| **R-Squared**             | $\rho^2(R_p, R_b)$                                               | `{{r_squared}}`          | 1.00                 |
| **Tracking Error**        | $\sigma(R_p - R_b) \times \sqrt{252}$                            | `{{tracking_error}}` bps | —                    |
| **Tracking Difference**   | $\bar{R}_p - \bar{R}_b$ (ann.)                                   | `{{tracking_diff}}` bps  | —                    |
| **Information Ratio**     | $\frac{\bar{R}_p - \bar{R}_b}{TE}$                               | `{{info_ratio}}`         | —                    |

### 3.2 Rolling Tracking Error (12-Month)

| Period End  | TE (bps, ann.) | Status      |
| ----------- | -------------- | ----------- |
| `{{te_p1}}` | `{{te_v1}}`    | `{{te_s1}}` |
| `{{te_p2}}` | `{{te_v2}}`    | `{{te_s2}}` |
| `{{te_p3}}` | `{{te_v3}}`    | `{{te_s3}}` |
| `{{te_p4}}` | `{{te_v4}}`    | `{{te_s4}}` |

---

## 4. Portfolio Characteristics

### 4.1 Key Statistics

| Metric                    | Fund                 | Benchmark            | Difference        |
| ------------------------- | -------------------- | -------------------- | ----------------- |
| Number of Holdings        | `{{fund_holdings}}`  | `{{bench_holdings}}` | `{{hold_diff}}`   |
| Wtd. Avg. Market Cap ($B) | `{{fund_mcap}}`      | `{{bench_mcap}}`     | `{{mcap_diff}}`   |
| Median Market Cap ($B)    | `{{fund_med_mcap}}`  | `{{bench_med_mcap}}` | `{{med_diff}}`    |
| P/E Ratio (Fwd)           | `{{fund_pe}}`        | `{{bench_pe}}`       | `{{pe_diff}}`     |
| P/B Ratio                 | `{{fund_pb}}`        | `{{bench_pb}}`       | `{{pb_diff}}`     |
| Dividend Yield            | `{{fund_yield}}`%    | `{{bench_yield}}`%   | `{{yield_diff}}`% |
| Turnover (period)         | `{{fund_turnover}}`% | —                    | —                 |

### 4.2 Sector Allocation

```mermaid
pie title Fund Sector Allocation
    "Technology" : {{s_tech}}
    "Healthcare" : {{s_health}}
    "Financials" : {{s_fin}}
    "Consumer Disc." : {{s_cd}}
    "Industrials" : {{s_ind}}
    "Communication" : {{s_comm}}
    "Consumer Staples" : {{s_cs}}
    "Energy" : {{s_energy}}
    "Utilities" : {{s_util}}
    "Real Estate" : {{s_re}}
    "Materials" : {{s_mat}}
```

### 4.3 Top 10 Holdings

| #   | Security         | Ticker         | Weight (%)         | Benchmark Weight (%) |
| --- | ---------------- | -------------- | ------------------ | -------------------- |
| 1   | `{{h1_name}}`    | `{{h1_tick}}`  | `{{h1_wt}}`        | `{{h1_bwt}}`         |
| 2   | `{{h2_name}}`    | `{{h2_tick}}`  | `{{h2_wt}}`        | `{{h2_bwt}}`         |
| 3   | `{{h3_name}}`    | `{{h3_tick}}`  | `{{h3_wt}}`        | `{{h3_bwt}}`         |
| 4   | `{{h4_name}}`    | `{{h4_tick}}`  | `{{h4_wt}}`        | `{{h4_bwt}}`         |
| 5   | `{{h5_name}}`    | `{{h5_tick}}`  | `{{h5_wt}}`        | `{{h5_bwt}}`         |
| 6   | `{{h6_name}}`    | `{{h6_tick}}`  | `{{h6_wt}}`        | `{{h6_bwt}}`         |
| 7   | `{{h7_name}}`    | `{{h7_tick}}`  | `{{h7_wt}}`        | `{{h7_bwt}}`         |
| 8   | `{{h8_name}}`    | `{{h8_tick}}`  | `{{h8_wt}}`        | `{{h8_bwt}}`         |
| 9   | `{{h9_name}}`    | `{{h9_tick}}`  | `{{h9_wt}}`        | `{{h9_bwt}}`         |
| 10  | `{{h10_name}}`   | `{{h10_tick}}` | `{{h10_wt}}`       | `{{h10_bwt}}`        |
|     | **Top 10 Total** |                | **`{{top10_wt}}`** | **`{{top10_bwt}}`**  |

---

## 5. Trading & Market Quality

### 5.1 Premium/Discount Analysis

| Metric                   | Value               |
| ------------------------ | ------------------- |
| Average Premium/Discount | `{{avg_pd}}`%       |
| Median Premium/Discount  | `{{med_pd}}`%       |
| Days at Premium          | `{{days_premium}}`  |
| Days at Discount         | `{{days_discount}}` |
| Max Premium              | `{{max_premium}}`%  |
| Max Discount             | `{{max_discount}}`% |

### 5.2 Liquidity Metrics

| Metric                        | Current Period       | Prior Period       |
| ----------------------------- | -------------------- | ------------------ |
| Average Daily Volume (shares) | `{{adv_current}}`    | `{{adv_prior}}`    |
| Average Daily Value ($)       | $`{{adval_current}}` | $`{{adval_prior}}` |
| Avg. Bid-Ask Spread (bps)     | `{{spread_current}}` | `{{spread_prior}}` |
| Number of Market Makers       | `{{mm_current}}`     | `{{mm_prior}}`     |

---

## 6. Fund Flows

| Period           | Creations ($M)    | Redemptions ($M)  | Net Flows ($M)    |
| ---------------- | ----------------- | ----------------- | ----------------- |
| `{{flow_m1}}`    | `{{c_m1}}`        | `{{r_m1}}`        | `{{n_m1}}`        |
| `{{flow_m2}}`    | `{{c_m2}}`        | `{{r_m2}}`        | `{{n_m2}}`        |
| `{{flow_m3}}`    | `{{c_m3}}`        | `{{r_m3}}`        | `{{n_m3}}`        |
| **Period Total** | **`{{c_total}}`** | **`{{r_total}}`** | **`{{n_total}}`** |

---

## 7. Expense Analysis

| Component             | Current Period (bps) | Prior Period (bps)  | Prospectus (bps)    |
| --------------------- | -------------------- | ------------------- | ------------------- |
| Management Fee        | `{{mf_curr}}`        | `{{mf_prior}}`      | `{{mf_prosp}}`      |
| Other Expenses        | `{{oe_curr}}`        | `{{oe_prior}}`      | `{{oe_prosp}}`      |
| Gross Expense Ratio   | `{{ger_curr}}`       | `{{ger_prior}}`     | `{{ger_prosp}}`     |
| Fee Waiver            | (`{{fw_curr}}`)      | (`{{fw_prior}}`)    | (`{{fw_prosp}}`)    |
| **Net Expense Ratio** | **`{{ner_curr}}`**   | **`{{ner_prior}}`** | **`{{ner_prosp}}`** |

---

## 8. Distributions

| Ex-Date     | Record Date  | Pay Date     | Income        | ST Cap Gain  | LT Cap Gain  | Total         |
| ----------- | ------------ | ------------ | ------------- | ------------ | ------------ | ------------- |
| `{{d1_ex}}` | `{{d1_rec}}` | `{{d1_pay}}` | $`{{d1_inc}}` | $`{{d1_st}}` | $`{{d1_lt}}` | $`{{d1_tot}}` |
| `{{d2_ex}}` | `{{d2_rec}}` | `{{d2_pay}}` | $`{{d2_inc}}` | $`{{d2_st}}` | $`{{d2_lt}}` | $`{{d2_tot}}` |
| `{{d3_ex}}` | `{{d3_rec}}` | `{{d3_pay}}` | $`{{d3_inc}}` | $`{{d3_st}}` | $`{{d3_lt}}` | $`{{d3_tot}}` |
| `{{d4_ex}}` | `{{d4_rec}}` | `{{d4_pay}}` | $`{{d4_inc}}` | $`{{d4_st}}` | $`{{d4_lt}}` | $`{{d4_tot}}` |

---

## 9. Compliance Summary

| Item                           | Status            | Notes            |
| ------------------------------ | ----------------- | ---------------- |
| Investment guideline adherence | `{{ig_status}}`   | `{{ig_notes}}`   |
| Diversification (RIC)          | `{{div_status}}`  | `{{div_notes}}`  |
| Tracking error within budget   | `{{te_status}}`   | `{{te_notes}}`   |
| Liquidity requirements met     | `{{liq_status}}`  | `{{liq_notes}}`  |
| No compliance exceptions       | `{{comp_status}}` | `{{comp_notes}}` |

---

## 10. Disclosures

**Important**: Performance data quoted represents past performance and does not guarantee future results. Investment return and principal value will fluctuate so that shares, when sold, may be worth more or less than their original cost. Current performance may be lower or higher than the performance quoted. Returns for periods greater than one year are annualized.

The Fund's NAV is calculated at 4:00 PM ET. Market price returns are based on the closing price on the listing exchange. NAV returns are calculated using the Fund's daily NAV.

Shares are bought and sold at market price (not NAV) and are not individually redeemed from the Fund. Brokerage commissions will reduce returns.

---

_Report prepared by `{{prepared_by}}` on `{{report_date}}`. For institutional use only._
