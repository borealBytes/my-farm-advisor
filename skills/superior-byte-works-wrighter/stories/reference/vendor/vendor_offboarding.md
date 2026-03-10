# Vendor Offboarding Checklist

---

## Document Control

| Field                   | Value                                  |
| ----------------------- | -------------------------------------- |
| **Offboarding ID**      | VOFF-[YYYY]-[NNNN]                     |
| **Vendor Legal Name**   | [Company Name]                         |
| **MSA Reference**       | MSA-[YYYY]-[NNNN]                      |
| **SOW Reference(s)**    | SOW-[YYYY]-[NNNN], SOW-[YYYY]-[NNNN]   |
| **Contract End Date**   | [DD-MMM-YYYY]                          |
| **Offboarding Start**   | [DD-MMM-YYYY]                          |
| **Target Completion**   | [DD-MMM-YYYY]                          |
| **Responsible Manager** | [Name, Title, Email]                   |
| **Classification**      | [ ] Confidential [ ] Internal Use Only |

### Termination Basis

| Type                                      | Selected |
| ----------------------------------------- | -------- |
| Contract expiration (natural end of term) | [ ]      |
| Termination for convenience               | [ ]      |
| Termination for cause (material breach)   | [ ]      |
| Non-renewal after notice period           | [ ]      |
| Transition to replacement vendor          | [ ]      |
| Mutual agreement to terminate             | [ ]      |

### Revision History

| Rev | Date   | Author | Description           |
| --- | ------ | ------ | --------------------- |
| 1.0 | [Date] | [Name] | Offboarding initiated |
| 1.1 | [Date] | [Name] | [Update description]  |

---

## Section 1 --- Pre-Offboarding Assessment

### 1.1 Contract Review

| Item                                                | Status             | Notes               |
| --------------------------------------------------- | ------------------ | ------------------- |
| Termination notice delivered per contract terms     | [ ] Complete       | [Date sent, method] |
| Notice period requirement satisfied ([X] days)      | [ ] Complete       | [Confirmation]      |
| Termination fees or early exit penalties calculated | [ ] Complete       | $[X]                |
| Remaining contractual obligations identified        | [ ] Complete       | [List]              |
| Wind-down period agreed upon                        | [ ] Complete       | [X] weeks           |
| Replacement vendor identified (if applicable)       | [ ] Complete / N/A | [Vendor name]       |

### 1.2 Impact Assessment

| Area                  | Impact Level                   | Mitigation Plan |
| --------------------- | ------------------------------ | --------------- |
| Business operations   | Low / Medium / High / Critical | [Description]   |
| End users             | Low / Medium / High / Critical | [Description]   |
| Dependent systems     | Low / Medium / High / Critical | [Description]   |
| Regulatory compliance | Low / Medium / High / Critical | [Description]   |
| Data continuity       | Low / Medium / High / Critical | [Description]   |

---

## Section 2 --- Knowledge Transfer (Weeks 1-2)

### 2.1 Documentation Deliverables

| Document                                     | Owner  | Due Date | Status              | Verified |
| -------------------------------------------- | ------ | -------- | ------------------- | -------- |
| System architecture and design documentation | Vendor | [Date]   | [ ] Draft [ ] Final | [ ]      |
| Operations and maintenance runbooks          | Vendor | [Date]   | [ ] Draft [ ] Final | [ ]      |
| Configuration and environment documentation  | Vendor | [Date]   | [ ] Draft [ ] Final | [ ]      |
| User guides and training materials           | Vendor | [Date]   | [ ] Draft [ ] Final | [ ]      |
| Known issues and workarounds register        | Vendor | [Date]   | [ ] Draft [ ] Final | [ ]      |
| Vendor contact list and escalation matrix    | Vendor | [Date]   | [ ] Draft [ ] Final | [ ]      |
| Third-party license and dependency inventory | Vendor | [Date]   | [ ] Draft [ ] Final | [ ]      |
| FAQ and troubleshooting guide                | Vendor | [Date]   | [ ] Draft [ ] Final | [ ]      |

### 2.2 Training and Handover Sessions

| Session                                      | Audience                         | Duration  | Date   | Completed |
| -------------------------------------------- | -------------------------------- | --------- | ------ | --------- |
| System overview and architecture walkthrough | Internal IT / Replacement vendor | [X] hours | [Date] | [ ]       |
| Day-to-day operations procedures             | Operations team                  | [X] hours | [Date] | [ ]       |
| Incident management and escalation           | Support team                     | [X] hours | [Date] | [ ]       |
| Administration and configuration             | System administrators            | [X] hours | [Date] | [ ]       |
| Reporting and analytics                      | Business analysts                | [X] hours | [Date] | [ ]       |
| [Custom session]                             | [Audience]                       | [X] hours | [Date] | [ ]       |

### 2.3 Knowledge Transfer Acceptance

