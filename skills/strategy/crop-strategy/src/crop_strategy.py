from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import pandas as pd


@dataclass(frozen=True, slots=True)
class CropRegionGuidance:
    label: str
    planting_window: str
    watchouts: tuple[str, ...]
    corn_rm_range: str | None = None
    soybean_mg_range: str | None = None
    selection_label: str | None = None
    selection_range: str | None = None


_CORN_GUIDANCE = (
    (
        46.0,
        CropRegionGuidance(
            "North",
            "Apr 20-May 10",
            ("early frost risk", "slow spring heat accumulation"),
            corn_rm_range="78-92",
        ),
    ),
    (
        41.0,
        CropRegionGuidance(
            "Corn Belt",
            "Apr 25-May 20",
            ("tar spot pressure after cool, wet stretches", "nitrogen timing at V6-V8"),
            corn_rm_range="104-114",
        ),
    ),
    (
        37.0,
        CropRegionGuidance(
            "Transition",
            "Apr 25-May 25",
            ("mid-summer moisture stress", "gray leaf spot and southern rust movement"),
            corn_rm_range="112-116",
        ),
    ),
    (
        -90.0,
        CropRegionGuidance(
            "South",
            "Mar 15-May 1",
            ("southern rust spread", "peak irrigation demand at pollination"),
            corn_rm_range="116+",
        ),
    ),
)

_SOY_GUIDANCE = (
    (
        46.0,
        CropRegionGuidance(
            "North",
            "May 10-Jun 10",
            ("early frost risk", "compressed planting window"),
            soybean_mg_range="0.0-1.5",
        ),
    ),
    (
        41.0,
        CropRegionGuidance(
            "Upper Midwest",
            "Apr 25-Jun 1",
            ("white mold in cool dense canopies", "late planting yield drag"),
            soybean_mg_range="1.5-3.0",
        ),
    ),
    (
        38.0,
        CropRegionGuidance(
            "Corn Belt South",
            "May 1-Jun 15",
            ("frogeye leaf spot pressure", "double-crop timing tradeoffs"),
            soybean_mg_range="3.0-4.0",
        ),
    ),
    (
        35.0,
        CropRegionGuidance(
            "Transition",
            "May 5-Jun 20",
            ("irrigation timing at R1-R5", "late-season heat stress"),
            soybean_mg_range="3.5-4.5",
        ),
    ),
    (
        33.0,
        CropRegionGuidance(
            "South",
            "Apr 20-Jul 1",
            ("rust movement from the south", "SDS after cool, wet starts"),
            soybean_mg_range="4.5-5.5",
        ),
    ),
    (
        -90.0,
        CropRegionGuidance(
            "Deep South",
            "Mar 15-Jul 15",
            ("extended disease window", "lodging and harvest timing"),
            soybean_mg_range="5.5-6.5",
        ),
    ),
)

_WHEAT_GUIDANCE = (
    (
        46.0,
        CropRegionGuidance(
            "Northern wheat",
            "Mar-May spring wheat or local fall window for winter wheat",
            ("late spring field access", "heat during grain fill"),
            selection_label="wheat class",
            selection_range="HRS, durum, or locally adapted spring wheat",
        ),
    ),
    (
        41.0,
        CropRegionGuidance(
            "Central winter wheat",
            "Sep 20-Oct 20 local fall window",
            ("stripe rust and leaf rust", "protein target economics"),
            selection_label="wheat class",
            selection_range="HRW or SRW by market and local trial fit",
        ),
    ),
    (
        37.0,
        CropRegionGuidance(
            "Southern winter wheat",
            "Oct 1-Nov 15 local fall window",
            ("Fusarium head blight in humid flowering windows", "lodging on wet, high-N fields"),
            selection_label="wheat class",
            selection_range="SRW or HRW by market, drainage, and disease package",
        ),
    ),
    (
        -90.0,
        CropRegionGuidance(
            "Delta and southern wheat",
            "Oct 15-Nov 30 local fall window",
            ("wet feet and delayed fieldwork", "heading-stage disease pressure"),
            selection_label="wheat class",
            selection_range="SRW or regional winter wheat by market endpoint",
        ),
    ),
)

