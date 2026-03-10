---
template_id: HOA-FIN-012
category: Financial
subcategory: Accounting
complexity: Comprehensive
version: 1.0
applicable_to: [HOA, Condo Association, Townhome Association]
frequency: Ongoing
---

# General Ledger

| Field | Value |
|-------|-------|
| **Template ID** | HOA-FIN-012 |
| **Category** | General Ledger |
| **Version** | 1.0 |
| **Association** | {{ASSOCIATION_NAME}} |
| **Fiscal Year** | {{FISCAL_YEAR}} |

## Purpose

Complete record of all financial transactions for the Association.

## Chart of Accounts

### Assets
| Account | Name | Balance |
|---------|------|--------|
| 1010 | Cash - Operating | {{CASH_OP}} |
| 1020 | Cash - Reserve | {{CASH_RES}} |
| 1100 | Assessments Receivable | {{AR}} |

### Liabilities
| Account | Name | Balance |
|---------|------|--------|
| 2010 | Accounts Payable | {{AP}} |
| 2100 | Prepaid Assessments | {{PREPAID}} |

### Equity
| Account | Name | Balance |
|---------|------|--------|
| 3010 | Retained Earnings | {{RE}} |
| 3020 | Reserve Fund | {{RESERVE}} |

## Trial Balance

| Account | Debit | Credit |
|---------|-------|--------|
| Total | {{TOT_DR}} | {{TOT_CR}} |

See [Balance Sheet](balance_sheet.md) for statements.
