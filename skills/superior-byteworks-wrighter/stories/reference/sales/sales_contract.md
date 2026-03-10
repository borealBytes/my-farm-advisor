# Sales Contract: {{PROJECT_NAME}}

**Contract Number**: {{CONTRACT_ID}}
**Seller**: {{SELLER_NAME}}
**Buyer**: {{BUYER_NAME}}
**Effective Date**: {{EFFECTIVE_DATE}}
**Expiration Date**: {{EXPIRATION_DATE}}

---

## Document Control

| Field          | Value                                        |
| -------------- | -------------------------------------------- |
| Version        | {{VERSION}}                                  |
| Status         | Draft / Under Review / Executed / Terminated |
| Author         | {{AUTHOR}}                                   |
| Approved By    | {{APPROVER}}                                 |
| Classification | Confidential                                 |
| Last Modified  | {{DATE}}                                     |

### Revision History

| Version | Date     | Author     | Changes                         |
| ------- | -------- | ---------- | ------------------------------- |
| 1.0     | {{DATE}} | {{AUTHOR}} | Initial contract draft          |
| 1.1     | {{DATE}} | {{AUTHOR}} | Incorporated legal review edits |
| 2.0     | {{DATE}} | {{AUTHOR}} | Final executed version          |

---

## Parties

### Seller

| Field           | Value                   |
| --------------- | ----------------------- |
| Legal Entity    | {{SELLER_LEGAL_NAME}}   |
| Address         | {{SELLER_ADDRESS}}      |
| State / Country | {{SELLER_JURISDICTION}} |
| Tax ID / VAT    | {{SELLER_TAX_ID}}       |
| Primary Contact | {{SELLER_CONTACT}}      |
| Email           | {{SELLER_EMAIL}}        |
| Phone           | {{SELLER_PHONE}}        |

### Buyer

| Field           | Value                  |
| --------------- | ---------------------- |
| Legal Entity    | {{BUYER_LEGAL_NAME}}   |
| Address         | {{BUYER_ADDRESS}}      |
| State / Country | {{BUYER_JURISDICTION}} |
| Tax ID / VAT    | {{BUYER_TAX_ID}}       |
| Primary Contact | {{BUYER_CONTACT}}      |
| Email           | {{BUYER_EMAIL}}        |
| Phone           | {{BUYER_PHONE}}        |

---

## Recitals

WHEREAS, Seller is engaged in the business of providing {{PRODUCTS_SERVICES_DESCRIPTION}};

WHEREAS, Buyer desires to purchase from Seller the products and/or services described herein;

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth below, the parties agree as follows:

---

## Scope of Agreement

### Products / Services

| #   | Item     | Description     | Qty   | Unit Price | Total      |
| --- | -------- | --------------- | ----- | ---------- | ---------- |
| 1   | {{ITEM}} | {{DESCRIPTION}} | {{X}} | ${{X}}     | ${{X}}     |
| 2   | {{ITEM}} | {{DESCRIPTION}} | {{X}} | ${{X}}     | ${{X}}     |
| 3   | {{ITEM}} | {{DESCRIPTION}} | {{X}} | ${{X}}     | ${{X}}     |
| 4   | {{ITEM}} | {{DESCRIPTION}} | {{X}} | ${{X}}     | ${{X}}     |
|     |          |                 |       | **Total**  | **${{X}}** |

### Deliverables

| #   | Deliverable     | Description     | Due Date | Acceptance Criteria |
| --- | --------------- | --------------- | -------- | ------------------- |
| 1   | {{DELIVERABLE}} | {{DESCRIPTION}} | {{DATE}} | {{CRITERIA}}        |
| 2   | {{DELIVERABLE}} | {{DESCRIPTION}} | {{DATE}} | {{CRITERIA}}        |
| 3   | {{DELIVERABLE}} | {{DESCRIPTION}} | {{DATE}} | {{CRITERIA}}        |
| 4   | {{DELIVERABLE}} | {{DESCRIPTION}} | {{DATE}} | {{CRITERIA}}        |

### Exclusions

- [ ] {{EXCLUSION_1}}
- [ ] {{EXCLUSION_2}}
- [ ] {{EXCLUSION_3}}

---

## Pricing & Payment

### Total Contract Value

| Component       | Amount             |
| --------------- | ------------------ |
| Products        | ${{X}}             |
| Services        | ${{X}}             |
| Recurring Fees  | ${{X}} / {{CYCLE}} |
| **Total Value** | **${{X}}**         |

### Payment Schedule

| Milestone          | % of Total | Amount | Due Date | Invoice Trigger           |
| ------------------ | ---------- | ------ | -------- | ------------------------- |
| Contract execution | {{X}}%     | ${{X}} | {{DATE}} | Signature                 |
| {{MILESTONE_1}}    | {{X}}%     | ${{X}} | {{DATE}} | Deliverable acceptance    |
| {{MILESTONE_2}}    | {{X}}%     | ${{X}} | {{DATE}} | Deliverable acceptance    |
| Final delivery     | {{X}}%     | ${{X}} | {{DATE}} | Final acceptance sign-off |

