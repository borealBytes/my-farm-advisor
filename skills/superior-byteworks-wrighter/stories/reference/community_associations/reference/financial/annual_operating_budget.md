---
template_id: HOA-FIN-002
category: Financial
subcategory: Budget
complexity: Standard
version: 1.0
applicable_to: [HOA, Condo Association, Townhome Association]
frequency: Annual
---

# Annual Operating Budget

| Field             | Value                |
| ----------------- | -------------------- |
| **Template ID**   | `HOA-FIN-002`        |
| **Category**      | Financial Planning   |
| **Version**       | 1.0                  |
| **Last Updated**  | 2026-03-01           |
| **Association**   | {{ASSOCIATION_NAME}} |
| **Fiscal Year**   | {{FISCAL_YEAR}}      |
| **Total Units**   | {{TOTAL_UNITS}}      |
| **Prepared By**   | {{PREPARER_NAME}}    |
| **Date Prepared** | {{PREPARATION_DATE}} |

---

## Document Control

| Version | Date       | Author          | Changes          |
| ------- | ---------- | --------------- | ---------------- |
| 1.0     | 2026-03-01 | {{AUTHOR_NAME}} | Initial template |

---

## Purpose

This Annual Operating Budget establishes the financial roadmap for the association's fiscal year. It projects income from assessments and other sources, allocates funds to operating expenses and reserve contributions, and provides a framework for financial decision-making throughout the year.

**Key Objectives:**

- Ensure adequate funding for operations
- Plan for reserve contributions
- Maintain property values
- Provide transparency to members
- Support board financial oversight

---

## Executive Summary

| Category                 | Prior Year Actual | Current Year Budget | Variance         |
| ------------------------ | ----------------- | ------------------- | ---------------- |
| **Total Revenue**        | ${{PY_REVENUE}}   | ${{CY_BUDGET_REV}}  | {{REV_VAR_PCT}}% |
| **Total Expenses**       | ${{PY_EXPENSES}}  | ${{CY_BUDGET_EXP}}  | {{EXP_VAR_PCT}}% |
| **Net Income**           | ${{PY_NET}}       | ${{CY_BUDGET_NET}}  | {{NET_VAR_PCT}}% |
| **Reserve Contribution** | ${{PY_RESERVE}}   | ${{CY_RESERVE}}     | {{RES_VAR_PCT}}% |

**Assessment Rate:** ${{MONTHLY_ASSESSMENT}}/month per unit
**Annual Assessment Income:** ${{ANNUAL_ASSESSMENT_INCOME}}

---

## Income Budget

### Assessment Income

| Unit Type                   | Number of Units     | Monthly Rate      | Annual Amount                |
| --------------------------- | ------------------- | ----------------- | ---------------------------- |
| Standard Units              | {{STD_UNITS}}       | ${{STD_RATE}}     | ${{STD_ANNUAL}}              |
| Premium Units               | {{PREM_UNITS}}      | ${{PREM_RATE}}    | ${{PREM_ANNUAL}}             |
| Commercial Units            | {{COMM_UNITS}}      | ${{COMM_RATE}}    | ${{COMM_ANNUAL}}             |
| **Total Assessment Income** | **{{TOTAL_UNITS}}** | **${{AVG_RATE}}** | **${{TOTAL_ANNUAL_ASSESS}}** |

### Other Income

| Source                 | Prior Year              | Current Year Budget     | % Change           |
| ---------------------- | ----------------------- | ----------------------- | ------------------ |
| Late Fees              | ${{PY_LATE}}            | ${{CY_LATE}}            | {{LATE_CHG}}%      |
| Interest Income        | ${{PY_INTEREST}}        | ${{CY_INTEREST}}        | {{INT_CHG}}%       |
| Rental Income          | ${{PY_RENTAL}}          | ${{CY_RENTAL}}          | {{RENT_CHG}}%      |
| Miscellaneous          | ${{PY_MISC}}            | ${{CY_MISC}}            | {{MISC_CHG}}%      |
| **Total Other Income** | **${{PY_TOTAL_OTHER}}** | **${{CY_TOTAL_OTHER}}** | **{{OTHER_CHG}}%** |

**Total Budgeted Revenue:** ${{TOTAL_REVENUE}}

---

## Operating Expense Budget

### Administrative Expenses