_COTTON_GUIDANCE = (
    (
        37.0,
        CropRegionGuidance(
            "Southern Plains cotton",
            "May 5-Jun 5 after warm-soil readiness",
            ("short-season heat-unit completion", "dryland drought stress"),
            selection_label="cotton maturity",
            selection_range="early to mid maturity, heat-unit protected package",
        ),
    ),
    (
        33.0,
        CropRegionGuidance(
            "Mid-South and Southeast cotton",
            "Apr 15-May 20",
            ("plant bugs, nematodes, and humid-canopy disease", "boll-fill heat and harvest weather"),
            selection_label="cotton maturity",
            selection_range="mid to full season by local variety trial fit",
        ),
    ),
    (
        -90.0,
        CropRegionGuidance(
            "Western and Deep South cotton",
            "Mar 15-May 10 by irrigation district and heat units",
            ("irrigation timing from bloom through boll fill", "defoliation and harvest timing"),
            selection_label="cotton maturity",
            selection_range="full-season Upland or Pima only where local trials support it",
        ),
    ),
)

_SORGHUM_GUIDANCE = (
    (
        45.0,
        CropRegionGuidance(
            "Northern sorghum fringe",
            "May 25-Jun 20 after warm-soil readiness",
            ("frost risk before drydown", "tight GDD completion"),
            selection_label="sorghum hybrid maturity",
            selection_range="short-season grain hybrid",
        ),
    ),
    (
        37.0,
        CropRegionGuidance(
            "Central Plains sorghum",
            "May 10-Jun 20",
            ("boot-to-soft-dough moisture stress", "headworm or midge scouting"),
            selection_label="sorghum hybrid maturity",
            selection_range="short to medium grain hybrid",
        ),
    ),
    (
        -90.0,
        CropRegionGuidance(
            "Southern Plains sorghum",
            "Apr 20-Jun 30",
            ("sugarcane aphid and head insect pressure", "anthracnose or grain mold in humid windows"),
            selection_label="sorghum hybrid maturity",
            selection_range="medium grain or forage hybrid by market endpoint",
        ),
    ),
)

_CROP_LABELS = {
    "corn": "corn",
    "soybean": "soybean",
    "wheat": "wheat",
    "cotton": "cotton",
    "sorghum": "sorghum",
    "mixed": "mixed crop",
}

_CROP_TABLES = {
    "corn": _CORN_GUIDANCE,
    "soybean": _SOY_GUIDANCE,
    "wheat": _WHEAT_GUIDANCE,
    "cotton": _COTTON_GUIDANCE,
    "sorghum": _SORGHUM_GUIDANCE,
}

_CROP_TERMS = {
    "cotton": ("cotton",),
    "sorghum": ("sorghum", "milo"),
    "wheat": ("wheat",),
    "soybean": ("soybean", "soybeans", "soy"),
    "corn": ("corn",),
}


def _safe_float(value: Any) -> float | None:
    if value is None:
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if pd.isna(number):
        return None
    return number


def _crop_from_text(value: Any) -> str | None:
    text = str(value or "").lower()
    if not text:
        return None
    for crop, terms in _CROP_TERMS.items():
        if any(term in text for term in terms):
            return crop
    return None


def _crop_presence(value: Any) -> set[str]:
    text = str(value or "").lower()
    return {
        crop
        for crop, terms in _CROP_TERMS.items()
        if any(term in text for term in terms)
    }


def _crop_from_outlook(value: Any) -> str | None:
    text = str(value or "").lower()
    if not text:
        return None
    for crop, terms in _CROP_TERMS.items():
        if any(f"{term} next" in text or f"next {term}" in text for term in terms):
            return crop
    return _crop_from_text(text)


def _crop_focus(field_row: dict[str, Any]) -> str:
    for key in ("predicted_next_crop", "dominant_crop", "crop_label"):
        crop = _crop_from_text(field_row.get(key))
        if crop:
            return crop

    crop = _crop_from_outlook(field_row.get("rotation_outlook"))
    if crop:
        return crop

    sequence = str(field_row.get("rotation_sequence", ""))
    if sequence:
        latest = sequence.replace("\u2192", "->").split("->")[-1]
        crop = _crop_from_text(latest)
        if crop:
            return crop

    corn_years = _safe_float(field_row.get("corn_years")) or 0.0
    soybean_years = _safe_float(field_row.get("soybean_years")) or 0.0
    if corn_years > soybean_years:
        return "corn"
    if soybean_years > corn_years:
        return "soybean"

    text = " ".join(
        str(field_row.get(key, "")).lower()
        for key in (
            "rotation_outlook",
            "rotation_sequence",
            "dominant_crop",
            "crop_label",
        )
    )
    crops = _crop_presence(text)
    if len(crops) == 1:
        return next(iter(crops))
    return "mixed"


def _guidance_for_latitude(latitude: float, crop_focus: str) -> CropRegionGuidance:
    table = _CROP_TABLES.get(crop_focus, _CORN_GUIDANCE)
    for threshold, guidance in table:
        if latitude >= threshold:
            return guidance
    return table[-1][1]