### Payment Terms

- Invoices due **{{NET_TERMS}}** from invoice date
- Accepted payment methods: {{PAYMENT_METHODS}}
- Late payment interest: **{{LATE_RATE}}%** per month on outstanding balance
- Disputed invoices must be raised within **{{DISPUTE_WINDOW}} business days**
- Undisputed portions remain payable per original terms

---

## Service Level Agreements

### Performance Standards

| Metric                | Target             | Measurement Period | Remedy                              |
| --------------------- | ------------------ | ------------------ | ----------------------------------- |
| Availability          | ≥ {{UPTIME}}%      | Monthly            | Service credits per credit schedule |
| Response Time         | ≤ {{RESPONSE}} hrs | Per incident       | Escalation per escalation matrix    |
| Delivery On-Time      | ≥ {{ON_TIME}}%     | Per deliverable    | Delay penalties apply               |
| Defect Rate           | ≤ {{DEFECT_RATE}}% | Quarterly          | Warranty rework at no cost          |
| Customer Satisfaction | ≥ {{CSAT}}/5       | Quarterly survey   | Improvement plan required           |

### Service Credit Schedule

| SLA Achievement Level              | Credit (% of Monthly Fee) |
| ---------------------------------- | ------------------------- |
| ≥ {{TARGET}}%                      | 0% (SLA met)              |
| {{TIER_1_LOW}}% – {{TIER_1_HIGH}}% | {{TIER_1_CREDIT}}%        |
| {{TIER_2_LOW}}% – {{TIER_2_HIGH}}% | {{TIER_2_CREDIT}}%        |
| < {{TIER_2_LOW}}%                  | {{MAX_CREDIT}}% (cap)     |

### Escalation Procedure

| Level | Trigger                                   | Seller Contact | Buyer Contact |
| ----- | ----------------------------------------- | -------------- | ------------- |
| 1     | SLA breach or P1 incident                 | {{SELLER_L1}}  | {{BUYER_L1}}  |
| 2     | Unresolved after {{L2_TRIGGER}} hrs       | {{SELLER_L2}}  | {{BUYER_L2}}  |
| 3     | Repeated SLA miss (2+ consecutive months) | {{SELLER_L3}}  | {{BUYER_L3}}  |

---

## Term & Termination

### Contract Term

- **Initial Term**: {{INITIAL_TERM}} from the Effective Date
- **Renewal**: Auto-renews for successive {{RENEWAL_TERM}} periods unless terminated
- **Renewal Notice**: Either party may decline renewal with {{RENEWAL_NOTICE}} days written notice

### Termination Rights

| Condition                       | Notice Required              | Effect                                    |
| ------------------------------- | ---------------------------- | ----------------------------------------- |
| Convenience (either party)      | {{CONVENIENCE_NOTICE}} days  | Wind-down per transition plan             |
| Material breach (uncured)       | {{CURE_PERIOD}} days to cure | Immediate upon cure period expiry         |
| Insolvency / bankruptcy         | Immediate                    | Automatic termination                     |
| Change of control               | {{COC_NOTICE}} days          | Option to terminate at non-affected party |
| Chronic SLA failure (3+ months) | {{SLA_NOTICE}} days          | Buyer may terminate without penalty       |

### Post-Termination Obligations

- [ ] Seller delivers all completed work product
- [ ] Buyer pays for all accepted deliverables and work in progress
- [ ] Seller provides transition assistance for up to {{TRANSITION_PERIOD}}
- [ ] Both parties return or destroy confidential information within {{RETURN_PERIOD}} days
- [ ] Surviving clauses: Confidentiality, IP, Limitation of Liability, Indemnification

---

## Warranties & Representations

### Seller Warranties

- [ ] Products/services conform to specifications and descriptions in this contract
- [ ] Deliverables are free from material defects for **{{WARRANTY_PERIOD}}** from acceptance
- [ ] Seller has authority to enter this agreement and perform obligations
- [ ] Work product does not infringe third-party intellectual property rights
- [ ] Services performed by qualified personnel with professional skill and care

### Buyer Warranties

- [ ] Buyer has authority to enter this agreement and fulfill payment obligations
- [ ] Buyer will provide timely access, information, and resources as required
- [ ] Buyer-provided materials do not infringe third-party rights

### Warranty Exclusions

- Defects caused by Buyer modifications or misuse
- Issues arising from third-party integrations not approved by Seller
- Normal wear and tear (physical products)
- Failure to apply updates or patches within {{PATCH_WINDOW}} of release

---

## Intellectual Property

### Ownership

| Category               | Owner               | License Granted                           |
| ---------------------- | ------------------- | ----------------------------------------- |
| Pre-existing Seller IP | Seller              | Non-exclusive license to Buyer for use    |
| Pre-existing Buyer IP  | Buyer               | Limited license to Seller for performance |
| Custom deliverables    | {{CUSTOM_IP_OWNER}} | {{LICENSE_TERMS}}                         |
| Joint developments     | {{JOINT_IP_TERMS}}  | {{JOINT_LICENSE}}                         |

