---
template_id: HOA-FIN-004
category: Financial
subcategory: Collections
complexity: Standard
version: 1.0
applicable_to: [HOA, Condo Association, Townhome Association]
frequency: As needed
---

# Assessment Collection Policy

| Field              | Value                |
| ------------------ | -------------------- |
| **Template ID**    | `HOA-FIN-004`        |
| **Category**       | Collections Policy   |
| **Version**        | 1.0                  |
| **Last Updated**   | 2026-03-01           |
| **Association**    | {{ASSOCIATION_NAME}} |
| **Effective Date** | {{EFFECTIVE_DATE}}   |
| **Review Date**    | {{REVIEW_DATE}}      |

---

## Document Control

| Version | Date       | Author          | Changes        |
| ------- | ---------- | --------------- | -------------- |
| 1.0     | 2026-03-01 | {{AUTHOR_NAME}} | Initial policy |

---

## Purpose

This policy establishes procedures for collecting regular and special assessments, defines delinquency thresholds, outlines collection actions, and ensures fair and consistent treatment of all association members.

**Objectives:**

- Ensure timely collection of assessments
- Maintain fair treatment of all members
- Minimize delinquencies
- Preserve property values
- Comply with governing documents and state law

---

## Assessment Obligations

### Regular Assessments

| Assessment Type       | Amount                | Due Date             | Late After            |
| --------------------- | --------------------- | -------------------- | --------------------- |
| Monthly Assessments   | ${{MONTHLY_AMOUNT}}   | {{DUE_DAY}} of month | {{GRACE_PERIOD}} days |
| Quarterly Assessments | ${{QUARTERLY_AMOUNT}} | {{QTR_DUE_DATES}}    | {{GRACE_PERIOD}} days |
| Annual Assessments    | ${{ANNUAL_AMOUNT}}    | {{ANNUAL_DUE_DATE}}  | {{GRACE_PERIOD}} days |

### Special Assessments

| Assessment    | Amount Per Unit    | Purpose       | Due Date  |
| ------------- | ------------------ | ------------- | --------- |
| {{SPECIAL_1}} | ${{SPECIAL_AMT_1}} | {{PURPOSE_1}} | {{DUE_1}} |
| {{SPECIAL_2}} | ${{SPECIAL_AMT_2}} | {{PURPOSE_2}} | {{DUE_2}} |

---

## Collection Timeline

```mermaid
flowchart TD
    A[Assessment Due] --> B{Payment Received?}
    B -->|Yes| C[Payment Processed]
    B -->|No| D[Day {{GRACE_PERIOD}}: Account Delinquent]
    D --> E[Late Fee Applied: ${{LATE_FEE}}]
    E --> F{Payment Received?}
    F -->|Yes| C
    F -->|No| G[Day {{DAYS_NOTICE}}: First Notice]
    G --> H{Payment Received?}
    H -->|Yes| C
    H -->|No| I[Day {{DAYS_FINAL}}: Final Notice]
    I --> J{Payment Received?}
    J -->|Yes| C
    J -->|No| K[Day {{DAYS_LIEN}}: Lien Filed]
    K --> L[Legal Action Initiated]
```

### Detailed Timeline

| Day              | Action                   | Responsible | Cost to Owner    |
| ---------------- | ------------------------ | ----------- | ---------------- |
| {{DUE_DAY}}      | Assessment Due           | -           | -                |
| {{GRACE_PERIOD}} | Grace Period Ends        | Treasurer   | -                |
| {{LATE_FEE_DAY}} | Late Fee: ${{LATE_FEE}}  | Treasurer   | ${{LATE_FEE}}    |
| {{NOTICE_DAY}}   | First Delinquency Notice | Manager     | ${{NOTICE_COST}} |
| {{FINAL_DAY}}    | Final Notice Sent        | Manager     | ${{FINAL_COST}}  |
| {{LIEN_DAY}}     | Lien Filed               | Attorney    | ${{LIEN_COST}}   |
| {{LEGAL_DAY}}    | Legal Action             | Attorney    | ${{LEGAL_COST}}  |

---

## Late Fees & Charges

### Late Fee Structure

| Days Late            | Fee             | Cumulative        |
| -------------------- | --------------- | ----------------- |
| {{GRACE_PERIOD}}+    | ${{LATE_FEE_1}} | ${{LATE_FEE_1}}   |
| {{SECOND_LATE_DAY}}+ | ${{LATE_FEE_2}} | ${{CUMULATIVE_2}} |
| {{THIRD_LATE_DAY}}+  | ${{LATE_FEE_3}} | ${{CUMULATIVE_3}} |

