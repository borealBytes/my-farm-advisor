# Billing Standard Operating Procedures

---

## Document Control

| Field              | Value                                 |
| ------------------ | ------------------------------------- |
| **Document ID**    | FIN-SOP-[XXX]                         |
| **Document Title** | Billing Standard Operating Procedures |
| **Version**        | [X.X]                                 |
| **Effective Date** | [DD-MMM-YYYY]                         |
| **Supersedes**     | Version [X.X] dated [DD-MMM-YYYY]     |
| **Prepared By**    | [AR Manager Name]                     |
| **Reviewed By**    | [Director of Finance]                 |
| **Approved By**    | [CFO/Controller]                      |
| **Review Cycle**   | Annual or upon process change         |
| **Classification** | Internal — Finance Operations         |
| **Distribution**   | Finance, AR Team, Sales Operations    |

---

## 1. Purpose

This document defines the standard operating procedures for all billing and invoicing activities at [Company Name]. It ensures accuracy, consistency, and timeliness in the generation, distribution, and management of customer invoices. All Accounts Receivable personnel must follow these procedures.

---

## 2. Scope

These procedures cover:

- Monthly and ad hoc invoice generation
- Invoice review and quality assurance
- Invoice distribution and delivery
- New customer billing setup
- Invoice corrections and credit memos
- Recurring billing management
- Revenue recognition alignment
- Month-end and year-end billing close

**Exclusions:** Payroll processing, vendor payments, and intercompany billing are governed by separate SOPs.

---

## 3. Roles and Responsibilities

| Role                    | Responsibilities                                         |
| ----------------------- | -------------------------------------------------------- |
| **AR Specialist**       | Generate invoices, apply payments, send statements       |
| **AR Manager**          | Review invoices, approve corrections, manage escalations |
| **Director of Finance** | Approve credit memos > $5,000, oversee AR aging          |
| **CFO/Controller**      | Final authority on write-offs, policy exceptions         |
| **Sales Operations**    | Provide deal terms, validate contract pricing            |
| **Revenue Accounting**  | Ensure billing aligns with ASC 606 recognition           |
| **IT/Systems**          | Maintain billing system, integrations, and automation    |

---

## 4. Monthly Billing Cycle

### 4.1 Billing Calendar

| Day of Month      | Activity                                | Owner              | Deliverable                            |
| ----------------- | --------------------------------------- | ------------------ | -------------------------------------- |
| 1st               | Generate usage/consumption reports      | Billing System     | Raw usage data                         |
| 1st–2nd           | Import contract data and rate schedules | AR Specialist      | Billing input file                     |
| 2nd–3rd           | Run preliminary invoice batch           | AR Specialist      | Draft invoice batch                    |
| 3rd–4th           | Quality assurance review                | AR Manager         | Reviewed batch with exceptions flagged |
| 4th–5th           | Resolve exceptions and discrepancies    | AR Specialist      | Corrected invoices                     |
| 5th–6th           | Final batch approval                    | AR Manager         | Approved invoice batch                 |
| 7th               | Distribute invoices to customers        | Billing System     | Delivered invoices                     |
| 7th–10th          | Post revenue entries to general ledger  | Revenue Accounting | GL journal entries                     |
| 15th              | First AR aging review                   | AR Manager         | Aging report                           |
| 20th              | Initiate first-notice collections cycle | AR Specialist      | Past-due notices sent                  |
| Last business day | Month-end AR reconciliation             | AR Manager         | Reconciliation workpaper               |

### 4.2 Invoice Generation Procedure

1. **Extract billing data** — Pull usage, subscription, and project data from the billing system for the current period
2. **Apply rate schedules** — Match each line item to the contractual rate schedule, including tiered pricing, volume discounts, and promotional rates
3. **Calculate taxes** — Apply applicable sales tax, VAT, or use tax based on customer jurisdiction and tax-exempt status
4. **Generate draft invoices** — Run the invoice batch in draft mode for review
5. **Validate totals** — Compare batch total to expected revenue forecast; investigate variances exceeding 5%
6. **Flag exceptions** — Identify invoices with missing PO numbers, expired contracts, or pricing discrepancies
7. **Finalize batch** — Upon manager approval, convert draft invoices to final and assign sequential invoice numbers

