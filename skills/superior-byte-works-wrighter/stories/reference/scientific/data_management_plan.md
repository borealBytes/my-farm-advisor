# Data Management Plan Template

<!-- Follows NIH Data Management and Sharing Policy (2023), NSF DMP requirements, and FAIR principles -->
<!-- Compatible with: NIH, NSF, NIH DMSP, Wellcome Trust, EU Horizon Europe -->

---

## Document Metadata

| Field                        | Value                       |
| ---------------------------- | --------------------------- |
| **Project Title**            | [Full project title]        |
| **Principal Investigator**   | [Name, degree, institution] |
| **Funding Agency**           | [NIH / NSF / Other]         |
| **Grant Number**             | [Award number]              |
| **DMP Version**              | [X.X]                       |
| **DMP Date**                 | [DD-MMM-YYYY]               |
| **DMP Contact**              | [Name, email, ORCID]        |
| **Institutional Repository** | [Repository name and URL]   |

---

## Executive Summary

[2–3 sentences summarizing: what data will be generated, how it will be managed and shared, and the timeline for sharing. This section is read by program officers and reviewers first.]

**Data Types:** [List primary data types: genomic, imaging, clinical, survey, etc.]

**Sharing Timeline:** [Data will be shared by [date/milestone], no later than [date].]

**Repository:** [Primary repository name and URL]

---

## 1. Data Types, Formats, and Volume

### 1.1 Data Description

[Describe the scientific data that will be generated or used in the project. Be specific about data types, formats, and expected volume.]

| Data Type                  | Format               | Volume (estimated) | Generation Method  |
| -------------------------- | -------------------- | ------------------ | ------------------ |
| [e.g., Genomic sequencing] | [FASTQ, BAM, VCF]    | [X TB]             | [Illumina NovaSeq] |
| [e.g., Clinical data]      | [REDCap export, CSV] | [X GB]             | [eCRF system]      |
| [e.g., Imaging]            | [DICOM, NIfTI]       | [X TB]             | [3T MRI scanner]   |
| [e.g., Survey data]        | [CSV, SPSS]          | [X MB]             | [Qualtrics]        |
| [e.g., Code/scripts]       | [Python, R, Jupyter] | [X MB]             | [GitHub]           |

### 1.2 Metadata Standards

[Describe the metadata standards that will be applied to make data findable and interpretable.]

| Data Type  | Metadata Standard        | Schema/Ontology                |
| ---------- | ------------------------ | ------------------------------ |
| [Genomic]  | [MIAME / MINSEQE]        | [Gene Ontology, NCBI taxonomy] |
| [Clinical] | [CDISC CDASH / OMOP CDM] | [SNOMED CT, ICD-10, LOINC]     |
| [Imaging]  | [DICOM header standards] | [RadLex]                       |
| [General]  | [Dublin Core]            | [Schema.org]                   |

### 1.3 Data Quality

[Describe quality assurance procedures to ensure data accuracy, completeness, and consistency.]

- **Validation rules:** [Describe automated checks in eCRF/data capture systems]
- **Double data entry:** [Specify where applicable]
- **Range checks:** [Describe plausibility checks for continuous variables]
- **Audit trails:** [Describe how changes to data are tracked]
- **Calibration records:** [For instrument-generated data]

---

## 2. Related Tools, Software, and Code

### 2.1 Software and Tools

| Tool/Software     | Version | Purpose                | License         | Availability    |
| ----------------- | ------- | ---------------------- | --------------- | --------------- |
| [R]               | [4.x]   | [Statistical analysis] | [GPL]           | [Open source]   |
| [Python]          | [3.x]   | [Data processing]      | [PSF]           | [Open source]   |
| [REDCap]          | [X.x]   | [Data capture]         | [Institutional] | [Institutional] |
| [MATLAB]          | [R20XX] | [Signal processing]    | [Commercial]    | [Licensed]      |
| [Custom pipeline] | [v1.0]  | [Analysis pipeline]    | [MIT]           | [GitHub: URL]   |

### 2.2 Code and Analysis Scripts

[Describe how analysis code will be documented, versioned, and shared.]

- **Version control:** All code maintained in [GitHub / GitLab] repository at [URL]
- **Documentation:** Code documented with [docstrings / README / Jupyter notebooks]
- **Reproducibility:** [Conda environments / Docker containers / renv] used to capture dependencies
- **Sharing:** Code released under [MIT / Apache 2.0 / GPL] license upon publication

---

## 3. Standards and Interoperability

### 3.1 Data Standards

[Describe community standards for data formats and terminology that will be followed to maximize interoperability.]

