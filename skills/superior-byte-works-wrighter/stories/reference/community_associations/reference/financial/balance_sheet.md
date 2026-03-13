---
template_id: HOA-FIN-007
category: Financial
subcategory: Statements
complexity: Standard
version: 1.0
applicable_to: [HOA, Condo Association, Townhome Association]
frequency: Monthly, Quarterly, Annually
---

# Balance Sheet

| Field            | Value                |
| ---------------- | -------------------- |
| **Template ID**  | `HOA-FIN-007`        |
| **Category**     | Financial Statements |
| **Version**      | 1.0                  |
| **Last Updated** | 2026-03-01           |
| **Association**  | {{ASSOCIATION_NAME}} |
| **As of Date**   | {{AS_OF_DATE}}       |
| **Prepared By**  | {{PREPARER_NAME}}    |

---

## Document Control

| Version | Date       | Author          | Changes          |
| ------- | ---------- | --------------- | ---------------- |
| 1.0     | 2026-03-01 | {{AUTHOR_NAME}} | Initial template |

---

## Purpose

This Balance Sheet presents the financial position of the Association as of a specific date, showing assets, liabilities, and equity.

---

## Assets

### Current Assets

| Account                  | Account #          | Amount                        |
| ------------------------ | ------------------ | ----------------------------- |
| Cash - Operating         | {{ACCT_OP}}        | ${{CASH_OP}}                  |
| Cash - Reserve           | {{ACCT_RES}}       | ${{CASH_RES}}                 |
| Assessments Receivable   | {{ACCT_AR}}        | ${{AR_CURRENT}}               |
| Prepaid Expenses         | {{ACCT_PREPAID}}   | ${{PREPAID}}                  |
| Other Current Assets     | {{ACCT_OTHER_CUR}} | ${{OTHER_CURRENT}}            |
| **Total Current Assets** |                    | **${{TOTAL_CURRENT_ASSETS}}** |

### Non-Current Assets

| Account                      | Account #    | Amount                     |
| ---------------------------- | ------------ | -------------------------- |
| Furniture & Equipment        | {{ACCT_FFE}} | ${{FFE}}                   |
| Accumulated Depreciation     | {{ACCT_DEP}} | (${{DEP}})                 |
| Net Fixed Assets             |              | ${{NET_FIXED}}             |
| **Total Non-Current Assets** |              | **${{TOTAL_NON_CURRENT}}** |

### Total Assets

**TOTAL ASSETS: ${{TOTAL_ASSETS}}**

---

## Liabilities

### Current Liabilities

| Account                       | Account #               | Amount                      |
| ----------------------------- | ----------------------- | --------------------------- |
| Accounts Payable              | {{ACCT_AP}}             | ${{AP}}                     |
| Accrued Expenses              | {{ACCT_ACCRUED}}        | ${{ACCRUED}}                |
| Prepaid Assessments           | {{ACCT_PREPAID_ASSESS}} | ${{PREPAID_ASSESS}}         |
| Security Deposits             | {{ACCT_DEPOSITS}}       | ${{DEPOSITS}}               |
| **Total Current Liabilities** |                         | **${{TOTAL_CURRENT_LIAB}}** |

### Non-Current Liabilities

| Account                           | Account #      | Amount                          |
| --------------------------------- | -------------- | ------------------------------- |
| Loans Payable                     | {{ACCT_LOANS}} | ${{LOANS}}                      |
| Notes Payable                     | {{ACCT_NOTES}} | ${{NOTES}}                      |
| **Total Non-Current Liabilities** |                | **${{TOTAL_NON_CURRENT_LIAB}}** |

### Total Liabilities

**TOTAL LIABILITIES: ${{TOTAL_LIABILITIES}}**

---

## Equity

| Account                       | Amount                |
| ----------------------------- | --------------------- |
| Retained Earnings - Operating | ${{RETAINED_OP}}      |
| Reserve Fund                  | ${{RESERVE_FUND}}     |
| Current Year Net Income       | ${{CURRENT_NET}}      |
| **Total Equity**              | **${{TOTAL_EQUITY}}** |

---

## Summary

```mermaid
pie title Assets Distribution
    "Cash" : {{CASH_PCT}}
    "Receivables" : {{AR_PCT}}
    "Fixed Assets" : {{FIXED_PCT}}
```

### Financial Position Summary

| Metric            | Amount                 |
| ----------------- | ---------------------- |
| Total Assets      | ${{TOTAL_ASSETS}}      |
| Total Liabilities | ${{TOTAL_LIABILITIES}} |
| Total Equity      | ${{TOTAL_EQUITY}}      |
| **Balance Check** | ${{BALANCE_CHECK}}     |

### Key Ratios

| Ratio           | Calculation                          | Value                | Benchmark |
| --------------- | ------------------------------------ | -------------------- | --------- |
| Current Ratio   | Current Assets / Current Liabilities | {{CURRENT_RATIO}}    | 1.0+      |
| Working Capital | Current Assets - Current Liabilities | ${{WORKING_CAPITAL}} | Positive  |
| Reserve %       | Reserve Fund / Total Assets          | {{RESERVE_PCT}}%     | Varies    |

---

## Comparative Analysis

| Category          | Current Year     | Prior Year        | Variance        |
| ----------------- | ---------------- | ----------------- | --------------- |
| Cash              | ${{CURR_CASH}}   | ${{PRIOR_CASH}}   | {{CASH_VAR}}%   |
| Receivables       | ${{CURR_AR}}     | ${{PRIOR_AR}}     | {{AR_VAR}}%     |
| Total Assets      | ${{CURR_ASSETS}} | ${{PRIOR_ASSETS}} | {{ASSETS_VAR}}% |
| Total Liabilities | ${{CURR_LIAB}}   | ${{PRIOR_LIAB}}   | {{LIAB_VAR}}%   |
| Equity            | ${{CURR_EQUITY}} | ${{PRIOR_EQUITY}} | {{EQUITY_VAR}}% |

---

## References

- [Income Statement](income_statement.md)
- [Treasurer's Report](treasurers_report.md)

See [\_shared/conventions.md](../../_shared/conventions.md) for financial statement standards.