### 4.3 Invoice Numbering Convention

All invoices follow the format: **INV-[YYYY]-[NNNNN]**

- **INV** — Document type prefix
- **YYYY** — Fiscal year
- **NNNNN** — Sequential five-digit number (auto-assigned, no gaps)

Credit memos follow: **CM-[YYYY]-[NNNNN]**

---

## 5. Invoice Quality Assurance

### 5.1 Review Checklist

Each invoice must pass the following checks before distribution:

| Check                                           | Description                                       | Pass/Fail |
| ----------------------------------------------- | ------------------------------------------------- | --------- |
| Customer name and address match billing records | Legal entity name, correct billing address        | [ ]       |
| PO number present (if required by customer)     | Valid, unexpired purchase order                   | [ ]       |
| Line items match contract or statement of work  | Services, quantities, and descriptions accurate   | [ ]       |
| Unit pricing matches rate schedule              | Current rates applied, discounts correct          | [ ]       |
| Tax calculation correct                         | Jurisdiction, exemptions, and rates verified      | [ ]       |
| Payment terms match customer agreement          | Net terms, early pay discount correct             | [ ]       |
| Remittance instructions present                 | Banking details, portal link included             | [ ]       |
| Invoice date and due date correct               | Billing period and terms calculated properly      | [ ]       |
| Currency correct                                | Matches contract currency                         | [ ]       |
| Supporting documentation attached (if required) | Timesheets, usage reports, delivery confirmations | [ ]       |

### 5.2 Exception Handling

| Exception Type             | Resolution                                 | Authority     |
| -------------------------- | ------------------------------------------ | ------------- |
| Missing PO number          | Contact customer for PO before sending     | AR Specialist |
| Pricing discrepancy        | Compare to contract; escalate to Sales Ops | AR Manager    |
| Tax exemption claim        | Verify certificate on file and expiration  | AR Specialist |
| Contract expired           | Hold invoice; notify Sales for renewal     | AR Manager    |
| Duplicate invoice detected | Void duplicate; document root cause        | AR Manager    |

---

## 6. Invoice Distribution

### 6.1 Delivery Methods

| Method                                    | Use Case                         | Confirmation                         |
| ----------------------------------------- | -------------------------------- | ------------------------------------ |
| Email (PDF attachment)                    | Standard delivery                | Read receipt / delivery confirmation |
| Customer billing portal                   | Enterprise customers             | Portal upload timestamp              |
| EDI (Electronic Data Interchange)         | Large enterprise / government    | EDI acknowledgment (997)             |
| Certified mail                            | Legal requirement or collections | Return receipt                       |
| AP portal submission (Ariba, Coupa, etc.) | Customer-mandated portal         | Portal confirmation number           |

### 6.2 Distribution Procedure

1. Export finalized invoices as PDF from billing system
2. Validate PDF rendering (formatting, page breaks, totals)
3. Route each invoice to the appropriate delivery method based on customer preference
4. Log delivery confirmation in the billing system
5. Archive a copy in the document management system with a 7-year retention period

---

## 7. New Customer Billing Setup

### 7.1 Setup Checklist

| Step | Task                                             | Owner            | Status |
| ---- | ------------------------------------------------ | ---------------- | ------ |
| 1    | Receive signed contract from Sales               | Sales Operations | [ ]    |
| 2    | Verify billing contact name, email, and address  | AR Specialist    | [ ]    |
| 3    | Confirm payment terms per contract               | AR Manager       | [ ]    |
| 4    | Obtain tax exemption certificate (if applicable) | AR Specialist    | [ ]    |
| 5    | Obtain purchase order (if required)              | AR Specialist    | [ ]    |
| 6    | Create customer record in billing system         | AR Specialist    | [ ]    |
| 7    | Assign customer tier and credit limit            | AR Manager       | [ ]    |
| 8    | Configure rate schedule and billing frequency    | AR Specialist    | [ ]    |
| 9    | Send welcome letter with payment instructions    | AR Specialist    | [ ]    |
| 10   | Confirm first invoice date with customer         | AR Specialist    | [ ]    |

