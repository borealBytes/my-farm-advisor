# Inventory Management Policy & Procedures

| Field              | Value                                      |
| ------------------ | ------------------------------------------ |
| **Document ID**    | INV-RETAIL-001                             |
| **Version**        | 1.0                                        |
| **Classification** | Internal — Supply Chain & Store Operations |
| **Effective Date** | YYYY-MM-DD                                 |
| **Review Cycle**   | Semi-Annual                                |
| **Owner**          | Director of Inventory Planning             |

---

## Inventory Management Principles

1. **Accuracy first** — Every unit must be accounted for at every stage from receiving dock to point of sale.
2. **Perpetual inventory** — The system of record is the Inventory Management System (IMS); physical counts validate but do not replace it.
3. **First-in, first-out (FIFO)** — Applies to all perishable and date-sensitive merchandise. Non-perishable categories follow planogram rotation.
4. **Single source of truth** — SKU master data is maintained centrally; stores do not create or modify SKU records.

---

## SKU Management

### SKU Structure

| Segment    | Positions | Description                          | Example           |
| ---------- | --------- | ------------------------------------ | ----------------- |
| Department | 1–2       | Two-digit department code            | `04` (Footwear)   |
| Category   | 3–4       | Two-digit category within department | `12` (Running)    |
| Style      | 5–8       | Four-digit style identifier          | `3387`            |
| Color      | 9–11      | Three-character color code           | `BLK`             |
| Size       | 12–14     | Three-character size code            | `100` (Size 10.0) |

**Full SKU example**: `0412-3387-BLK-100`

### SKU Lifecycle

| Stage               | Action                                                                | Owner                |
| ------------------- | --------------------------------------------------------------------- | -------------------- |
| **Creation**        | Merchandising team creates SKU in PLM; syncs to IMS                   | Merchandise Planning |
| **Activation**      | SKU set to _Available for Allocation_ once buy order is confirmed     | Inventory Planning   |
| **Allocation**      | Units distributed to stores based on demand model                     | Allocation Analyst   |
| **Replenishment**   | Auto-replenish triggers when on-hand falls below reorder point        | IMS (automated)      |
| **Markdown**        | SKU flagged for markdown when sell-through < threshold                | Merchandise Planning |
| **Discontinuation** | SKU set to _Discontinued_; remaining units consolidated or liquidated | Inventory Planning   |
| **Purge**           | SKU removed from active catalog after 12 months of zero inventory     | Systems Admin        |

---

## Receiving Procedures

### Inbound Shipment Workflow

| Step | Task                                                                        | Responsible            |
| ---- | --------------------------------------------------------------------------- | ---------------------- |
| 1    | Verify trailer seal number against Advanced Shipping Notice (ASN)           | Receiving Associate    |
| 2    | Unload cartons; stage on receiving dock by PO number                        | Receiving Team         |
| 3    | Scan each carton barcode against ASN in IMS                                 | Receiving Associate    |
| 4    | Spot-check 10% of cartons — verify contents match packing slip              | Receiving Lead         |
| 5    | Log discrepancies (shorts, overages, damages) in the **Discrepancy Report** | Receiving Lead         |
| 6    | Accept shipment in IMS; units post to on-hand inventory                     | Receiving Associate    |
| 7    | Ticket unpriced merchandise; apply security tags per LP guidelines          | Receiving / Floor Team |
| 8    | Move merchandise to sales floor or backstock within **24 hours** of receipt | Floor Team             |

### Discrepancy Thresholds

| Discrepancy Type    | Threshold    | Action Required                                      |
| ------------------- | ------------ | ---------------------------------------------------- |
| Short shipment      | Any quantity | Log in IMS; notify Inventory Planning within 24 hrs  |
| Overage             | Any quantity | Quarantine overage units; do not sell until resolved |
| Damaged in transit  | Any quantity | Photograph damage; file carrier claim within 48 hrs  |
| Wrong item received | Any quantity | Quarantine; contact DC for return authorization      |

---

## Stock Levels & Reorder Points

### Reorder Point Formula

```
Reorder Point (ROP) = (Average Daily Sales × Lead Time in Days) + Safety Stock
```

### Safety Stock Formula

```
Safety Stock = Z × σ_demand × √(Lead Time in Days)

Where:
  Z        = Service level factor (1.65 for 95% service level)
  σ_demand = Standard deviation of daily demand
```

### Example Calculation

| Parameter           | Value                                |
| ------------------- | ------------------------------------ |
| Average daily sales | 4 units                              |
| Lead time           | 7 days                               |
| σ_demand            | 1.2 units                            |
| Service level       | 95% (Z = 1.65)                       |
| **Safety Stock**    | 1.65 × 1.2 × √7 = **5.24 ≈ 6 units** |
| **Reorder Point**   | (4 × 7) + 6 = **34 units**           |

### Stock Classification (ABC Analysis)

| Class | % of SKUs | % of Revenue | Replenishment Policy                    |
| ----- | --------- | ------------ | --------------------------------------- |
| **A** | 15–20%    | 70–80%       | Continuous review; daily replenishment  |
| **B** | 25–30%    | 15–20%       | Periodic review; weekly replenishment   |
| **C** | 50–60%    | 5–10%        | Min/max reorder; bi-weekly or on-demand |

> **Rule**: A-class items must never have zero on-hand during selling hours. Out-of-stock on A-class SKUs triggers an immediate escalation to the Allocation team.

---

## Cycle Counting

### Cycle Count Schedule