**File Formats:**

- Preferred open formats: [CSV, TSV, JSON, HDF5, FASTQ, DICOM, NIfTI]
- Proprietary formats (with justification): [Format: Reason]
- Conversion plan: [Describe how proprietary formats will be converted to open formats]

**Terminology Standards:**

- Clinical variables: [SNOMED CT / ICD-10-CM / LOINC / RxNorm]
- Genomic data: [HGNC gene symbols / Ensembl IDs / dbSNP rsIDs]
- Phenotypic data: [HPO / MedDRA / CTCAE]

### 3.2 FAIR Principles Compliance

| Principle         | Implementation                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **Findable**      | Persistent identifiers (DOI) assigned; metadata deposited in searchable repository       |
| **Accessible**    | Data deposited in [repository] with open/controlled access; access procedures documented |
| **Interoperable** | Standard formats and ontologies used; metadata follows [standard]                        |
| **Reusable**      | Clear data use license; provenance documented; quality indicators provided               |

---

## 4. Data Preservation, Access, and Sharing

### 4.1 Repository Selection

**Primary Repository:** [Repository name]

| Attribute                  | Details                                        |
| -------------------------- | ---------------------------------------------- |
| **Repository URL**         | [URL]                                          |
| **Repository Type**        | [Domain-specific / Generalist / Institutional] |
| **NIH-Supported**          | [Yes / No — see list at sharing.nih.gov]       |
| **Persistent Identifiers** | [DOI / ARK / Handle]                           |
| **Access Model**           | [Open / Controlled / Embargoed]                |
| **Long-term Preservation** | [Commitment period: X years]                   |
| **Metadata Standard**      | [Standard used by repository]                  |

**Justification for Repository Choice:** [Explain why this repository is appropriate for the data type and community.]

**Secondary Repository (if applicable):** [e.g., GitHub for code, Zenodo for supplementary data]

### 4.2 Data Sharing Timeline

| Data Type          | Sharing Trigger                  | Latest Sharing Date | Access Level           |
| ------------------ | -------------------------------- | ------------------- | ---------------------- |
| [Primary dataset]  | [Publication / Study completion] | [Date]              | [Open / Controlled]    |
| [Genomic data]     | [Publication]                    | [Date]              | [Controlled via dbGaP] |
| [Code/scripts]     | [Submission]                     | [Date]              | [Open]                 |
| [Derived datasets] | [Publication]                    | [Date]              | [Open]                 |

### 4.3 Access and Reuse Conditions

**Open Access Data:**

- License: [CC0 / CC BY 4.0 / CC BY-NC 4.0]
- No restrictions on reuse beyond attribution

**Controlled Access Data:**

- Access mechanism: [dbGaP / institutional DUA / repository access committee]
- Eligibility criteria: [Describe who can access and for what purposes]
- Data Use Agreement: [Describe DUA requirements]
- Access review timeline: [X days/weeks]

**Embargoed Data:**

- Embargo period: [X months from study completion / publication]
- Justification: [Explain reason for embargo]

### 4.4 Data Not Shared

[Identify any data that will not be shared and provide justification for each category.]

| Data Category                     | Reason Not Shared        | Alternative                    |
| --------------------------------- | ------------------------ | ------------------------------ |
| [Identifiable clinical data]      | [Privacy/HIPAA]          | [De-identified version shared] |
| [Proprietary assay data]          | [Commercial sensitivity] | [Summary statistics shared]    |
| [Preliminary/quality-failed data] | [Scientific integrity]   | [N/A]                          |

---

## 5. Privacy, Confidentiality, and Security

### 5.1 Human Subjects Data

**De-identification Approach:**

- [ ] HIPAA Safe Harbor method (18 identifiers removed)
- [ ] HIPAA Expert Determination method
- [ ] [Other standard: specify]

**Identifiers Removed/Modified:**

- Names → Study ID
- Dates → Age or relative days from enrollment
- Geographic data → [State / Region / Suppressed if <20,000 population]
- [Other identifiers as applicable]

**Re-identification Risk Assessment:** [Describe assessment of residual re-identification risk and mitigation measures]

### 5.2 Data Security

| Security Measure          | Implementation                                   |
| ------------------------- | ------------------------------------------------ |
| **Encryption at rest**    | [AES-256 / institutional standard]               |
| **Encryption in transit** | [TLS 1.2+ / SFTP]                                |
| **Access controls**       | [Role-based access; MFA required]                |
| **Audit logging**         | [All access logged with user, timestamp, action] |
| **Backup**                | [3-2-1 rule: 3 copies, 2 media types, 1 offsite] |
| **Incident response**     | [Institutional breach notification procedure]    |

