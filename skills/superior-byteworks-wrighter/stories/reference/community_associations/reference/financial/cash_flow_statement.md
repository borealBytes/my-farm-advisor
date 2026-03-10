---
template_id: HOA-FIN-009
category: Financial
subcategory: Statements
complexity: Standard
version: 1.0
applicable_to: [HOA, Condo Association, Townhome Association]
frequency: Monthly, Quarterly, Annually
---

# Cash Flow Statement

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Template ID**  | `HOA-FIN-009`                  |
| **Category**     | Financial Statements           |
| **Version**      | 1.0                            |
| **Last Updated** | 2026-03-01                     |
| **Association**  | {{ASSOCIATION_NAME}}           |
| **Period**       | {{START_DATE}} to {{END_DATE}} |
| **Prepared By**  | {{PREPARER_NAME}}              |

---

## Document Control

| Version | Date       | Author          | Changes          |
| ------- | ---------- | --------------- | ---------------- |
| 1.0     | 2026-03-01 | {{AUTHOR_NAME}} | Initial template |

---

## Purpose

This Cash Flow Statement tracks cash movement from operating, investing, and financing activities.

---

## Operating Activities

### Cash Receipts

| Source                  | Amount                |
| ----------------------- | --------------------- |
| Assessment Collections  | ${{ASSESS_COLL}}      |
| Late Fee Collections    | ${{LATE_COLL}}        |
| Interest Received       | ${{INT_RECEIVED}}     |
| Other Income            | ${{OTHER_INCOME}}     |
| **Total Cash Receipts** | **${{TOT_RECEIPTS}}** |

### Cash Disbursements

| Category                     | Amount                     |
| ---------------------------- | -------------------------- |
| Management Fees              | ${{MGMT_PAID}}             |
| Utilities                    | ${{UTIL_PAID}}             |
| Maintenance                  | ${{MAINT_PAID}}            |
| Insurance                    | ${{INS_PAID}}              |
| Legal/Accounting             | ${{LEGAL_PAID}}            |
| Landscaping                  | ${{LAND_PAID}}             |
| Other Expenses               | ${{OTHER_PAID}}            |
| **Total Cash Disbursements** | **${{TOT_DISBURSEMENTS}}** |

### Net Cash from Operations

| Category                    | Amount                   |
| --------------------------- | ------------------------ |
| Cash Receipts               | ${{TOT_RECEIPTS}}        |
| Cash Disbursements          | (${{TOT_DISBURSEMENTS}}) |
| **Net Operating Cash Flow** | **${{NET_OPERATING}}**   |

---

## Investing Activities

| Activity                    | Amount                 |
| --------------------------- | ---------------------- |
| Reserve Fund Contributions  | ${{RESERVE_CONTRIB}}   |
| Reserve Fund Expenditures   | (${{RESERVE_EXPEND}})  |
| Equipment Purchases         | (${{EQUIP_PURCHASE}})  |
| Investment Income           | ${{INVEST_INCOME}}     |
| **Net Investing Cash Flow** | **${{NET_INVESTING}}** |

---

## Financing Activities

| Activity                       | Amount                 |
| ------------------------------ | ---------------------- |
| Special Assessment Collections | ${{SPEC_COLL}}         |
| Loan Proceeds                  | ${{LOAN_PROCEEDS}}     |
| Loan Payments                  | (${{LOAN_PAYMENTS}})   |
| Interest Paid                  | (${{INTEREST_PAID}})   |
| **Net Financing Cash Flow**    | **${{NET_FINANCING}}** |

---

## Summary

| Category                | Amount              |
| ----------------------- | ------------------- |
| Net Operating Cash Flow | ${{NET_OPERATING}}  |
| Net Investing Cash Flow | ${{NET_INVESTING}}  |
| Net Financing Cash Flow | ${{NET_FINANCING}}  |
| **Net Change in Cash**  | **${{NET_CHANGE}}** |
| Beginning Cash Balance  | ${{BEGIN_CASH}}     |
| **Ending Cash Balance** | **${{END_CASH}}**   |

```mermaid
flowchart TD
    A[Beginning Cash: ${{BEGIN_CASH}}] --> B[Operating Activities]
    B --> C[Investing Activities]
    C --> D[Financing Activities]
    D --> E[Net Change: ${{NET_CHANGE}}]
    E --> F[Ending Cash: ${{END_CASH}}]

    B --> B1[Receipts: ${{TOT_RECEIPTS}}]
    B --> B2[Payments: (${{TOT_DISBURSEMENTS}})]

    C --> C1[Reserve: ${{RESERVE_CONTRIB}}]
    C --> C2[Equipment: (${{EQUIP_PURCHASE}})]

    D --> D1[Special Assessments: ${{SPEC_COLL}}]
    D --> D2[Loans: ${{LOAN_PROCEEDS}}]
```

---

## Bank Reconciliation Summary

| Account   | Bank Balance        | Book Balance        | Difference          |
| --------- | ------------------- | ------------------- | ------------------- |
| Operating | ${{BANK_OP}}        | ${{BOOK_OP}}        | ${{DIFF_OP}}        |
| Reserve   | ${{BANK_RES}}       | ${{BOOK_RES}}       | ${{DIFF_RES}}       |
| **Total** | **${{BANK_TOTAL}}** | **${{BOOK_TOTAL}}** | **${{DIFF_TOTAL}}** |

---

## Cash Position Analysis

| Metric                    | Amount          | Target            | Status            |
| ------------------------- | --------------- | ----------------- | ----------------- |
| Operating Cash            | ${{CASH_OP}}    | ${{TARGET_OP}}    | {{STATUS_OP}}     |
| Reserve Cash              | ${{CASH_RES}}   | ${{TARGET_RES}}   | {{STATUS_RES}}    |
| Total Cash                | ${{CASH_TOTAL}} | ${{TARGET_TOTAL}} | {{STATUS_TOTAL}}  |
| Months Operating Expenses | {{MONTHS_OP}}   | 3-6 months        | {{STATUS_MONTHS}} |

---

## References

- [Balance Sheet](balance_sheet.md)
- [Income Statement](income_statement.md)
- [Bank Reconciliation](bank_reconciliation.md)

See [\_shared/conventions.md](../../_shared/conventions.md) for financial statement standards.
