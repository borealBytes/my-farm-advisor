---
template_id: HOA-FIN-010
category: Financial
subcategory: Reconciliation
complexity: Standard
version: 1.0
applicable_to: [HOA, Condo Association, Townhome Association]
frequency: Monthly
---

# Bank Reconciliation

| Field              | Value                |
| ------------------ | -------------------- |
| **Template ID**    | `HOA-FIN-010`        |
| **Category**       | Bank Reconciliation  |
| **Version**        | 1.0                  |
| **Last Updated**   | 2026-03-01           |
| **Association**    | {{ASSOCIATION_NAME}} |
| **Account**        | {{ACCOUNT_NAME}}     |
| **Statement Date** | {{STATEMENT_DATE}}   |
| **Prepared By**    | {{PREPARER_NAME}}    |

---

## Document Control

| Version | Date       | Author          | Changes          |
| ------- | ---------- | --------------- | ---------------- |
| 1.0     | 2026-03-01 | {{AUTHOR_NAME}} | Initial template |

---

## Purpose

This document reconciles the Association's bank statement with the general ledger, identifying and explaining any differences.

---

## Reconciliation Summary

| Item                       | Amount            |
| -------------------------- | ----------------- |
| **Bank Statement Balance** | ${{BANK_BALANCE}} |
| **General Ledger Balance** | ${{GL_BALANCE}}   |
| **Difference**             | ${{DIFFERENCE}}   |
| **Reconciled?**            | {{RECONCILED}}    |

---

## Bank to Book Reconciliation

### Add: Deposits in Transit

| Date                          | Description | Amount                   |
| ----------------------------- | ----------- | ------------------------ |
| {{DEP_DATE_1}}                | {{DESC_1}}  | ${{DEP_AMT_1}}           |
| {{DEP_DATE_2}}                | {{DESC_2}}  | ${{DEP_AMT_2}}           |
| **Total Deposits in Transit** |             | **${{TOT_DEP_TRANSIT}}** |

### Less: Outstanding Checks

| Check #                      | Date           | Payee       | Amount               |
| ---------------------------- | -------------- | ----------- | -------------------- |
| {{CHK_NUM_1}}                | {{CHK_DATE_1}} | {{PAYEE_1}} | ${{CHK_AMT_1}}       |
| {{CHK_NUM_2}}                | {{CHK_DATE_2}} | {{PAYEE_2}} | ${{CHK_AMT_2}}       |
| **Total Outstanding Checks** |                |             | **${{TOT_OUT_CHK}}** |

### Add/Less: Bank Adjustments

| Description                | Amount                |
| -------------------------- | --------------------- |
| Bank Service Charges       | (${{BANK_FEES}})      |
| Interest Earned            | ${{BANK_INT}}         |
| NSF Check - {{NSF_PAYEE}}  | (${{NSF_AMT}})        |
| Other Adjustments          | ${{OTHER_ADJ}}        |
| **Total Bank Adjustments** | **${{TOT_BANK_ADJ}}** |

### Adjusted Bank Balance

| Calculation               | Amount                |
| ------------------------- | --------------------- |
| Bank Statement Balance    | ${{BANK_BALANCE}}     |
| + Deposits in Transit     | ${{TOT_DEP_TRANSIT}}  |
| - Outstanding Checks      | (${{TOT_OUT_CHK}})    |
| + Bank Adjustments        | ${{TOT_BANK_ADJ}}     |
| **Adjusted Bank Balance** | **${{ADJ_BANK_BAL}}** |

---

## Book to Bank Reconciliation

### Add: Unrecorded Deposits

| Date                          | Description      | Amount                 |
| ----------------------------- | ---------------- | ---------------------- |
| {{UNREC_DEP_DATE_1}}          | {{UNREC_DESC_1}} | ${{UNREC_DEP_AMT_1}}   |
| **Total Unrecorded Deposits** |                  | **${{TOT_UNREC_DEP}}** |

### Less: Unrecorded Checks