| Criterion                                       | Met              | Notes            |
| ----------------------------------------------- | ---------------- | ---------------- |
| All documentation delivered and reviewed        | [ ]              |                  |
| Training sessions completed and recorded        | [ ]              |                  |
| Internal team can independently operate systems | [ ]              |                  |
| Replacement vendor (if any) confirms readiness  | [ ]              |                  |
| **Knowledge Transfer Sign-Off**                 | [ ] **APPROVED** | Date: ****\_**** |

---

## Section 3 --- Access Revocation (Weeks 2-3)

### 3.1 Logical Access Removal

| System / Application           | Access Type    | Vendor Users  | Revocation Date | Confirmed By    |
| ------------------------------ | -------------- | ------------- | --------------- | --------------- |
| VPN / Remote Access            | Network        | [Names/Count] | [Date]          | [ ] IT Security |
| Active Directory / SSO         | Identity       | [Names/Count] | [Date]          | [ ] IT Security |
| Email and Collaboration        | Communication  | [Names/Count] | [Date]          | [ ] IT Admin    |
| Production Environment         | System         | [Names/Count] | [Date]          | [ ] IT Security |
| Staging / Test Environment     | System         | [Names/Count] | [Date]          | [ ] IT Admin    |
| Source Code Repositories       | Development    | [Names/Count] | [Date]          | [ ] Engineering |
| CI/CD Pipelines                | Development    | [Names/Count] | [Date]          | [ ] Engineering |
| Cloud Console (AWS/Azure/GCP)  | Infrastructure | [Names/Count] | [Date]          | [ ] Cloud Ops   |
| Monitoring and Logging         | Operations     | [Names/Count] | [Date]          | [ ] IT Ops      |
| Ticketing / Project Management | Collaboration  | [Names/Count] | [Date]          | [ ] PMO         |
| [Custom system]                | [Type]         | [Names/Count] | [Date]          | [ ] [Owner]     |

### 3.2 Physical Access Removal

| Item                                   | Quantity | Return Date | Confirmed By   |
| -------------------------------------- | -------- | ----------- | -------------- |
| Building access badges                 | [X]      | [Date]      | [ ] Facilities |
| Parking permits                        | [X]      | [Date]      | [ ] Facilities |
| Keys (offices, cabinets, server rooms) | [X]      | [Date]      | [ ] Facilities |
| Visitor registration deactivation      | --       | [Date]      | [ ] Security   |

### 3.3 Credential and Secret Rotation

| Credential Type                          | System   | Rotation Date | Confirmed By    |
| ---------------------------------------- | -------- | ------------- | --------------- |
| Service accounts                         | [System] | [Date]        | [ ] IT Security |
| API keys and tokens                      | [System] | [Date]        | [ ] Engineering |
| Shared passwords                         | [System] | [Date]        | [ ] IT Security |
| SSL/TLS certificates (if vendor-managed) | [System] | [Date]        | [ ] IT Security |
| Database credentials                     | [System] | [Date]        | [ ] DBA         |
| Encryption keys                          | [System] | [Date]        | [ ] IT Security |

---

## Section 4 --- Data and Asset Recovery (Weeks 2-3)

### 4.1 Data Transfer

| Data Category                 | Location   | Format   | Transfer Method | Received | Verified |
| ----------------------------- | ---------- | -------- | --------------- | -------- | -------- |
| Work product and deliverables | [Location] | [Format] | [Method]        | [Date]   | [ ]      |
| Source code and repositories  | [Location] | [Format] | [Method]        | [Date]   | [ ]      |
| Customer data (production)    | [Location] | [Format] | [Method]        | [Date]   | [ ]      |
| Customer data (backups)       | [Location] | [Format] | [Method]        | [Date]   | [ ]      |
| Configuration files           | [Location] | [Format] | [Method]        | [Date]   | [ ]      |
| Documentation and wikis       | [Location] | [Format] | [Method]        | [Date]   | [ ]      |
| Reports and analytics         | [Location] | [Format] | [Method]        | [Date]   | [ ]      |
| Logs and audit trails         | [Location] | [Format] | [Method]        | [Date]   | [ ]      |

### 4.2 Data Destruction Certification

Vendor shall certify destruction of all Customer data in their possession:

| Environment             | Destruction Method                          | Certification Date | Certificate Received |
| ----------------------- | ------------------------------------------- | ------------------ | -------------------- |
| Production systems      | [ ] Overwrite [ ] Crypto-erase [ ] Physical | [Date]             | [ ]                  |
| Backup systems          | [ ] Overwrite [ ] Crypto-erase [ ] Physical | [Date]             | [ ]                  |
| Development / Test      | [ ] Overwrite [ ] Crypto-erase [ ] Physical | [Date]             | [ ]                  |
| Vendor employee devices | [ ] Overwrite [ ] Crypto-erase [ ] Physical | [Date]             | [ ]                  |
| Cloud storage           | [ ] Overwrite [ ] Crypto-erase [ ] Physical | [Date]             | [ ]                  |

### 4.3 Physical Asset Return