**Maximum Late Fees:** ${{MAX_LATE_FEES}} per delinquency

### Interest Charges

| Balance Age    | Interest Rate | Calculation |
| -------------- | ------------- | ----------- |
| {{AGE_1}} days | {{RATE_1}}%   | {{CALC_1}}  |
| {{AGE_2}} days | {{RATE_2}}%   | {{CALC_2}}  |

**Annual Interest Cap:** {{INTEREST_CAP}}%

---

## Collection Procedures

### Step 1: Grace Period Reminder

**Timing:** {{GRACE_PERIOD}} days after due date
**Action:** Send courtesy reminder
**Cost:** None

**Template:** "Your assessment payment was due on {{DUE_DATE}}. If payment has been sent, please disregard this notice."

### Step 2: First Delinquency Notice

**Timing:** {{FIRST_NOTICE_DAY}} days after due date
**Action:** Formal delinquency notice
**Cost:** ${{FIRST_NOTICE_COST}}

**Required Elements:**

- Amount due
- Late fees applied
- Deadline for payment
- Consequences of non-payment

### Step 3: Final Notice

**Timing:** {{FINAL_NOTICE_DAY}} days after due date
**Action:** Final demand before legal action
**Cost:** ${{FINAL_NOTICE_COST}}

**Required Elements:**

- Total amount due
- Legal action warning
- Payment deadline
- Contact information

### Step 4: Lien Filing

**Timing:** {{LIEN_DAY}} days after due date
**Action:** File notice of lien
**Cost:** ${{LIEN_COST}}

**Requirements:**

- Board approval
- Legal review
- Proper recording
- Owner notification

### Step 5: Legal Action

**Timing:** {{LEGAL_DAY}} days after due date
**Action:** Initiate foreclosure or lawsuit
**Cost:** ${{LEGAL_COST}}

**Types:**

- Foreclosure action
- Civil suit
- Small claims

---

## Payment Plan Options

### Standard Payment Plan

| Criteria            | Terms                   |
| ------------------- | ----------------------- |
| **Eligibility**     | {{ELIGIBILITY}}         |
| **Minimum Balance** | ${{MIN_BALANCE}}        |
| **Down Payment**    | {{DOWN_PCT}}%           |
| **Installments**    | {{NUM_PAYMENTS}} months |
| **Interest Rate**   | {{PLAN_INTEREST}}%      |

### Hardship Plan

| Criteria             | Terms                 |
| -------------------- | --------------------- |
| **Eligibility**      | Demonstrated hardship |
| **Documentation**    | {{REQUIRED_DOCS}}     |
| **Maximum Duration** | {{MAX_MONTHS}} months |
| **Late Fees**        | {{FEE_WAIVER}}        |
| **Interest**         | {{INTEREST_WAIVER}}   |

### Payment Plan Agreement Template

```
PAYMENT PLAN AGREEMENT

Owner: {{OWNER_NAME}}
Unit: {{UNIT_NUMBER}}
Total Balance: ${{TOTAL_BALANCE}}
Down Payment: ${{DOWN_PAYMENT}}
Remaining Balance: ${{REMAINING}}
Monthly Payment: ${{MONTHLY_PMT}}
Number of Payments: {{NUM_PMTS}}
Start Date: {{START_DATE}}
End Date: {{END_DATE}}

Terms:
1. Payments due by {{DUE_DATE}} each month
2. Late fee of ${{PLAN_LATE_FEE}} if not received by {{GRACE_DATE}}
3. Failure to make {{MAX_MISSED}} consecutive payments voids agreement
4. Full balance becomes immediately due upon default

Signature: ___________________ Date: ___________
Owner Signature: ___________________ Date: ___________
```

---

## Owner Notification Requirements

### Notice Content

Each delinquency notice must include:

- [ ] Specific amount due
- [ ] Breakdown (assessments, fees, interest)
- [ ] Due date
- [ ] Payment instructions
- [ ] Contact information
- [ ] Appeal rights
- [ ] Consequences of non-payment

### Delivery Methods