| Category                    | Prior Year            | Current Year          | Variance           | % of Total         |
| --------------------------- | --------------------- | --------------------- | ------------------ | ------------------ |
| Management Fees             | ${{PY_MGMT}}          | ${{CY_MGMT}}          | {{MGMT_VAR}}%      | {{MGMT_PCT}}%      |
| Legal Fees                  | ${{PY_LEGAL}}         | ${{CY_LEGAL}}         | {{LEGAL_VAR}}%     | {{LEGAL_PCT}}%     |
| Accounting/Audit            | ${{PY_ACCT}}          | ${{CY_ACCT}}          | {{ACCT_VAR}}%      | {{ACCT_PCT}}%      |
| Insurance                   | ${{PY_INS_ADMIN}}     | ${{CY_INS_ADMIN}}     | {{INS_VAR}}%       | {{INS_PCT}}%       |
| Office Supplies             | ${{PY_OFFICE}}        | ${{CY_OFFICE}}        | {{OFFICE_VAR}}%    | {{OFFICE_PCT}}%    |
| Communications              | ${{PY_COMM}}          | ${{CY_COMM}}          | {{COMM_VAR}}%      | {{COMM_PCT}}%      |
| **Administrative Subtotal** | **${{PY_ADMIN_TOT}}** | **${{CY_ADMIN_TOT}}** | **{{ADMIN_VAR}}%** | **{{ADMIN_PCT}}%** |

### Operating Expenses

| Category                 | Prior Year           | Current Year         | Variance          | % of Total        |
| ------------------------ | -------------------- | -------------------- | ----------------- | ----------------- |
| Utilities                | ${{PY_UTIL}}         | ${{CY_UTIL}}         | {{UTIL_VAR}}%     | {{UTIL_PCT}}%     |
| - Electricity            | ${{PY_ELEC}}         | ${{CY_ELEC}}         | {{ELEC_VAR}}%     |                   |
| - Water/Sewer            | ${{PY_WATER}}        | ${{CY_WATER}}        | {{WATER_VAR}}%    |                   |
| - Gas                    | ${{PY_GAS}}          | ${{CY_GAS}}          | {{GAS_VAR}}%      |                   |
| - Trash/Recycling        | ${{PY_TRASH}}        | ${{CY_TRASH}}        | {{TRASH_VAR}}%    |                   |
| Landscaping              | ${{PY_LANDSCAPE}}    | ${{CY_LANDSCAPE}}    | {{LAND_VAR}}%     | {{LAND_PCT}}%     |
| Maintenance              | ${{PY_MAINT}}        | ${{CY_MAINT}}        | {{MAINT_VAR}}%    | {{MAINT_PCT}}%    |
| - Common Area Repairs    | ${{PY_COMMON_REP}}   | ${{CY_COMMON_REP}}   | {{COMMON_VAR}}%   |                   |
| - Preventive Maintenance | ${{PY_PREV}}         | ${{CY_PREV}}         | {{PREV_VAR}}%     |                   |
| - Equipment/Supplies     | ${{PY_EQUIP}}        | ${{CY_EQUIP}}        | {{EQUIP_VAR}}%    |                   |
| Snow Removal             | ${{PY_SNOW}}         | ${{CY_SNOW}}         | {{SNOW_VAR}}%     | {{SNOW_PCT}}%     |
| Pest Control             | ${{PY_PEST}}         | ${{CY_PEST}}         | {{PEST_VAR}}%     | {{PEST_PCT}}%     |
| **Operating Subtotal**   | **${{PY_OPER_TOT}}** | **${{CY_OPER_TOT}}** | **{{OPER_VAR}}%** | **{{OPER_PCT}}%** |

### Property Insurance

| Coverage Type          | Prior Year          | Current Year        | Variance         |
| ---------------------- | ------------------- | ------------------- | ---------------- |
| Property/Liability     | ${{PY_PROP_INS}}    | ${{CY_PROP_INS}}    | {{PROP_VAR}}%    |
| Directors & Officers   | ${{PY_DO_INS}}      | ${{CY_DO_INS}}      | {{DO_VAR}}%      |
| Workers Compensation   | ${{PY_WORKERS}}     | ${{CY_WORKERS}}     | {{WORKERS_VAR}}% |
| **Insurance Subtotal** | **${{PY_INS_TOT}}** | **${{CY_INS_TOT}}** | **{{INS_VAR}}%** |

### Reserve Contribution

| Reserve Fund                  | Prior Year      | Current Year    | Variance         |
| ----------------------------- | --------------- | --------------- | ---------------- |
| Operating to Reserve Transfer | ${{PY_RESERVE}} | ${{CY_RESERVE}} | {{RESERVE_VAR}}% |

**Total Budgeted Expenses:** ${{TOTAL_EXPENSES}}

---

## Budget Summary

```mermaid
pie title Operating Budget Distribution
    "Administrative" : {{ADMIN_PCT}}
    "Utilities" : {{UTIL_PCT}}
    "Landscaping" : {{LAND_PCT}}
    "Maintenance" : {{MAINT_PCT}}
    "Insurance" : {{INS_PCT}}
    "Reserve" : {{RESERVE_PCT}}
```

