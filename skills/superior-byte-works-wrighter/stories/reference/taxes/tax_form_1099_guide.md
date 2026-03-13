# Form 1099/1098 Filing Procedures Guide

---

## Document Control

| Field               | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| **Tax Year**        | [YYYY]                                                   |
| **Entity Name**     | [Legal Entity Name]                                      |
| **EIN**             | [XX-XXXXXXX]                                             |
| **Filing Deadline** | January 31, [YYYY+1] (recipient and IRS for 1099-NEC)    |
| **Prepared By**     | [AP Manager/Accountant Name]                             |
| **Reviewed By**     | [Tax Manager/Controller Name]                            |
| **Filing Method**   | [ ] Electronic (mandatory if 10+ forms) [ ] Paper        |
| **Status**          | [ ] Data Collection [ ] Preparation [ ] Review [ ] Filed |
| **Version**         | [X.X]                                                    |

---

## Regulatory References

- **IRC §6041** — Information at source (payments of $600 or more)
- **IRC §6041A** — Returns regarding payments of remuneration for services
- **IRC §6042** — Returns regarding payments of dividends
- **IRC §6049** — Returns regarding payments of interest
- **IRC §6050W** — Returns relating to payments made in settlement of payment card transactions
- **IRC §6721** — Failure to file correct information returns (penalties to IRS)
- **IRC §6722** — Failure to furnish correct payee statements (penalties to recipient)
- **Treas. Reg. §1.6041-1** — Return of information as to payments
- **IRS Publication 1220** — Specifications for Electronic Filing of Forms 1097-1099
- **IRC §3406** — Backup withholding

---

## Form 1099 Overview and Thresholds

| Form      | Description                      | Reporting Threshold  | Due to Recipient | Due to IRS (Paper) | Due to IRS (E-file) |
| --------- | -------------------------------- | -------------------- | ---------------- | ------------------ | ------------------- |
| 1099-NEC  | Non-employee compensation        | $600                 | Jan 31           | Jan 31             | Jan 31              |
| 1099-MISC | Rents, royalties, other income   | $600 ($10 royalties) | Jan 31           | Feb 28             | Mar 31              |
| 1099-INT  | Interest income                  | $10                  | Jan 31           | Feb 28             | Mar 31              |
| 1099-DIV  | Dividends and distributions      | $10                  | Jan 31           | Feb 28             | Mar 31              |
| 1099-K    | Payment card/third-party network | $600                 | Jan 31           | Feb 28             | Mar 31              |
| 1099-R    | Distributions from retirement    | $10                  | Jan 31           | Feb 28             | Mar 31              |
| 1099-S    | Real estate transactions         | $600                 | Jan 31           | Feb 28             | Mar 31              |
| 1099-B    | Broker and barter exchange       | Any                  | Feb 15           | Feb 28             | Mar 31              |
| 1099-C    | Cancellation of debt             | $600                 | Jan 31           | Feb 28             | Mar 31              |
| 1098      | Mortgage interest received       | $600                 | Jan 31           | Feb 28             | Mar 31              |
| 1098-T    | Tuition payments                 | Any                  | Jan 31           | Feb 28             | Mar 31              |

---

## Filing Process — Master Timeline

| Step | Action                                          | Responsible Party | Deadline        | Completed |
| ---- | ----------------------------------------------- | ----------------- | --------------- | --------- |
| 1    | Begin vendor payment analysis for tax year      | AP Manager        | Dec 1           | [ ]       |
| 2    | Run AP reports: vendors paid $600+              | AP System / IT    | Dec 1-10        | [ ]       |
| 3    | Identify reportable vs. non-reportable payments | AP Manager        | Dec 10-15       | [ ]       |
| 4    | Identify missing or expired W-9 forms           | AP Team           | Dec 15-20       | [ ]       |
| 5    | Send W-9 solicitation letters (first request)   | AP Team           | Dec 20          | [ ]       |
| 6    | Send W-9 solicitation letters (second request)  | AP Team           | Jan 5           | [ ]       |
| 7    | Verify TINs via IRS TIN Matching Program        | AP Manager        | Jan 5-15        | [ ]       |
| 8    | Compile final 1099 data file                    | AP Manager        | Jan 15-20       | [ ]       |
| 9    | Prepare and review draft 1099 forms             | AP Manager / Tax  | Jan 20-25       | [ ]       |
| 10   | Obtain management review and approval           | Controller        | Jan 25-28       | [ ]       |
| 11   | File 1099-NEC with IRS (no extension available) | E-file system     | Jan 31          | [ ]       |
| 12   | Distribute 1099 statements to recipients        | Mail / Portal     | Jan 31          | [ ]       |
| 13   | File remaining 1099s/1098s with IRS             | E-file system     | Mar 31 (e-file) | [ ]       |
| 14   | Reconcile filed forms to general ledger         | Tax Manager       | Apr 15          | [ ]       |
| 15   | Archive all supporting documentation            | AP Team           | Apr 30          | [ ]       |