### 7.2 Welcome Communication

The welcome letter must include:

- Customer account number
- Assigned AR contact name and contact information
- Payment terms summary
- Accepted payment methods and remittance instructions
- Billing portal access credentials (if applicable)
- Invoice dispute contact information

---

## 8. Invoice Corrections and Credit Memos

### 8.1 Correction Procedure

1. **Identify the error** — Document the specific discrepancy (pricing, quantity, tax, etc.)
2. **Obtain supporting evidence** — Contract excerpt, email approval, or rate schedule
3. **Submit correction request** — AR Specialist completes Correction Request Form (FIN-CR-[XXX])
4. **Manager review** — AR Manager validates the correction and approves or rejects
5. **Issue credit memo** — If correction reduces the amount, issue a credit memo referencing the original invoice
6. **Issue revised invoice** — If correction increases the amount or changes line items, void and reissue
7. **Notify customer** — Send corrected invoice or credit memo with explanation letter
8. **Update GL** — Revenue Accounting adjusts journal entries as needed

### 8.2 Approval Authority

| Correction Amount | Approval Required   |
| ----------------- | ------------------- |
| Up to $1,000      | AR Manager          |
| $1,001–$5,000     | Director of Finance |
| $5,001–$25,000    | CFO/Controller      |
| Over $25,000      | CFO + CEO           |

---

## 9. Recurring Billing

For subscription or retainer-based contracts:

1. **Billing templates** — Create a recurring billing template in the system with fixed line items, quantities, and rates
2. **Auto-generation** — System generates invoices automatically on the scheduled billing date
3. **Annual escalation** — Apply contractual rate increases per the agreement (typically 3–5% annually)
4. **Mid-cycle changes** — Prorate additions or removals effective from the change date
5. **Renewal processing** — Update templates upon contract renewal with new terms

---

## 10. Month-End and Year-End Close

### 10.1 Month-End Procedures

- [ ] All invoices for the period have been generated and distributed
- [ ] AR aging report reviewed; past-due items escalated per policy
- [ ] Unapplied payments investigated and resolved
- [ ] Credit memos reconciled to supporting documentation
- [ ] AR subledger reconciled to the general ledger
- [ ] Revenue accruals posted for unbilled services
- [ ] Bad debt reserve evaluated and adjusted

### 10.2 Year-End Additional Procedures

- [ ] Annual customer statement mailing
- [ ] Write-off review for accounts > 180 days past due
- [ ] Tax reporting data validated (1099 preparation)
- [ ] Audit support documentation compiled
- [ ] Policy and SOP annual review completed

---

## 11. System and Records Management

| System                | Purpose                                 | Owner            |
| --------------------- | --------------------------------------- | ---------------- |
| [ERP/Billing System]  | Invoice generation, payment application | IT / Finance     |
| [CRM System]          | Customer data, contract terms           | Sales Operations |
| [Document Management] | Invoice archive, supporting documents   | IT               |
| [Tax Engine]          | Tax calculation and compliance          | Finance / Tax    |

**Retention:** All billing records must be retained for a minimum of **7 years** per IRS requirements and company policy.

---

## 12. Related Documents

| Document                     | Reference     |
| ---------------------------- | ------------- |
| Payment Terms Policy         | FIN-PT-[XXX]  |
| Invoice Dispute Resolution   | FIN-DR-[XXX]  |
| Late Payment Notice Template | FIN-LPN-[XXX] |
| Credit Application Form      | FIN-CA-001    |
| Collections Policy           | FIN-COL-[XXX] |
| Revenue Recognition Policy   | FIN-RR-[XXX]  |

---

## 13. Revision History

| Version | Date          | Author | Description              |
| ------- | ------------- | ------ | ------------------------ |
| 1.0     | [DD-MMM-YYYY] | [Name] | Initial release          |
| [X.X]   | [DD-MMM-YYYY] | [Name] | [Description of changes] |

---

**Approved By:** ************\_************ **Date:** ******\_\_\_******

**Title:** ************\_************
