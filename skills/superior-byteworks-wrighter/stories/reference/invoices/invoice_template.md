# Invoice Template

<!-- Standard invoice with line items, payment terms, and company branding -->

---

## Document Control

| Field              | Value                                            |
| ------------------ | ------------------------------------------------ |
| **Invoice Number** | INV-[YYYY]-[NNNN]                                |
| **Invoice Date**   | [DD-MMM-YYYY]                                    |
| **Due Date**       | [DD-MMM-YYYY]                                    |
| **Currency**       | [USD / EUR / GBP / CAD]                          |
| **Status**         | [ ] Draft [ ] Sent [ ] Paid [ ] Overdue [ ] Void |
| **Prepared By**    | [Name / Title]                                   |
| **Approved By**    | [Name / Title]                                   |
| **Customer ID**    | [CUST-XXXX]                                      |
| **PO Number**      | [PO-XXXX]                                        |
| **Contract Ref**   | [CONTRACT-XXXX]                                  |
| **Project/Job**    | [Project Name / Job Code]                        |

---

## Company Information

**From (Seller):**

| Field              | Value                         |
| ------------------ | ----------------------------- |
| **Company Name**   | [Your Company Legal Name]     |
| **DBA**            | [Doing Business As, if any]   |
| **Address**        | [Street Address Line 1]       |
|                    | [Street Address Line 2]       |
| **City/State/ZIP** | [City, State ZIP Code]        |
| **Country**        | [Country]                     |
| **Tax ID / EIN**   | [XX-XXXXXXX]                  |
| **VAT Number**     | [XX-XXXXXXXXX, if applicable] |
| **Email**          | [billing@company.com]         |
| **Phone**          | [+1 (XXX) XXX-XXXX]           |
| **Website**        | [https://www.company.com]     |

**To (Buyer):**

| Field              | Value                          |
| ------------------ | ------------------------------ |
| **Company Name**   | [Customer Company Name]        |
| **Attention**      | [Accounts Payable / Contact]   |
| **Address**        | [Customer Address Line 1]      |
|                    | [Customer Address Line 2]      |
| **City/State/ZIP** | [City, State ZIP Code]         |
| **Country**        | [Country]                      |
| **Tax ID**         | [Customer Tax ID, if required] |
| **Email**          | [ap@customer.com]              |
| **Phone**          | [+1 (XXX) XXX-XXXX]            |

---

## Invoice Summary

| Description                | Details                                    |
| -------------------------- | ------------------------------------------ |
| **Invoice Period**         | [Start Date] -- [End Date]                 |
| **Payment Terms**          | Net [30 / 45 / 60 / 90]                    |
| **Payment Method**         | [ ] ACH [ ] Wire [ ] Check [ ] Credit Card |
| **Early Payment Discount** | [X]% if paid within [Y] days               |
| **Late Payment Penalty**   | [X]% per month on overdue balance          |

---

## Line Items

| #   | Item Code | Description              | Qty | Unit   | Unit Rate | Discount | Amount      |
| --- | --------- | ------------------------ | --- | ------ | --------- | -------- | ----------- |
| 1   | [SKU-001] | [Service/Product Line 1] | [X] | [unit] | $[X.XX]   | [X]%     | $[X,XXX.XX] |
| 2   | [SKU-002] | [Service/Product Line 2] | [X] | [unit] | $[X.XX]   | [X]%     | $[X,XXX.XX] |
| 3   | [SKU-003] | [Service/Product Line 3] | [X] | [unit] | $[X.XX]   | [X]%     | $[X,XXX.XX] |
| 4   | [SKU-004] | [Service/Product Line 4] | [X] | [unit] | $[X.XX]   | [X]%     | $[X,XXX.XX] |
| 5   | [SKU-005] | [Service/Product Line 5] | [X] | [unit] | $[X.XX]   | [X]%     | $[X,XXX.XX] |
| 6   | [SKU-006] | [Service/Product Line 6] | [X] | [unit] | $[X.XX]   | [X]%     | $[X,XXX.XX] |
| 7   | [SKU-007] | [Service/Product Line 7] | [X] | [unit] | $[X.XX]   | [X]%     | $[X,XXX.XX] |
| 8   | [SKU-008] | [Service/Product Line 8] | [X] | [unit] | $[X.XX]   | [X]%     | $[X,XXX.XX] |

**Line Items Subtotal:** $[XX,XXX.XX]

---

## Additional Charges and Credits

| #   | Description              | Type   | Amount        |
| --- | ------------------------ | ------ | ------------- |
| 1   | Shipping & Handling      | Charge | $[XX.XX]      |
| 2   | Rush/Expedite Fee        | Charge | $[XXX.XX]     |
| 3   | Setup / Onboarding Fee   | Charge | $[XXX.XX]     |
| 4   | Volume Discount Applied  | Credit | ($[XXX.XX])   |
| 5   | Promotional Credit       | Credit | ($[XX.XX])    |
| 6   | Previous Balance Carried | Charge | $[X,XXX.XX]   |
| 7   | Payment Received         | Credit | ($[X,XXX.XX]) |

**Net Additional:** $[X,XXX.XX]

---

## Tax Calculation

| Jurisdiction        | Taxable Amount | Rate   | Tax Amount    |
| ------------------- | -------------- | ------ | ------------- |
| Federal Excise Tax  | $[X,XXX.XX]    | [X.X]% | $[XXX.XX]     |
| State Sales Tax     | $[X,XXX.XX]    | [X.X]% | $[XXX.XX]     |
| County/Local Tax    | $[X,XXX.XX]    | [X.X]% | $[XX.XX]      |
| VAT (if applicable) | $[X,XXX.XX]    | [X.X]% | $[XXX.XX]     |
| **Total Tax**       |                |        | **$[XXX.XX]** |

> **Tax Exemption:** If tax-exempt, provide certificate number: [EXEMPT-XXXX]

---

## Invoice Total

| Component                | Amount           |
| ------------------------ | ---------------- |
| Line Items Subtotal      | $[XX,XXX.XX]     |
| Additional Charges/Cred. | $[X,XXX.XX]      |
| Tax                      | $[XXX.XX]        |
| **Total Due**            | **$[XX,XXX.XX]** |

**Amount in Words:** [Dollar Amount] and [Cents]/100 Dollars

**Payment Due By:** [DD-MMM-YYYY]

---

## Payment Instructions

### Bank Transfer (ACH / Wire)

| Field                     | Value                      |
| ------------------------- | -------------------------- |
| Bank Name                 | [Bank Name]                |
| Account Name              | [Your Company Legal Name]  |
| Account Number            | [XXXXXXXXXX]               |
| Routing Number (ACH)      | [XXXXXXXXX]                |
| Wire Routing Number       | [XXXXXXXXX]                |
| SWIFT/BIC (International) | [XXXXXXXXXXX]              |
| IBAN (International)      | [XXXX XXXX XXXX XXXX XXXX] |
| Payment Reference         | INV-[YYYY]-[NNNN]          |

### Check Payment

- Make payable to: **[Your Company Legal Name]**
- Mail to: [Payment Processing Address, City, State ZIP]
- Memo line: Invoice #INV-[YYYY]-[NNNN]

### Online Payment Portal

- URL: [https://payments.company.com]
- Enter Invoice #: INV-[YYYY]-[NNNN]
- Customer ID: [CUST-XXXX]

### Credit Card Payment

- Accepted: [ ] Visa [ ] MasterCard [ ] Amex [ ] Discover
- Card processing surcharge: [X.X]% applies to all credit card payments
- Contact [billing@company.com] or call [Phone] to process by phone

---

## Payment Record

| Payment Date | Amount      | Method   | Transaction Ref | Cleared Date | Status                  |
| ------------ | ----------- | -------- | --------------- | ------------ | ----------------------- |
| [Date]       | $[X,XXX.XX] | [Method] | [Ref #]         | [Date]       | [ ] Pending [ ] Cleared |
| [Date]       | $[X,XXX.XX] | [Method] | [Ref #]         | [Date]       | [ ] Pending [ ] Cleared |

**Outstanding Balance:** $[X,XXX.XX]

---

## Remittance Advice

Please detach and return with payment:

| Field           | Value                      |
| --------------- | -------------------------- |
| Invoice Number  | INV-[YYYY]-[NNNN]          |
| Customer ID     | [CUST-XXXX]                |
| Amount Enclosed | $******\_\_\_\_******      |
| Payment Date    | \_**\_/\_\_**/**\_\_\_\_** |
| Check Number    | ******\_\_\_******         |

---

## Notes and Special Instructions

- Payment is due within [30] days of invoice date unless otherwise specified
- Late payments are subject to a [1.5]% monthly finance charge ([18]% per annum)
- Please reference invoice number on all payments and correspondence
- Partial payments are applied to oldest outstanding invoices first
- Questions regarding this invoice: [billing@company.com] / [+1 (XXX) XXX-XXXX]

---

## Terms and Conditions

1. **Payment Terms.** Payment is due Net [30] days from the invoice date unless otherwise agreed in writing between the parties. All amounts are stated and payable in [USD].

2. **Late Payment.** Overdue balances shall accrue interest at the rate of [1.5]% per month ([18]% per annum) or the maximum rate permitted by applicable law, whichever is less.

3. **Early Payment Discount.** A discount of [2]% is available if payment is received within [10] days of the invoice date. Discount forfeited if payment is late or partial.

4. **Disputes.** Any dispute regarding this invoice must be submitted in writing within [15] business days of the invoice date. Undisputed portions remain due per original terms.

5. **Collection Costs.** Customer shall be responsible for all costs of collection on past-due accounts, including reasonable attorney fees, court costs, and collection agency fees.

6. **Returned Payments.** A fee of $[35.00] will be assessed for any returned check or failed electronic payment.

7. **Credit Hold.** Accounts more than [60] days past due may be placed on credit hold. Services or shipments may be suspended until the account is brought current.

8. **Governing Law.** This invoice and any disputes arising therefrom shall be governed by the laws of the State of [State], without regard to conflict of law principles.

9. **Severability.** If any provision of these terms is held unenforceable, the remaining provisions shall remain in full force and effect.

10. **Entire Agreement.** These terms, together with any referenced contract or purchase order, constitute the complete agreement between the parties regarding this transaction.

---

## Approval and Authorization

| Role          | Name   | Signature          | Date          |
| ------------- | ------ | ------------------ | ------------- |
| Prepared By   | [Name] | ********\_******** | [DD-MMM-YYYY] |
| Reviewed By   | [Name] | ********\_******** | [DD-MMM-YYYY] |
| Authorized By | [Name] | ********\_******** | [DD-MMM-YYYY] |

---

**Thank you for your business.**

---

> _This invoice is generated in accordance with generally accepted accounting principles (GAAP). Seller Tax ID: [XX-XXXXXXX]. This document constitutes a demand for payment and may be used in legal proceedings to establish amounts owed. Retain for your records._