def _average_column(field_df: pd.DataFrame, column: str) -> float | None:
    if column not in field_df.columns:
        return None
    numeric = pd.to_numeric(pd.Series(field_df[column], dtype="object"), errors="coerce")
    values = pd.Series(numeric, dtype="float64").dropna()
    if values.empty:
        return None
    return _safe_float(values.mean())


def _selection_message(crop_focus: str, guidance: CropRegionGuidance, latitude: float) -> str:
    if crop_focus == "corn":
        return f"For this latitude band, keep corn hybrid selection centered around RM {guidance.corn_rm_range}."
    if crop_focus == "soybean":
        return f"For this latitude band, keep soybean maturity selection centered around MG {guidance.soybean_mg_range}."
    if crop_focus in {"wheat", "cotton", "sorghum"}:
        return (
            f"For this latitude band, match {guidance.selection_label or crop_focus} "
            f"to {guidance.selection_range or 'local extension trial fit'}."
        )
    corn_guidance = _guidance_for_latitude(latitude, "corn")
    soy_guidance = _guidance_for_latitude(latitude, "soybean")
    return (
        "Rotation signals are mixed, so compare both "
        f"corn RM {corn_guidance.corn_rm_range or 'regional'} and "
        f"soybean MG {soy_guidance.soybean_mg_range or 'regional'} options before locking the 2026 plan."
    )


def generate_field_recommendations(
    field_row: dict[str, Any],
    *,
    centroid_lat: float,
) -> dict[str, Any]:
    crop_focus = _crop_focus(field_row)
    guidance = _guidance_for_latitude(centroid_lat, crop_focus)
    action_plan: list[str] = []
    watchouts: list[str] = []
    optimize_for_success: list[str] = []

    action_plan.append(
        f"{guidance.label} planning window: target {guidance.planting_window} readiness for the 2026 season."
    )
    action_plan.append(_selection_message(crop_focus, guidance, centroid_lat))

    ph = _safe_float(field_row.get("avg_ph"))
    if ph is not None:
        if ph < 6.0:
            action_plan.append(
                f"Average pH is {ph:.1f}; schedule lime planning before spring fieldwork and retest after amendment."
            )
            watchouts.append(
                "Low pH can suppress nutrient uptake and early vigor if liming is delayed."
            )
        elif ph > 7.2:
            watchouts.append(
                "Higher pH can increase micronutrient tie-up risk; validate tissue tests early."
            )

    om = _safe_float(field_row.get("avg_om_pct"))
    if om is not None:
        if om < 1.5:
            action_plan.append(
                f"Organic matter is {om:.1f}%; protect residue and evaluate cover or reduced-tillage options to rebuild buffering capacity."
            )
        elif om >= 3.0:
            optimize_for_success.append(
                f"Organic matter is strong ({om:.1f}%); use that nutrient cycling and water-buffering advantage in yield-response rankings."
            )

    aws = _safe_float(field_row.get("total_aws_inches"))
    if aws is not None:
        if aws < 4.0:
            action_plan.append(
                f"Available water storage is {aws:.1f} in; prioritize drought-response planning and tight in-season scouting intervals."
            )
            watchouts.append(
                "Moisture stress risk is elevated around rapid growth and reproductive stages."
            )
        elif aws >= 6.0:
            optimize_for_success.append(
                f"Water-holding capacity is strong ({aws:.1f} in); lean into higher-yield fertility and population where drainage allows."
            )

    precip = _safe_float(field_row.get("annual_precip_mm"))
    if precip is not None:
        if precip < 500.0:
            action_plan.append(
                f"Annual precipitation averages {precip:.0f} mm; use dryland stress planning and protect reproductive-stage moisture."
            )
        elif precip >= 1000.0:
            watchouts.append(
                f"Annual precipitation averages {precip:.0f} mm; wet-canopy disease and trafficability risk deserve extra attention."
            )

    gdd = _safe_float(field_row.get("max_gdd_cumulative"))
    if gdd is not None and crop_focus in {"corn", "cotton", "sorghum"}:
        if gdd < 2200.0:
            watchouts.append(
                f"Cumulative base-10C GDD is {gdd:.0f}; verify maturity or heat-unit fit before final seed decisions."
            )

    drainage = str(field_row.get("drainage_class", "")).lower()
    if drainage:
        if "poorly" in drainage:
            action_plan.append(
                "Drainage is a likely limiter; prioritize trafficability checks before sidedress, fungicide, and post-emerge operations."
            )
            watchouts.append(
                "Saturated windows can cause compaction and delayed passes."
            )
        elif "well drained" in drainage:
            optimize_for_success.append(
                "Well-drained profile supports timely operations; use that advantage to execute narrower timing windows."
            )

    diversity = _safe_float(field_row.get("crop_diversity"))
    if diversity is not None and diversity <= 1.0:
        action_plan.append(
            "Low recent rotation diversity raises disease and weed pressure, so keep scouting intensity high and preserve trait/chemistry flexibility."
        )
        watchouts.append(
            "Low diversity history increases disease carryover and herbicide-resistance pressure."
        )

    headlands_pct = _safe_float(field_row.get("headlands_pct"))
    if headlands_pct is not None and headlands_pct >= 18.0:
        optimize_for_success.append(
            f"Headlands are {headlands_pct:.1f}% of field area; pre-plan turn rows and pass sequence to reduce overlap and compaction."
        )

    clay = _safe_float(field_row.get("avg_clay_pct"))
    if clay is not None and clay > 35.0:
        watchouts.append(
            f"Clay content is {clay:.0f}%; monitor compaction risk and spring trafficability before tight-timing passes."
        )

    erosion = str(field_row.get("erosion_risk", "")).lower()
    if "high" in erosion:
        action_plan.append(
            "Erosion risk is high; preserve residue or contour/cover-crop protection where it fits the crop plan."
        )

    if not optimize_for_success:
        optimize_for_success.append(
            "Use the field poster rankings to prioritize this field's strongest category and allocate inputs where return potential is highest."
        )

    watchouts.extend(
        [
            f"Regional watchout: {guidance.watchouts[0]}.",
            f"Regional watchout: {guidance.watchouts[1]}.",
        ]
    )

    dedup_action = list(dict.fromkeys(action_plan))
    dedup_watchouts = list(dict.fromkeys(watchouts))
    dedup_optimize = list(dict.fromkeys(optimize_for_success))

    return {
        "crop_focus": crop_focus,
        "region": guidance.label,
        "planting_window": guidance.planting_window,
        "recommendations": dedup_action[:5],
        "monitoring": dedup_watchouts[:4],
        "action_plan": dedup_action[:5],
        "watchouts": dedup_watchouts[:4],
        "optimize_for_success": dedup_optimize[:4],
    }


