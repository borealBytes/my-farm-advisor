# 2026 USA Cotton Production Best Practices Report

> **Nationwide Guide for Cotton Growers**: 2026/27 MY (Aug–Jul). USDA Feb 2026: US planted 9.4M acres (+100k); production **13.6M bales** (↓2%, 856 lb/acre); exports 12.2M bales (+0.2M); ending stocks 4.2M (30% stocks/use); price **63¢/lb** (+3¢). Global prod ↓3% to 116M bales; tight mills. Costs ~$850–1,000/acre (high irr./inputs). **Skill**: FIPS → HU forecast, variety, Vert risk, yield est. [usda](https://www.usda.gov/sites/default/files/documents/2026AOF-cotton-outlook.pdf)

**Repo**: `docs/cotton/2026_BEST_PRACTICES.md`. Field data → custom (e.g., TX dryland vs CA irr.).

## 1. 2026 Season Outlook [lifestylemonitor.cottoninc](https://lifestylemonitor.cottoninc.com/monthly-economic-letter-january-2026/)

- **Acreage**: 9.4M planted (TX rebound); abandon 19%.
- **Production**: 13.6M bales (856 lb/acre); Upland dominant.
- **Exports**: 12.2M bales (China ↑); mill use 1.6M.
- **Prices**: 63¢/lb avg; ICE Dec '26 hedge @65¢.
- **Policy**: Trump → textile/China tariffs?; ELS niche.
- **Risks**: Dryland drought Plains; Vert N; input inflation. [frontiersin](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1519001/full)

**Breakeven**: ~65¢/lb (TX avg); margins razor-thin. [usda](https://www.usda.gov/sites/default/files/documents/2026AOF-cotton-outlook.pdf)

## 2. Varieties & Regional Fit

| Region (Acres %)         | HU to Cutout | Maturity | Traits              | Notes                                                                                                                                                                   |
| ------------------------ | ------------ | -------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **High Plains TX (40%)** | 2,200–2,500  | Mid      | DP/Xtend/Enlist     | Dryland/irr.; target spot [agrilifetoday.tamu](https://agrilifetoday.tamu.edu/2018/07/16/dryland-cotton-suffering-while-irrigated-cotton-looks-good/).                  |
| **Delta (AR/MS) (25%)**  | 2,400–2,700  | Late     | Bollgard3 XtendFlex | Heavy soils; Verticillium [frontiersin](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1519001/full).                                    |
| **SE (GA/AL/SC) (20%)**  | 2,300–2,600  | Mid      | Enlist/DP           | Humid; reniform nematodes.                                                                                                                                              |
| **West (CA/AZ) (10%)**   | 2,500–2,800  | Late     | Pima (ELS)          | Irr. premium; lygus IPM [farmprogress](https://www.farmprogress.com/cotton/insecticide-use-on-arizona-cotton-farms-reduced-through-ipm).                                |
| **SW (OK/KS) (5%)**      | 2,100–2,400  | Early    | Dryland             | Heat units tight [eupdate.agronomy.ksu](https://eupdate.agronomy.ksu.edu/article/arctic-cotton-will-there-be-enough-heat-units-to-finish-the-kansas-cotton-crop-663-4). |

**Select**: HU match (base 60°F); traits per pest/disease.

## 3. Phenology & Heat Units (DD60) [cropscience.bayer](https://www.cropscience.bayer.us/articles/dad/cotton-growth-and-development)

\[ \text{DD60} = \frac{T*{\max} + T*{\min}}{2} - 60 \]

- No caps (vs corn); 2,200–2,800 to cutout (1st harvestable boll).

**Stages**:

| Stage              | DD60 (post-plant) | Timing       | Events                                                                                                                                                 |
| ------------------ | ----------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Emergence**      | 50–100            | 5–10 days    | ≥64°F soil [eupdate.agronomy.ksu](https://eupdate.agronomy.ksu.edu/article/planting-cotton-in-kansas-soil-temperature-and-seed-quality-are-key-637-1). |
| **Matchhead Sq**   | 350–400           | 25–35 days   | 1st flower site.                                                                                                                                       |
| **1st Bloom (FB)** | 750–850           | 50–60 days   | White flower.                                                                                                                                          |
| **NAWF=5**         | 1,200–1,400       | 75–85 days   | Node above white flower.                                                                                                                               |
| **Cutout**         | **2,200–2,800**   | 110–130 days | NAWF≤2; boll set ends.                                                                                                                                 |
| **Harvest**        | +400–600          | 160–180 days | 40–50% open bolls.                                                                                                                                     |

**Yield Eq** (grams boll wt): [ask.ifas.ufl](https://ask.ifas.ufl.edu/publication/AG450)
\[ \text{Lint (lb/acre)} = \frac{\text{Bolls/acre} \times \text{Boll wt (g)} \times \text{Lint \%} \times \text{Picker eff} \times 0.0022}{1} \]

- Avg: 3–4 bolls/ft row, 5g lint/boll, 38–42% turnout, 87% eff → 1,200–1,800 lb. [ask.ifas.ufl](https://ask.ifas.ufl.edu/publication/AG450)

## 4. Disease Forecast & IPM 2026 [frontiersin](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1519001/full)

**Key Threats**:

| Disease               | Regions        | Timing                    | Losses                                                                                                           | Controls                                                                                                                                                                                                           |
| --------------------- | -------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Verticillium Wilt** | Delta/SE       | Squaring–boll (soilborne) | 10–30% [frontiersin](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1519001/full) | **Conv**: Resistant (Phytogen 499); rotation. **Org**: Solarization/compost. Spectral detect 86–93% UAV [frontiersin](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1519001/full). |
| **Target Spot**       | High Plains/SE | Bloom–boll                | Emerging                                                                                                         | Azoxystrobin VRA; residue mgmt.                                                                                                                                                                                    |
| **Fusarium Wilt**     | TX Plains      | Early veg                 | Race 4                                                                                                           | Resistant varieties (DP 1525).                                                                                                                                                                                     |

**IPM**: Threshold 10% Vert; drones hyperspectral (85–93% acc.). **2026**: Vert up humid Delta. [frontiersin](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1519001/full)

**Insects**: Lygus AZ (40% acres zero spray IPM); Bt bolls ↓ chem 1,000x. [farmprogress](https://www.farmprogress.com/cotton/insecticide-use-on-arizona-cotton-farms-reduced-through-ipm)

## 5. Inputs & Costs (~$850–1,000/acre) [usda](https://www.usda.gov/sites/default/files/documents/2026AOF-cotton-outlook.pdf)

| Input         | Price        | Rate          | Adj.                     |
| ------------- | ------------ | ------------- | ------------------------ |
| **N**         | $0.40/lb     | 80–120 lb     | UAN split bloom.         |
| **P**         | $0.60/lb     | 40–60 lb      | Starter high pH.         |
| **Seed**      | $150–250/bag | 1.1–1.3M/acre | Traits +$50 (XtendFlex). |
| **Defoliant** | $15–25/acre  | Pre-harvest.  | Org: Frost/timing.       |

## 6. Cropping Systems

**Upland Dryland (60%)**: TX Plains; summer fallow.
**Irrigated (35%)**: CA/AZ/TX pivots; 25–35"/season (K_c 0.4 sq → 1.15 boll).
**Pima (ELS, 5%)**: West premium fiber.
**Organic**: ↓ pop; compost; nematodes IPM.

**Pop**: 3–4 plants/ft row.

## 7. Stage-Specific Management

| Stage                | Water ("/day) | Actions                       | Risks                                                                                                                                                         |
| -------------------- | ------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Emergence–Sq**     | 0.15–0.20     | Weed POST; N sidedress.       | Stand (64°F soil) [eupdate.agronomy.ksu](https://eupdate.agronomy.ksu.edu/article/planting-cotton-in-kansas-soil-temperature-and-seed-quality-are-key-637-1). |
| **FB–NAWF=5**        | **0.25–0.30** | **Vert scout; insect thres**. | Boll shed heat.                                                                                                                                               |
| **Cutout–Open Boll** | 0.20          | Defoliant; harvest 40% open.  | Vert boll rot [frontiersin](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1519001/full).                                      |

**Total Water**: 20–35"/season.

## 8. Marketing & Risk (ICE #2, 100 bales ~50k lb) [ice](https://www.ice.com/products/254/cotton-no-2-futures)

- **Specs**: Tick 0.01¢ ($5/bale); DPL 3–7¢; physical delivery.
- **Strategy**: Hedge Oct '26 65¢; basis +1¢ TX.
- **2026**: Global tight (stocks ↓); China mills ↑. [usda](https://www.usda.gov/sites/default/files/documents/2026AOF-cotton-outlook.pdf)

## 9. Field-Specific Skill Overlay

- **Inputs**: FIPS, irr., soil type.
- **Outputs**: Variety (HU match), N/P, Vert VRA (spectral), yield (±200 lb). [eupdate.agronomy.ksu](https://eupdate.agronomy.ksu.edu/article/arctic-cotton-will-there-be-enough-heat-units-to-finish-the-kansas-cotton-crop-663-4)
- **Ex**: TX Plains → mid-mat DP, 100N, dryland; Delta → Vert-resist., irr., target spot high.

**2026 Keys**: TX rebound → quality; IPM lygus/Vert saves $100/acre; hedge mills. Potential 800–1,200 lb opt. [farmprogress](https://www.farmprogress.com/cotton/insecticide-use-on-arizona-cotton-farms-reduced-through-ipm)

**Sources**: USDA, Bayer, KSU, Frontiers, Farm Progress, UF, CottonInc, ICE. Mar 2026. [eupdate.agronomy.ksu](https://eupdate.agronomy.ksu.edu/article/planting-cotton-in-kansas-soil-temperature-and-seed-quality-are-key-637-1)