### License Terms

- Licenses granted are {{PERPETUAL / TERM-LIMITED}}, {{WORLDWIDE / TERRITORY-LIMITED}}
- Sublicensing: {{PERMITTED / NOT_PERMITTED}} without prior written consent
- Source code escrow: {{REQUIRED / NOT_REQUIRED}} — held by {{ESCROW_AGENT}}

---

## Confidentiality

- Confidential information includes all non-public business, technical, and financial information
- Obligations survive termination for **{{CONFIDENTIALITY_PERIOD}}**
- Standard exceptions apply: publicly known, independently developed, lawfully obtained from third party
- Return or destruction required within **{{RETURN_PERIOD}} days** of termination
- Permitted disclosures: legal obligations, professional advisors (under NDA), affiliates (under NDA)

---

## Limitation of Liability

- **Direct Damages Cap**: Total fees paid or payable under this contract in the {{LIABILITY_PERIOD}} preceding the claim
- **Consequential Damages**: Neither party liable for indirect, incidental, special, or consequential damages
- **Exclusions from Cap**: Breaches of confidentiality, IP indemnification, willful misconduct, fraud
- **Mutual**: Limitations apply equally to both parties

---

## Indemnification

### Seller Indemnifies Buyer

- [ ] Third-party IP infringement claims arising from deliverables
- [ ] Bodily injury or property damage caused by Seller's negligence
- [ ] Breaches of Seller's representations and warranties
- [ ] Seller's violation of applicable laws or regulations

### Buyer Indemnifies Seller

- [ ] Claims arising from Buyer's use of deliverables outside agreed scope
- [ ] Third-party claims arising from Buyer-provided materials
- [ ] Buyer's violation of applicable laws or regulations

### Indemnification Procedure

1. Prompt written notice of claim within **{{NOTICE_PERIOD}} business days**
2. Indemnifying party has right to control defense and settlement
3. Indemnified party cooperates and provides reasonable assistance
4. No settlement without indemnified party's written consent (not unreasonably withheld)

---

## Dispute Resolution

| Step | Method                                  | Timeline                    |
| ---- | --------------------------------------- | --------------------------- |
| 1    | Good-faith negotiation between contacts | {{NEGOTIATION_PERIOD}} days |
| 2    | Escalation to executive leadership      | {{ESCALATION_PERIOD}} days  |
| 3    | Mediation ({{MEDIATION_BODY}})          | {{MEDIATION_PERIOD}} days   |
| 4    | Binding arbitration / Litigation        | Per governing law           |

**Governing Law**: {{GOVERNING_LAW}}
**Jurisdiction**: {{JURISDICTION}}
**Arbitration Rules**: {{ARBITRATION_RULES}} (if applicable)

---

## General Provisions

- [ ] **Assignment**: Neither party may assign without prior written consent (except to affiliates)
- [ ] **Force Majeure**: Standard force majeure provisions apply; affected party must notify within {{FM_NOTICE}} days
- [ ] **Notices**: Written notices to addresses specified in Parties section; effective upon receipt
- [ ] **Entire Agreement**: This contract supersedes all prior agreements and understandings
- [ ] **Amendments**: Modifications require written agreement signed by both parties
- [ ] **Severability**: Invalid provisions do not affect remaining terms
- [ ] **Waiver**: Failure to enforce a provision does not constitute waiver
- [ ] **Counterparts**: May be executed in counterparts, each constituting an original

---

## Signatures

|               | {{SELLER_NAME}}                  | {{BUYER_NAME}}                   |
| ------------- | -------------------------------- | -------------------------------- |
| **Name**      | {{SELLER_SIGNATORY}}             | {{BUYER_SIGNATORY}}              |
| **Title**     | {{SELLER_TITLE}}                 | {{BUYER_TITLE}}                  |
| **Signature** | **************\_\_************** | **************\_\_************** |
| **Date**      | **************\_\_************** | **************\_\_************** |

---

## Exhibits

### Exhibit A — Detailed Specifications

{{Attach product/service specifications, technical requirements, or architecture documentation.}}

### Exhibit B — Service Level Agreement Details

{{Reference the full SLA document if maintained separately: SLA-{{SLA_ID}}.}}

### Exhibit C — Change Order Form

| Field              | Value                             |
| ------------------ | --------------------------------- |
| Change Order #     | CO-{{CO_NUMBER}}                  |
| Description        | {{CHANGE_DESCRIPTION}}            |
| Impact to Price    | ${{PRICE_IMPACT}}                 |
| Impact to Schedule | {{SCHEDULE_IMPACT}}               |
| Requested By       | {{REQUESTOR}}                     |
| Approved By        | ****\_\_\_\_**** Date: ****\_**** |

---

_This Sales Contract constitutes the entire agreement between {{SELLER_NAME}} and {{BUYER_NAME}} regarding the subject matter herein. Contract {{CONTRACT_ID}}, effective {{EFFECTIVE_DATE}}._