**Compliance Frameworks:**

- [ ] HIPAA (45 CFR Parts 160 and 164)
- [ ] GDPR (if EU data subjects)
- [ ] FISMA (if federal systems)
- [ ] [Institutional information security policy]

### 5.3 Consent and Data Use

[Describe how participant consent covers data sharing. Note any limitations imposed by consent language.]

- Consent language permits: [Broad sharing / Disease-specific sharing / Institutional sharing only]
- Consent language prohibits: [Commercial use / Certain research types]
- Consent re-contact provisions: [Describe if applicable]

---

## 6. Roles and Responsibilities

### 6.1 Data Management Team

| Role                | Name   | Responsibilities                                | % Effort |
| ------------------- | ------ | ----------------------------------------------- | -------- |
| **Data Manager**    | [Name] | Day-to-day data management, QC, documentation   | [X]%     |
| **PI**              | [Name] | Overall DMP oversight, data sharing decisions   | [X]%     |
| **Biostatistician** | [Name] | Analysis dataset preparation, statistical code  | [X]%     |
| **IT/Informatics**  | [Name] | Infrastructure, security, backup                | [X]%     |
| **IRB Liaison**     | [Name] | Consent compliance, de-identification oversight | [X]%     |

### 6.2 Training Requirements

[Describe required training for personnel handling study data.]

- CITI Program: Human Subjects Research (required for all personnel)
- CITI Program: Data or Specimens Only Research (if applicable)
- Institutional data security training: [Frequency]
- [Domain-specific training: e.g., GCP, HIPAA]

### 6.3 Succession Planning

[Describe procedures to ensure data management continuity if key personnel leave.]

- Data management procedures documented in [location]
- All credentials stored in [institutional password manager]
- Handoff procedure: [Describe]

---

## 7. Budget

### 7.1 Data Management Costs

| Cost Category            | Year 1   | Year 2   | Year 3   | Total    |
| ------------------------ | -------- | -------- | -------- | -------- |
| Personnel (Data Manager) | $[X]     | $[X]     | $[X]     | $[X]     |
| Repository fees          | $[X]     | $[X]     | $[X]     | $[X]     |
| Storage infrastructure   | $[X]     | $[X]     | $[X]     | $[X]     |
| Software/tools           | $[X]     | $[X]     | $[X]     | $[X]     |
| Training                 | $[X]     | $[X]     | $[X]     | $[X]     |
| **Total**                | **$[X]** | **$[X]** | **$[X]** | **$[X]** |

**Budget Justification:** [Justify each cost category. Note that NIH requires DMP costs to be included in the budget.]

---

## 8. DMP Review and Updates

**Review Schedule:** This DMP will be reviewed:

- Annually during the grant period
- Upon any significant change in data types, volume, or sharing plans
- Upon publication of primary results

**Amendment Process:** [Describe how DMP amendments are documented and submitted to the funding agency]

**Version History:**

| Version | Date   | Changes         | Author |
| ------- | ------ | --------------- | ------ |
| 1.0     | [Date] | Initial version | [Name] |
| [X.X]   | [Date] | [Changes]       | [Name] |

---

## Appendices

### Appendix A: Data Dictionary

[Provide or reference the data dictionary for all study variables. Include: variable name, label, type, units, allowable values, and coding.]

| Variable Name | Label   | Type             | Units   | Allowable Values | Missing Code |
| ------------- | ------- | ---------------- | ------- | ---------------- | ------------ |
| [var_name]    | [Label] | [Numeric/String] | [Units] | [Range/List]     | [Code]       |

### Appendix B: Repository Submission Checklist

- [ ] Data de-identified per HIPAA Safe Harbor / Expert Determination
- [ ] Data dictionary submitted with dataset
- [ ] README file describing dataset contents
- [ ] License file included
- [ ] Persistent identifier (DOI) obtained
- [ ] Metadata submitted to repository
- [ ] Access conditions documented
- [ ] Publication linked to dataset

### Appendix C: Relevant Policies

- NIH Data Management and Sharing Policy (NOT-OD-21-013)
- NIH Genomic Data Sharing Policy (NOT-OD-14-124)
- [Institutional data governance policy: URL]
- [Repository terms of service: URL]

---

_Template follows NIH Data Management and Sharing Policy (effective January 25, 2023), NSF DMP requirements, and FAIR data principles (Wilkinson et al., 2016, Scientific Data). Verify current requirements at sharing.nih.gov before submission._