---

## W-9 Collection and TIN Verification

### W-9 Solicitation Process

- [ ] Identify all vendors/payees requiring W-9 (IRC §6041, §6041A)
- [ ] Cross-reference existing W-9 files for completeness and currency
- [ ] Send Form W-9 request via certified mail or secure portal
- [ ] Document all solicitation attempts (date, method, response)
- [ ] Flag non-responsive vendors for backup withholding (IRC §3406)
- [ ] Verify W-9 completeness: name, TIN, entity type, signature, date

### TIN Verification Checklist

| Vendor Name | TIN on File   | TIN Match Result       | W-9 Current    | Backup W/H Required | Status |
| ----------- | ------------- | ---------------------- | -------------- | ------------------- | ------ |
| [Vendor 1]  | [XXX-XX-XXXX] | [ ] Match [ ] Mismatch | [ ] Yes [ ] No | [ ] Yes [ ] No      | [ ]    |
| [Vendor 2]  | [XX-XXXXXXX]  | [ ] Match [ ] Mismatch | [ ] Yes [ ] No | [ ] Yes [ ] No      | [ ]    |
| [Vendor 3]  | [XXX-XX-XXXX] | [ ] Match [ ] Mismatch | [ ] Yes [ ] No | [ ] Yes [ ] No      | [ ]    |

### Backup Withholding Requirements (IRC §3406)

Backup withholding at 24% is required when:

- [ ] Payee fails to furnish TIN
- [ ] IRS notifies of incorrect TIN (B-Notice)
- [ ] Payee fails to certify TIN is correct
- [ ] IRS notifies that payee underreported interest/dividends

---

## Reportable vs. Non-Reportable Payment Classification

### Reportable Payments (1099-NEC / 1099-MISC)

- [ ] Independent contractor services ($600+)
- [ ] Attorney fees ($600+) — regardless of entity type per IRC §6045(f)
- [ ] Rent payments ($600+)
- [ ] Royalties ($10+)
- [ ] Prizes and awards ($600+)
- [ ] Medical and healthcare payments ($600+)
- [ ] Fishing boat proceeds
- [ ] Crop insurance proceeds
- [ ] Gross proceeds paid to attorneys ($600+)

### Non-Reportable Payments (Exclusions)

- [ ] Payments to C-Corporations (except attorneys, medical, fish purchases)
- [ ] Payments for merchandise, inventory, freight, storage
- [ ] Payments made via credit card or payment network (reported on 1099-K)
- [ ] Payments below reporting threshold
- [ ] Employee wages (reported on W-2)
- [ ] Payments to tax-exempt organizations (with documented exemption)
- [ ] Utility payments
- [ ] Telephone and internet service

---

## Quality Review Checklist

### Pre-Filing Review

- [ ] Verify legal name matches TIN (SSN or EIN)
- [ ] Confirm entity type classification (individual, LLC, corporation)
- [ ] Validate all dollar amounts against general ledger
- [ ] Reconcile total 1099 amounts to AP payment reports
- [ ] Verify correct form type used (NEC vs. MISC)
- [ ] Confirm correct box placement for each payment type
- [ ] Check for duplicate forms (same payee, same income type)
- [ ] Verify mailing addresses are current
- [ ] Confirm electronic filing format per IRS Pub 1220
- [ ] Review for combined federal/state filing program applicability

### Reconciliation