| Check #                     | Date                 | Payee             | Amount                 |
| --------------------------- | -------------------- | ----------------- | ---------------------- |
| {{UNREC_CHK_1}}             | {{UNREC_CHK_DATE_1}} | {{UNREC_PAYEE_1}} | ${{UNREC_CHK_AMT_1}}   |
| **Total Unrecorded Checks** |                      |                   | **${{TOT_UNREC_CHK}}** |

### Book Adjustments

| Description                | Debit                    | Credit                   |
| -------------------------- | ------------------------ | ------------------------ |
| Bank Service Charges       | ${{BANK_FEES}}           |                          |
| Interest Income            |                          | ${{INT_INCOME}}          |
| NSF Check - {{NSF_PAYEE}}  | ${{NSF_CHK_AMT}}         |                          |
| **Total Book Adjustments** | **${{TOT_BOOK_ADJ_DR}}** | **${{TOT_BOOK_ADJ_CR}}** |

### Adjusted Book Balance

| Calculation               | Amount                |
| ------------------------- | --------------------- |
| General Ledger Balance    | ${{GL_BALANCE}}       |
| + Unrecorded Deposits     | ${{TOT_UNREC_DEP}}    |
| - Unrecorded Checks       | (${{TOT_UNREC_CHK}})  |
| + Book Adjustments        | ${{NET_BOOK_ADJ}}     |
| **Adjusted Book Balance** | **${{ADJ_BOOK_BAL}}** |

---

## Outstanding Checks Aging

| Check #       | Date           | Days Outstanding | Payee           | Amount         | Action        |
| ------------- | -------------- | ---------------- | --------------- | -------------- | ------------- |
| {{OLD_CHK_1}} | {{OLD_DATE_1}} | {{OLD_DAYS_1}}   | {{OLD_PAYEE_1}} | ${{OLD_AMT_1}} | {{OLD_ACT_1}} |
| {{OLD_CHK_2}} | {{OLD_DATE_2}} | {{OLD_DAYS_2}}   | {{OLD_PAYEE_2}} | ${{OLD_AMT_2}} | {{OLD_ACT_2}} |

**Checks > 90 days:** {{COUNT_90PLUS}} checks, ${{AMT_90PLUS}}

---

## Reconciliation Check

| Check                                         | Status            |
| --------------------------------------------- | ----------------- |
| Adjusted Bank Balance = Adjusted Book Balance | {{MATCH_STATUS}}  |
| All deposits accounted for                    | {{DEP_STATUS}}    |
| All checks accounted for                      | {{CHK_STATUS}}    |
| Adjustments documented                        | {{ADJ_STATUS}}    |
| Reconciliation reviewed                       | {{REVIEW_STATUS}} |

**Reconciled Balance:** ${{RECONCILED_BALANCE}}

---

## Adjusting Journal Entries

| Date           | Account       | Debit     | Credit    | Description |
| -------------- | ------------- | --------- | --------- | ----------- |
| {{ADJ_DATE_1}} | {{ACCT_DR_1}} | ${{DR_1}} |           | {{DESC_1}}  |
| {{ADJ_DATE_1}} | {{ACCT_CR_1}} |           | ${{CR_1}} | {{DESC_1}}  |
| {{ADJ_DATE_2}} | {{ACCT_DR_2}} | ${{DR_2}} |           | {{DESC_2}}  |
| {{ADJ_DATE_2}} | {{ACCT_CR_2}} |           | ${{CR_2}} | {{DESC_2}}  |

---

## Certification

I certify that this reconciliation accurately reflects the bank account activity for the period ending {{STATEMENT_DATE}}.

**Prepared By:**
Name: {{PREPARER_NAME}} Date: {{PREP_DATE}} Signature: ******\_\_\_******

**Reviewed By:**
Name: {{REVIEWER_NAME}} Date: {{REV_DATE}} Signature: ******\_\_\_******

---

## References

- [Check Register](check_register.md)
- [General Ledger](general_ledger.md)
- [Treasurer's Report](treasurers_report.md)
