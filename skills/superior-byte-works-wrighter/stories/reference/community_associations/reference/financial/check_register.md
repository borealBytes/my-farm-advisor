---
template_id: HOA-FIN-011
category: Financial
subcategory: Transaction Log
complexity: Standard
version: 1.0
applicable_to: [HOA, Condo Association, Townhome Association]
frequency: Ongoing
---

# Check Register

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Template ID**  | `HOA-FIN-011`                  |
| **Category**     | Transaction Log                |
| **Version**      | 1.0                            |
| **Last Updated** | 2026-03-01                     |
| **Association**  | {{ASSOCIATION_NAME}}           |
| **Account**      | {{ACCOUNT_NAME}}               |
| **Period**       | {{START_DATE}} to {{END_DATE}} |

---

## Document Control

| Version | Date       | Author          | Changes          |
| ------- | ---------- | --------------- | ---------------- |
| 1.0     | 2026-03-01 | {{AUTHOR_NAME}} | Initial template |

---

## Purpose

This register tracks all checks issued and deposits received for the Association's bank account.

---

## Register Summary

| Category           | Amount               | Count         |
| ------------------ | -------------------- | ------------- |
| Beginning Balance  | ${{BEGIN_BALANCE}}   | -             |
| Total Deposits     | ${{TOT_DEPOSITS}}    | {{DEP_COUNT}} |
| Total Checks       | (${{TOT_CHECKS}})    | {{CHK_COUNT}} |
| Total Adjustments  | ${{TOT_ADJ}}         | {{ADJ_COUNT}} |
| **Ending Balance** | **${{END_BALANCE}}** | -             |

---

## Transaction Detail

| Date       | Check #   | Payee       | Description    | Debit          | Credit          | Balance    |
| ---------- | --------- | ----------- | -------------- | -------------- | --------------- | ---------- |
| {{DATE_1}} | {{CHK_1}} | {{PAYEE_1}} | {{DESC_1}}     | ${{DEBIT_1}}   |                 | ${{BAL_1}} |
| {{DATE_2}} | DEP       |             | {{DEP_DESC_1}} |                | ${{CREDIT_1}}   | ${{BAL_2}} |
| {{DATE_3}} | {{CHK_2}} | {{PAYEE_2}} | {{DESC_2}}     | ${{DEBIT_2}}   |                 | ${{BAL_3}} |
| {{DATE_4}} | ADJ       |             | {{ADJ_DESC_1}} | ${{ADJ_DEBIT}} | ${{ADJ_CREDIT}} | ${{BAL_4}} |

---

## Outstanding Checks

| Check #       | Date           | Payee           | Amount         | Days Outstanding |
| ------------- | -------------- | --------------- | -------------- | ---------------- |
| {{OUT_CHK_1}} | {{OUT_DATE_1}} | {{OUT_PAYEE_1}} | ${{OUT_AMT_1}} | {{OUT_DAYS_1}}   |
| {{OUT_CHK_2}} | {{OUT_DATE_2}} | {{OUT_PAYEE_2}} | ${{OUT_AMT_2}} | {{OUT_DAYS_2}}   |

**Total Outstanding:** ${{TOT_OUTSTANDING}}

---

## Voided Checks

| Check #        | Date            | Original Payee   | Void Reason       | Authorized By   |
| -------------- | --------------- | ---------------- | ----------------- | --------------- |
| {{VOID_CHK_1}} | {{VOID_DATE_1}} | {{VOID_PAYEE_1}} | {{VOID_REASON_1}} | {{VOID_AUTH_1}} |
| {{VOID_CHK_2}} | {{VOID_DATE_2}} | {{VOID_PAYEE_2}} | {{VOID_REASON_2}} | {{VOID_AUTH_2}} |

---

## Check Stock Tracking

| Beginning Check # | Ending Check # | Total Checks    | Checks Used | Remaining     |
| ----------------- | -------------- | --------------- | ----------- | ------------- |
| {{START_CHK}}     | {{END_CHK}}    | {{TOT_PRINTED}} | {{USED}}    | {{REMAINING}} |

---

## References

- [Bank Reconciliation](bank_reconciliation.md)
- [General Ledger](general_ledger.md)