| Count Type            | Scope                                        | Frequency                  | Performed By                       |
| --------------------- | -------------------------------------------- | -------------------------- | ---------------------------------- |
| **A-class**           | Top 20% SKUs by revenue                      | Weekly                     | Inventory Associate                |
| **B-class**           | Next 30% SKUs                                | Bi-weekly                  | Inventory Associate                |
| **C-class**           | Remaining SKUs                               | Monthly                    | Inventory Associate                |
| **Ad-hoc**            | POS discrepancy, customer complaint, LP flag | As needed                  | Shift Lead + Associate             |
| **Full wall-to-wall** | Entire store                                 | Annually (fiscal year-end) | All associates + external auditors |

### Cycle Count Procedure

| Step | Task                                                                            |
| ---- | ------------------------------------------------------------------------------- |
| 1    | IMS generates count sheet for scheduled zone / SKU set                          |
| 2    | Associate physically counts units on sales floor and backstock                  |
| 3    | Associate enters counts into handheld scanner or IMS terminal                   |
| 4    | IMS compares physical count to system on-hand                                   |
| 5    | Variances within tolerance (±2 units or ±$50) auto-adjusted                     |
| 6    | Variances exceeding tolerance require **recount** by a second associate         |
| 7    | Persistent variances after recount escalated to Store Manager for investigation |
| 8    | Adjusted counts posted; variance report filed                                   |

### Variance Investigation

When a variance exceeds tolerance after recount:

1. Pull transaction history for the SKU (past 30 days).
2. Review receiving logs for recent shipments.
3. Check inter-store transfer records.
4. Review POS void and return activity.
5. Inspect backstock locations, fitting rooms, and fixture storage.
6. Document findings in the **Inventory Variance Report** and submit to LP if theft is suspected.

---

## Backstock Management

### Organization Standards

- All backstock organized by department, then category, then style.
- Every shelf/bin labeled with location code matching IMS (e.g., `BS-A04-12` = Backstock Aisle A, Bay 04, Shelf 12).
- No merchandise stored directly on the floor; use pallets or shelving.
- Maximum stack height: 6 feet or per OSHA guidelines, whichever is lower.

### Backstock Replenishment Triggers

| Trigger                                      | Action                                           |
| -------------------------------------------- | ------------------------------------------------ |
| Sales floor on-hand ≤ display minimum        | Pull from backstock to fill                      |
| Visual gap on fixture                        | Associate fills from backstock during zone sweep |
| Morning replenishment window (open–10:00 AM) | Dedicated backstock-to-floor push                |
| New shipment received                        | Priority push for A-class and promotional items  |

---

## Inter-Store Transfers

| Step | Action                                                   | System          |
| ---- | -------------------------------------------------------- | --------------- |
| 1    | Requesting store submits transfer request in IMS         | IMS             |
| 2    | Sending store confirms availability and picks units      | IMS + Physical  |
| 3    | Units packed, labeled with transfer barcode, and shipped | Shipping        |
| 4    | Requesting store receives and scans transfer in          | IMS             |
| 5    | On-hand updated at both locations simultaneously         | IMS (automated) |

**Rules**:

- Transfers require District Manager approval if total retail value exceeds $500.
- Transfer shipments must arrive within 5 business days.
- Sending store cannot transfer units that would bring their on-hand below safety stock.

---

## Key Performance Indicators

| KPI                            | Target                        | Measurement                        |
| ------------------------------ | ----------------------------- | ---------------------------------- |
| Inventory accuracy (unit)      | ≥ 98%                         | Cycle count variance               |
| Inventory accuracy (dollar)    | ≥ 99%                         | Cycle count variance               |
| Shrinkage rate                 | ≤ 1.5% of net sales           | Annual physical inventory          |
| In-stock rate (A-class)        | ≥ 97%                         | Daily IMS report                   |
| In-stock rate (all SKUs)       | ≥ 93%                         | Weekly IMS report                  |
| Receiving processing time      | ≤ 24 hours from dock to floor | Receiving log timestamps           |
| Inventory turnover             | ≥ 4x annually                 | Cost of goods sold ÷ avg inventory |
| Days of supply                 | 60–90 days                    | On-hand ÷ avg daily sales          |
| Dead stock (>180 days no sale) | ≤ 5% of total SKUs            | Monthly aging report               |

---

## Seasonal Inventory Planning

| Phase             | Timeline               | Activities                                                      |
| ----------------- | ---------------------- | --------------------------------------------------------------- |
| **Pre-season**    | 12–16 weeks before     | Demand forecasting, buy planning, allocation modeling           |
| **Launch**        | Season start           | Floor sets, promotional displays, staff training on new product |
| **In-season**     | Ongoing                | Replenishment monitoring, rebalancing between stores            |
| **End-of-season** | 4–6 weeks before close | Markdown cadence, consolidation of slow sellers                 |
| **Post-season**   | After close            | Clearance, pack-away for off-price, liquidation of residual     |

---

## Training Requirements

| Topic                                    | Audience                          | Frequency                   |
| ---------------------------------------- | --------------------------------- | --------------------------- |
| IMS handheld scanner operation           | All store associates              | New hire + annual refresher |
| Cycle count procedures                   | Inventory associates, shift leads | Semi-annual                 |
| Receiving & discrepancy reporting        | Receiving team                    | Quarterly                   |
| ABC classification & replenishment logic | Store managers, ASMs              | Annual                      |
| Backstock organization standards         | All store associates              | Semi-annual                 |

---

## Document Control

| Version | Date       | Author        | Change Summary  |
| ------- | ---------- | ------------- | --------------- |
| 1.0     | YYYY-MM-DD | [Author Name] | Initial release |

**Next Review Date**: YYYY-MM-DD

> This document is the property of [Company Name]. Unauthorized distribution is prohibited. All inventory procedures are subject to audit by Internal Audit and Loss Prevention.
