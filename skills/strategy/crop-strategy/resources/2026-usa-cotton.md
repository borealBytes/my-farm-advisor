# 2026 USA Cotton Strategy Reference

Use this reference when generating cotton strategy cards, farm intelligence summaries, or field-level action plans. Cotton recommendations must be tied to heat units, local variety trials, water capacity, soil constraints, pest pressure, and harvest logistics.

## Primary Sources

- USDA Agricultural Outlook Forum 2026 cotton outlook: https://www.usda.gov/sites/default/files/documents/2026AOF-cotton-outlook.pdf
- USDA NASS Prospective Plantings, March 31 2026: https://esmis.nal.usda.gov/sites/default/release-files/795840/pspl0326.pdf
- USDA Agricultural Projections to 2035: https://ers.usda.gov/sites/default/files/_laserfiche/outlooks/113817/OCE-2026-1.pdf
- Texas A&M AgriLife Extension cotton agronomy, High Plains: https://lubbock.tamu.edu/programs/crops/cotton/extension-cotton-agronomy/
- Texas High Plains cotton performance trials: https://lubbock.tamu.edu/wp-content/uploads/sites/3/2026/01/2025-cotton-performance-booklet-online-version.pdf
- LSU AgCenter 2026 cotton varieties: https://www.lsuagcenter.com/topics/crops/cotton/variety_trials
- UGA cotton production resources: https://extension.uga.edu/topic-areas/field-crop-forage-turfgrass-production/cotton.html
- University of Arizona cotton resources: https://extension.arizona.edu/topics/cotton

## 2026 Planning Baseline

USDA AOF projected 2026/27 U.S. cotton planted area near 9.4 million acres and production near 13.6 million bales. NASS Prospective Plantings later estimated all cotton planted area at 9.64 million acres. Use the NASS survey number for acreage-sensitive narratives and USDA AOF for supply, demand, export, and price context.

Cotton is more locally variable than the national outlook suggests. High Plains dryland, Delta irrigated heavy soils, Southeast humid systems, and Western irrigated or Pima systems need different variety, water, pest, and harvest plans.

## Regional Decision Bands

| Region | Planting frame | Variety or maturity frame | Main risk watchouts |
| --- | --- | --- | --- |
| High Plains | May, once soil temperature is suitable | early to mid, dryland or irrigated trial fit | drought, heat units, stand establishment, Verticillium |
| Delta | Apr-May | mid to full season, high-yield adapted varieties | heavy soils, plant bugs, boll rot, target spot |
| Southeast | Apr-May | mid season, local UGA/Extension fit | humid canopy disease, nematodes, thrips, hurricane timing |
| West | Mar-Apr | full-season Upland or Pima where appropriate | irrigation timing, lygus, heat, defoliation timing |
| Southern Plains fringe | May-Jun | early to mid, heat-unit protection | short season, cold starts, drought |

Use local variety trial data before recommending a named variety. In report copy, describe the desired package rather than a product name.

## Field-Data Triggers

- Low available water storage: If `total_aws_inches` is below 4.0, frame cotton as water-limited and recommend conservative population, dryland-adapted varieties, and stress scouting.
- Strong available water storage: If `total_aws_inches` is 6.0 or higher and drainage is adequate, the field can support higher yield targets but still needs irrigation or rainfall timing checks.
- Poor drainage: If `drainage_class` includes poorly drained, warn on stand loss, trafficability, seedling disease, and delayed field operations.
- High pH: If `avg_ph` is above 7.2, recommend local tissue or soil-test review for micronutrient constraints rather than automatic correction.
- Low organic matter: If `avg_om_pct` is below 1.5, flag moisture buffering and crusting risk, especially on coarse or low-residue fields.
- High headlands: If `headlands_pct` is 18% or higher, plan picker logistics, turn-row compaction mitigation, and harvest timing.
- High clay: If `avg_clay_pct` exceeds 35%, flag trafficability and waterlogging risk; pair with drainage class before making a strong statement.

## Pest, Disease, And Scouting Frame

Cotton scouting should be local and stage-specific. Use extension thresholds and local pest advisories for thrips, plant bugs, lygus, bollworm, nematodes, Verticillium, target spot, and boll rot.

Report wording should focus on preparedness:

- Match variety maturity and trait package to heat units, pest spectrum, and local performance trials.
- Protect stand establishment; cotton has limited ability to compensate for poor early stands compared with many grain crops.
- Use irrigation scheduling where available; avoid both early vegetative rankness and late-season stress during boll fill.
- Plan defoliation and harvest timing early when headlands, field size, or wet fall risk may slow operations.

## Report-Ready Recommendation Patterns

- `Cotton strategy should be tied to local heat units and variety trial performance; use the report weather summary as a first screen before final variety selection.`
- `Available water storage is below 4 inches; treat this as a dryland-stress field and keep population, variety maturity, and boll-load expectations conservative.`
- `Poor drainage is a likely limiter; prioritize stand checks and avoid traffic that compounds wet-soil compaction.`
- `High headlands increase harvest and traffic burden; pre-plan picker movement and turn-row compaction mitigation.`

## Equations And Checks

- Cotton DD60: `((Tmax + Tmin) / 2) - 60 F`, with local rules for temperature handling.
- Use heat-unit accumulation to protect maturity and defoliation timing.
- Use lint yield, turnout, and fiber quality together; do not make cotton decisions from lint pounds alone.

## Advisor Cautions

- Do not recommend a named cotton variety without local trial support.
- Do not infer irrigation capacity from high available water storage; soil water capacity and irrigation infrastructure are different facts.
- Do not recommend pesticide products without local label and threshold confirmation.
