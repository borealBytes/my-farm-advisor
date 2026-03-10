---
template_id: HOA-FIN-008
category: Financial
subcategory: Statements
complexity: Standard
version: 1.0
applicable_to: [HOA, Condo Association, Townhome Association]
frequency: Monthly, Quarterly, Annually
---

# Income Statement (Profit & Loss)

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Template ID**  | `HOA-FIN-008`                  |
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

This Income Statement summarizes revenues and expenses for the period, showing net income or loss.

---

## Revenue

| Category            | Budget               | Actual               | Variance             | % of Budget          |
| ------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| Regular Assessments | ${{BUD_REG}}         | ${{ACT_REG}}         | ${{VAR_REG}}         | {{PCT_REG}}%         |
| Special Assessments | ${{BUD_SPEC}}        | ${{ACT_SPEC}}        | ${{VAR_SPEC}}        | {{PCT_SPEC}}%        |
| Late Fees           | ${{BUD_LATE}}        | ${{ACT_LATE}}        | ${{VAR_LATE}}        | {{PCT_LATE}}%        |
| Interest Income     | ${{BUD_INT}}         | ${{ACT_INT}}         | ${{VAR_INT}}         | {{PCT_INT}}%         |
| Other Income        | ${{BUD_OTHER}}       | ${{ACT_OTHER}}       | ${{VAR_OTHER}}       | {{PCT_OTHER}}%       |
| **Total Revenue**   | **${{BUD_TOT_REV}}** | **${{ACT_TOT_REV}}** | **${{VAR_TOT_REV}}** | **{{PCT_TOT_REV}}%** |

---

## Expenses

### Administrative

| Category                    | Budget             | Actual             | Variance           | % of Budget        |
| --------------------------- | ------------------ | ------------------ | ------------------ | ------------------ |
| Management Fees             | ${{BUD_MGMT}}      | ${{ACT_MGMT}}      | ${{VAR_MGMT}}      | {{PCT_MGMT}}%      |
| Legal/Accounting            | ${{BUD_LEGAL}}     | ${{ACT_LEGAL}}     | ${{VAR_LEGAL}}     | {{PCT_LEGAL}}%     |
| Insurance                   | ${{BUD_INS_ADMIN}} | ${{ACT_INS_ADMIN}} | ${{VAR_INS_ADMIN}} | {{PCT_INS_ADMIN}}% |
| Office Supplies             | ${{BUD_OFFICE}}    | ${{ACT_OFFICE}}    | ${{VAR_OFFICE}}    | {{PCT_OFFICE}}%    |
| Communications              | ${{BUD_COMM}}      | ${{ACT_COMM}}      | ${{VAR_COMM}}      | {{PCT_COMM}}%      |
| **Administrative Subtotal** | **${{BUD_ADMIN}}** | **${{ACT_ADMIN}}** | **${{VAR_ADMIN}}** | **{{PCT_ADMIN}}%** |

### Operating

| Category               | Budget            | Actual            | Variance          | % of Budget       |
| ---------------------- | ----------------- | ----------------- | ----------------- | ----------------- |
| Utilities              | ${{BUD_UTIL}}     | ${{ACT_UTIL}}     | ${{VAR_UTIL}}     | {{PCT_UTIL}}%     |
| Maintenance            | ${{BUD_MAINT}}    | ${{ACT_MAINT}}    | ${{VAR_MAINT}}    | {{PCT_MAINT}}%    |
| Landscaping            | ${{BUD_LAND}}     | ${{ACT_LAND}}     | ${{VAR_LAND}}     | {{PCT_LAND}}%     |
| Snow Removal           | ${{BUD_SNOW}}     | ${{ACT_SNOW}}     | ${{VAR_SNOW}}     | {{PCT_SNOW}}%     |
| **Operating Subtotal** | **${{BUD_OPER}}** | **${{ACT_OPER}}** | **${{VAR_OPER}}** | **{{PCT_OPER}}%** |

### Insurance

| Category               | Budget            | Actual            | Variance          | % of Budget       |
| ---------------------- | ----------------- | ----------------- | ----------------- | ----------------- |
| Property/Liability     | ${{BUD_PROP_INS}} | ${{ACT_PROP_INS}} | ${{VAR_PROP_INS}} | {{PCT_PROP_INS}}% |
| Directors & Officers   | ${{BUD_DO}}       | ${{ACT_DO}}       | ${{VAR_DO}}       | {{PCT_DO}}%       |
| **Insurance Subtotal** | **${{BUD_INS}}**  | **${{ACT_INS}}**  | **${{VAR_INS}}**  | **{{PCT_INS}}%**  |

### Total Expenses

**TOTAL EXPENSES: ${{TOTAL_EXPENSES}}**

---

## Net Income

| Category              | Amount              |
| --------------------- | ------------------- |
| Total Revenue         | ${{TOTAL_REVENUE}}  |
| Total Expenses        | ${{TOTAL_EXPENSES}} |
| **NET INCOME (LOSS)** | **${{NET_INCOME}}** |

```mermaid
xychart-beta
    title "Revenue vs Expenses"
    x-axis [Revenue, Expenses, Net Income]
    y-axis "Amount ($)" 0 --> {{MAX_AMOUNT}}
    bar "Budget" [{{BUD_REV_BAR}}, {{BUD_EXP_BAR}}, {{BUD_NET_BAR}}]
    bar "Actual" [{{ACT_REV_BAR}}, {{ACT_EXP_BAR}}, {{ACT_NET_BAR}}]
```

---

## Variance Analysis

### Significant Variances (>10%)

| Category      | Variance       | Explanation   |
| ------------- | -------------- | ------------- |
| {{VAR_CAT_1}} | ${{VAR_AMT_1}} | {{VAR_EXP_1}} |
| {{VAR_CAT_2}} | ${{VAR_AMT_2}} | {{VAR_EXP_2}} |
| {{VAR_CAT_3}} | ${{VAR_AMT_3}} | {{VAR_EXP_3}} |

---

## Year-to-Date Summary

| Category   | Current Period | YTD Actual   | YTD Budget       | YTD Variance     |
| ---------- | -------------- | ------------ | ---------------- | ---------------- |
| Revenue    | ${{CURR_REV}}  | ${{YTD_REV}} | ${{YTD_BUD_REV}} | {{YTD_VAR_REV}}% |
| Expenses   | ${{CURR_EXP}}  | ${{YTD_EXP}} | ${{YTD_BUD_EXP}} | {{YTD_VAR_EXP}}% |
| Net Income | ${{CURR_NET}}  | ${{YTD_NET}} | ${{YTD_BUD_NET}} | {{YTD_VAR_NET}}% |

---

## References

- [Balance Sheet](balance_sheet.md)
- [Treasurer's Report](treasurers_report.md)

See [\_shared/conventions.md](../../_shared/conventions.md) for financial statement standards.