| Summary Item             | Amount               | % of Revenue         |
| ------------------------ | -------------------- | -------------------- |
| **Total Revenue**        | ${{TOTAL_REVENUE}}   | 100%                 |
| **Operating Expenses**   | ${{TOTAL_OPERATING}} | {{OPER_PCT_REV}}%    |
| **Reserve Contribution** | ${{RESERVE_CONTRIB}} | {{RESERVE_PCT_REV}}% |
| **Total Expenses**       | ${{TOTAL_EXPENSES}}  | {{EXP_PCT_REV}}%     |
| **Net Operating Income** | ${{NET_OPERATING}}   | {{NET_PCT_REV}}%     |

---

## Variance Analysis

### Revenue Variances

| Source                       | Budget             | Conservative     | Optimistic      |
| ---------------------------- | ------------------ | ---------------- | --------------- |
| Assessments (95% collection) | ${{BUDGET_ASSESS}} | ${{CONS_ASSESS}} | ${{OPT_ASSESS}} |
| Late Fees (varies)           | ${{BUDGET_LATE}}   | ${{CONS_LATE}}   | ${{OPT_LATE}}   |
| Other Income                 | ${{BUDGET_OTHER}}  | ${{CONS_OTHER}}  | ${{OPT_OTHER}}  |

### Expense Contingencies

| Category       | Budgeted          | Contingency (10%)     | Total with Reserve |
| -------------- | ----------------- | --------------------- | ------------------ |
| Major Repairs  | ${{BUDGET_MAJOR}} | ${{CONTINGENCY}}      | ${{TOTAL_MAJOR}}   |
| Emergency Fund | ${{BUDGET_EMERG}} | {{EMERG_CONTINGENCY}} | ${{TOTAL_EMERG}}   |

---

## Monthly Cash Flow Projection

| Month     | Revenue            | Expenses           | Net                | Cumulative   |
| --------- | ------------------ | ------------------ | ------------------ | ------------ |
| January   | ${{JAN_REV}}       | ${{JAN_EXP}}       | ${{JAN_NET}}       | ${{JAN_CUM}} |
| February  | ${{FEB_REV}}       | ${{FEB_EXP}}       | ${{FEB_NET}}       | ${{FEB_CUM}} |
| March     | ${{MAR_REV}}       | ${{MAR_EXP}}       | ${{MAR_NET}}       | ${{MAR_CUM}} |
| April     | ${{APR_REV}}       | ${{APR_EXP}}       | ${{APR_NET}}       | ${{APR_CUM}} |
| May       | ${{MAY_REV}}       | ${{MAY_EXP}}       | ${{MAY_NET}}       | ${{MAY_CUM}} |
| June      | ${{JUN_REV}}       | ${{JUN_EXP}}       | ${{JUN_NET}}       | ${{JUN_CUM}} |
| July      | ${{JUL_REV}}       | ${{JUL_EXP}}       | ${{JUL_NET}}       | ${{JUL_CUM}} |
| August    | ${{AUG_REV}}       | ${{AUG_EXP}}       | ${{AUG_NET}}       | ${{AUG_CUM}} |
| September | ${{SEP_REV}}       | ${{SEP_EXP}}       | ${{SEP_NET}}       | ${{SEP_CUM}} |
| October   | ${{OCT_REV}}       | ${{OCT_EXP}}       | ${{OCT_NET}}       | ${{OCT_CUM}} |
| November  | ${{NOV_REV}}       | ${{NOV_EXP}}       | ${{NOV_NET}}       | ${{NOV_CUM}} |
| December  | ${{DEC_REV}}       | ${{DEC_EXP}}       | ${{DEC_NET}}       | ${{DEC_CUM}} |
| **Total** | **${{TOTAL_REV}}** | **${{TOTAL_EXP}}** | **${{TOTAL_NET}}** |              |

---

## Board Approvals

| Role            | Name               | Signature          | Date     |
| --------------- | ------------------ | ------------------ | -------- |
| Treasurer       | {{TREASURER_NAME}} | ******\_\_\_****** | {{DATE}} |
| Board President | {{PRESIDENT_NAME}} | ******\_\_\_****** | {{DATE}} |
| Board Member    | {{BOARD_1}}        | ******\_\_\_****** | {{DATE}} |
| Board Member    | {{BOARD_2}}        | ******\_\_\_****** | {{DATE}} |

**Approved at Board Meeting:** {{MEETING_DATE}}

---

## Member Notification

**Budget Dissemination:**

- [ ] Posted to website: {{WEBSITE_DATE}}
- [ ] Mailed to members: {{MAIL_DATE}}
- [ ] Included in newsletter: {{NEWSLETTER_DATE}}
- [ ] Available at office: {{OFFICE_DATE}}

---

## References

- [Treasurer's Report](treasurers_report.md)
- [Reserve Study](reserve_study.md)
- [Assessment Collection Policy](assessment_collection_policy.md)

See [\_shared/conventions.md](../../_shared/conventions.md) for budget standards.