| Asset                         | Serial / ID | Quantity | Condition            | Return Date | Received By |
| ----------------------------- | ----------- | -------- | -------------------- | ----------- | ----------- |
| Laptop(s)                     | [Serial]    | [X]      | [ ] Good [ ] Damaged | [Date]      | [Name]      |
| Mobile devices                | [Serial]    | [X]      | [ ] Good [ ] Damaged | [Date]      | [Name]      |
| Hardware tokens / MFA devices | [Serial]    | [X]      | [ ] Good [ ] Damaged | [Date]      | [Name]      |
| Proprietary equipment         | [Serial]    | [X]      | [ ] Good [ ] Damaged | [Date]      | [Name]      |
| Documentation (hard copy)     | --          | [X] sets | [ ] Complete         | [Date]      | [Name]      |

---

## Section 5 --- Financial Closeout (Weeks 3-4)

### 5.1 Outstanding Financial Items

| Item                                  | Amount   | Status                               | Due Date |
| ------------------------------------- | -------- | ------------------------------------ | -------- |
| Final invoice for services rendered   | $[X]     | [ ] Submitted [ ] Approved [ ] Paid  | [Date]   |
| Unreimbursed approved expenses        | $[X]     | [ ] Submitted [ ] Approved [ ] Paid  | [Date]   |
| Early termination fee (if applicable) | $[X]     | [ ] Calculated [ ] Approved [ ] Paid | [Date]   |
| Holdback / retainage release          | $[X]     | [ ] Calculated [ ] Approved [ ] Paid | [Date]   |
| Credits or refunds owed to Customer   | $[X]     | [ ] Calculated [ ] Applied           | [Date]   |
| Prepaid service credits (unused)      | $[X]     | [ ] Calculated [ ] Refunded          | [Date]   |
| **Net Amount Due**                    | **$[X]** |                                      |          |

### 5.2 License and Subscription Disposition

| License / Subscription | Action                             | Effective Date | Confirmed |
| ---------------------- | ---------------------------------- | -------------- | --------- |
| [Software license 1]   | [ ] Transfer [ ] Cancel [ ] Retain | [Date]         | [ ]       |
| [Software license 2]   | [ ] Transfer [ ] Cancel [ ] Retain | [Date]         | [ ]       |
| [Cloud subscription]   | [ ] Transfer [ ] Cancel [ ] Retain | [Date]         | [ ]       |
| [Support contract]     | [ ] Transfer [ ] Cancel [ ] Retain | [Date]         | [ ]       |

---

## Section 6 --- Post-Offboarding Obligations

### 6.1 Surviving Contractual Obligations

| Obligation                       | Duration                    | Reference       |
| -------------------------------- | --------------------------- | --------------- |
| Confidentiality                  | [X] years post-termination  | MSA Article [X] |
| Non-solicitation (if applicable) | [X] months post-termination | MSA Article [X] |
| Warranty on delivered work       | [X] months post-acceptance  | SOW Section [X] |
| Indemnification                  | Per MSA survival clause     | MSA Article [X] |
| Data destruction certification   | [X] days post-termination   | MSA Article [X] |
| Audit rights                     | [X] years post-termination  | MSA Article [X] |

### 6.2 Transition Support

| Support Item                        | Duration                  | Rate     | Cap  |
| ----------------------------------- | ------------------------- | -------- | ---- |
| Emergency escalation support        | [X] days post-termination | $[X]/hr  | $[X] |
| Subject matter expert availability  | [X] days post-termination | $[X]/hr  | $[X] |
| Defect resolution (warranty period) | [X] months                | Included | --   |

---

## Section 7 --- Lessons Learned

### 7.1 Vendor Performance Summary

| Category                          | Rating (1-5) | Comments   |
| --------------------------------- | ------------ | ---------- |
| Quality of deliverables           | [X]          | [Comments] |
| Timeliness and schedule adherence | [X]          | [Comments] |
| Communication and responsiveness  | [X]          | [Comments] |
| Technical competence              | [X]          | [Comments] |
| Issue resolution                  | [X]          | [Comments] |
| Value for cost                    | [X]          | [Comments] |
| **Overall Rating**                | **[X.X]**    |            |

### 7.2 Recommendations

- **Would re-engage this vendor:** [ ] Yes [ ] No [ ] Conditional
- **Recommended for other engagements:** [ ] Yes [ ] No
- **Key lessons for future procurements:** [Description]

---

## Section 8 --- Final Sign-Off

All offboarding activities have been completed satisfactorily.

| Role                       | Name   | Signature          | Date       |
| -------------------------- | ------ | ------------------ | ---------- |
| Vendor Account Manager     | [Name] | ********\_******** | ****\_**** |
| Customer Project Manager   | [Name] | ********\_******** | ****\_**** |
| IT Security                | [Name] | ********\_******** | ****\_**** |
| Facilities                 | [Name] | ********\_******** | ****\_**** |
| Finance / Accounts Payable | [Name] | ********\_******** | ****\_**** |
| Procurement Officer        | [Name] | ********\_******** | ****\_**** |
| Legal Counsel              | [Name] | ********\_******** | ****\_**** |

---

**End of Vendor Offboarding Document**

_Retain this document per organizational records retention policy for a minimum of [X] years following offboarding completion._