def generate_farm_recommendations(
    field_df: pd.DataFrame, *, farm_name: str
) -> dict[str, Any]:
    if field_df.empty:
        return {
            "title": f"{farm_name} 2026 strategy outlook",
            "bullets": [
                "No field reporting data is available yet for crop-strategy recommendations."
            ],
        }

    row_dicts = [row.to_dict() for _, row in field_df.iterrows()]
    focus_counts = {
        crop: sum(1 for row in row_dicts if _crop_focus(row) == crop)
        for crop in _CROP_LABELS
    }
    avg_aws = _average_column(field_df, "total_aws_inches")
    avg_om = _average_column(field_df, "avg_om_pct")
    avg_precip = _average_column(field_df, "annual_precip_mm")
    low_diversity_fields = 0
    if "crop_diversity" in field_df.columns:
        diversity_numeric = pd.to_numeric(
            pd.Series(field_df["crop_diversity"], dtype="object"), errors="coerce"
        )
        diversity = pd.Series(diversity_numeric, dtype="float64").fillna(99)
        low_diversity_fields = int((diversity <= 1).sum())

    lead_crop = max(focus_counts.items(), key=lambda item: item[1])[0]
    lead_label = f"{_CROP_LABELS.get(lead_crop, lead_crop)}-led"
    bullets = [
        f"{farm_name} reads as a {lead_label} portfolio for 2026, so keep whole-farm seed, fertility, and fungicide plans aligned around that bias.",
    ]
    if avg_aws is not None:
        bullets.append(
            f"Average available water storage is {float(avg_aws):.1f} in across the farm; use that spread to rank which fields need the earliest stress scouting."
        )
    if avg_om is not None:
        bullets.append(
            f"Average organic matter is {float(avg_om):.1f}%, which should shape residue, tillage, and nutrient timing decisions across the grower group."
        )
    if avg_precip is not None:
        bullets.append(
            f"Average annual precipitation is {float(avg_precip):.0f} mm; use local weather spread to rank drought, disease, and trafficability scouting priorities."
        )
    if low_diversity_fields > 0:
        bullets.append(
            f"{low_diversity_fields} field(s) show low crop diversity, so disease carryover and herbicide-resistance watchlists deserve extra attention this season."
        )
    bullets.append(
        "Use the 2026 crop resources to pre-assign scouting priorities by crop: disease pressure, planting-window execution, maturity fit, and reproductive-stage moisture risk."
    )

    return {
        "title": f"{farm_name} 2026 strategy outlook",
        "bullets": bullets[:5],
    }