| Category                   | GL Balance | 1099 Total | Variance | Explanation |
| -------------------------- | ---------- | ---------- | -------- | ----------- |
| Contractor payments (NEC)  | $[X]       | $[X]       | $[X]     | [Explain]   |
| Rent payments (MISC Box 1) | $[X]       | $[X]       | $[X]     | [Explain]   |
| Royalties (MISC Box 2)     | $[X]       | $[X]       | $[X]     | [Explain]   |
| Attorney fees (NEC/MISC)   | $[X]       | $[X]       | $[X]     | [Explain]   |
| Other reportable (MISC)    | $[X]       | $[X]       | $[X]     | [Explain]   |
| **Total**                  | **$[X]**   | **$[X]**   | **$[X]** |             |

---

## Penalty Schedule (IRC §6721 / §6722)

### Penalties for Failure to File Correct Information Returns (to IRS)

| Filing Timeframe              | Per Form Penalty        | Small Business Cap | Large Business Cap |
| ----------------------------- | ----------------------- | ------------------ | ------------------ |
| Within 30 days of due date    | $60                     | $220,500           | $630,500           |
| 31 days late through August 1 | $120                    | $630,500           | $1,891,500         |
| After August 1 or not filed   | $310                    | $1,135,000         | $3,783,000         |
| Intentional disregard         | $630 (or 10% of amount) | No cap             | No cap             |

### Penalties for Failure to Furnish Correct Payee Statements (to recipient)

| Filing Timeframe                | Per Statement Penalty   | Small Business Cap | Large Business Cap |
| ------------------------------- | ----------------------- | ------------------ | ------------------ |
| Within 30 days of due date      | $60                     | $220,500           | $630,500           |
| 31 days late through August 1   | $120                    | $630,500           | $1,891,500         |
| After August 1 or not furnished | $310                    | $1,135,000         | $3,783,000         |
| Intentional disregard           | $630 (or 10% of amount) | No cap             | No cap             |

**Note**: Penalty amounts are indexed for inflation annually per IRC §6721(f). Verify current-year amounts via IRS Rev. Proc.

---

## Corrections Process

### Filing Corrected Forms

| Scenario                | Action                                          | Form           | Deadline            |
| ----------------------- | ----------------------------------------------- | -------------- | ------------------- |
| Incorrect dollar amount | File corrected 1099 (Type 1 — one transaction)  | Corrected form | As soon as possible |
| Incorrect TIN or name   | File corrected 1099 (Type 2 — two transactions) | Corrected form | As soon as possible |
| Filed wrong form type   | Void original + file correct form               | Both forms     | As soon as possible |
| Should not have filed   | File corrected form with $0 amounts             | Corrected form | As soon as possible |

### Correction Tracking

| Original Form | Payee  | Error Type    | Corrected Form Filed | Date   | Status       |
| ------------- | ------ | ------------- | -------------------- | ------ | ------------ |
| [Form type]   | [Name] | [Description] | [ ] Yes [ ] No       | [Date] | [ ] Complete |

---

## State Filing Requirements

| State     | Combined Filing Program | Separate Filing Required | Due Date | Status    |
| --------- | ----------------------- | ------------------------ | -------- | --------- |
| [State 1] | [ ] Yes [ ] No          | [ ] Yes [ ] No           | [Date]   | [ ] Filed |
| [State 2] | [ ] Yes [ ] No          | [ ] Yes [ ] No           | [Date]   | [ ] Filed |
| [State 3] | [ ] Yes [ ] No          | [ ] Yes [ ] No           | [Date]   | [ ] Filed |

**Note**: The Combined Federal/State Filing (CF/SF) Program allows the IRS to forward 1099 data to participating states. Verify participation at IRS Pub 1220.

---

## Sign-offs

| Role                   | Name | Signature | Date |
| ---------------------- | ---- | --------- | ---- |
| AP Manager (Preparer)  |      |           |      |
| Tax Manager (Reviewer) |      |           |      |
| Controller (Approver)  |      |           |      |

---

## Revision History

| Version | Date   | Author | Changes                  |
| ------- | ------ | ------ | ------------------------ |
| 1.0     | [Date] | [Name] | Initial filing guide     |
| 1.1     | [Date] | [Name] | [Description of changes] |

---

**Regulatory Disclaimer**: This guide is a procedural reference and does not constitute tax advice. Filing thresholds and penalty amounts are subject to annual inflation adjustments. Consult current IRS publications and qualified tax counsel for authoritative guidance.