| Method           | Timing              | Proof Required  |
| ---------------- | ------------------- | --------------- |
| Certified Mail   | {{CERT_TIMING}}     | Return receipt  |
| Regular Mail     | {{REG_TIMING}}      | Postmark record |
| Email            | {{EMAIL_TIMING}}    | Read receipt    |
| Personal Service | {{PERSONAL_TIMING}} | Affidavit       |

---

## Lien Procedures

### Pre-Lien Requirements

Before filing a lien:

- [ ] Board approval obtained
- [ ] {{MIN_BALANCE_LIEN}} minimum balance
- [ ] {{MIN_AGE_LIEN}} days delinquent
- [ ] All notices sent
- [ ] Legal review completed

### Lien Contents

| Required Element     | Details           |
| -------------------- | ----------------- |
| Owner name           | {{OWNER_NAME}}    |
| Property description | {{LEGAL_DESC}}    |
| Amount due           | ${{LIEN_AMOUNT}}  |
| Assessment period    | {{ASSESS_PERIOD}} |
| Recording date       | {{RECORD_DATE}}   |

### Lien Release

**Automatic Release:** Upon full payment
**Timeline:** {{RELEASE_TIMELINE}} days
**Cost:** ${{RELEASE_COST}}

---

## Special Circumstances

### Bankruptcy

**Automatic Stay:** Collection activities must cease
**Documentation:** Provide proof of claim
**Timeline:** Follow bankruptcy court orders

### Estate/Probate

**Collection from:** Estate assets
**Timeline:** Follow probate proceedings
**Special documentation:** Death certificate, estate documents

### Military Service

**SCRA Protection:** May limit certain actions
**Documentation:** Military orders
**Compliance:** Follow federal requirements

---

## Record Keeping

### Required Documentation

| Document            | Retention Period          | Location     |
| ------------------- | ------------------------- | ------------ |
| Payment history     | {{RETENTION_YEARS}} years | {{LOCATION}} |
| Delinquency notices | {{RETENTION_YEARS}} years | {{LOCATION}} |
| Lien records        | {{RETENTION_YEARS}} years | {{LOCATION}} |
| Payment plans       | {{RETENTION_YEARS}} years | {{LOCATION}} |
| Legal actions       | {{RETENTION_YEARS}} years | {{LOCATION}} |

### Privacy

**Protected Information:**

- Payment status details
- Financial hardship information
- Personal circumstances

**Access:** Treasurer, Manager, Attorney only

---

## Appeals Process

### Grounds for Appeal

| Reason          | Required Documentation  |
| --------------- | ----------------------- |
| Billing error   | Proof of payment        |
| Hardship        | Financial documentation |
| Disputed charge | Supporting evidence     |

### Appeal Timeline

1. **File appeal:** Within {{APPEAL_DAYS}} days of notice
2. **Board review:** Within {{REVIEW_DAYS}} days
3. **Decision:** Within {{DECISION_DAYS}} days
4. **Payment due:** {{PAYMENT_DAYS}} days after decision

---

## Legal Compliance

### State Law Requirements

| Requirement     | Compliance Method |
| --------------- | ----------------- |
| {{STATE_REQ_1}} | {{COMPLIANCE_1}}  |
| {{STATE_REQ_2}} | {{COMPLIANCE_2}}  |
| {{STATE_REQ_3}} | {{COMPLIANCE_3}}  |

### Governing Documents

**Authority:** {{CCRS_SECTION}}
**Assessment Amount:** {{BYLAWS_SECTION}}
**Collection Rights:** {{RULES_SECTION}}

---

## Board Responsibilities

### Treasurer

- Monitor delinquencies
- Approve payment plans
- Authorize legal action
- Report to board

### Property Manager

- Send notices
- Process payments
- Maintain records
- Coordinate with attorney

### Board of Directors

- Set policy
- Approve legal action
- Review hardship cases
- Ensure compliance

---

## Annual Review

This policy shall be reviewed annually by the Board of Directors.

**Last Review:** {{LAST_REVIEW}}
**Next Review:** {{NEXT_REVIEW}}
**Changes Made:** {{CHANGES}}

---

## Acknowledgment

I have read and understand the Assessment Collection Policy of {{ASSOCIATION_NAME}}.

Owner Signature: ********\_\_\_******** Date: ****\_\_\_****

---

## References

- [Delinquency Report](delinquency_report.md)
- [Treasurer's Report](treasurers_report.md)

See [\_shared/conventions.md](../../_shared/conventions.md) for policy standards.
