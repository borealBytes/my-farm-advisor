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


def _crop_focus(field_row: dict[str, Any]) -> str:
    text = " ".join(
        str(field_row.get(key, "")).lower()
        for key in ("rotation_outlook", "rotation_sequence", "dominant_crop", "crop_label")
    )
    if "soy" in text and "corn" not in text:
        return "soybean"
    if "corn" in text and "soy" not in text:
        return "corn"
    corn_years = _safe_float(field_row.get("corn_years")) or 0.0
    soybean_years = _safe_float(field_row.get("soybean_years")) or 0.0
    if corn_years > soybean_years:
        return "corn"
    if soybean_years > corn_years:
        return "soybean"
    return "mixed"


def _guidance_for_latitude(latitude: float, crop_focus: str) -> CropRegionGuidance:
    table = _SOY_GUIDANCE if crop_focus == "soybean" else _CORN_GUIDANCE
    for threshold, guidance in table:
        if latitude >= threshold:
            return guidance
    return table[-1][1]


def generate_field_recommendations(
    field_row: dict[str, Any],
    *,
    centroid_lat: float,
) -> dict[str, Any]:
    crop_focus = _crop_focus(field_row)
    guidance = _guidance_for_latitude(centroid_lat, crop_focus)
    recommendations: list[str] = []

    recommendations.append(
        f"{guidance.label} planning window: target {guidance.planting_window} readiness for the 2026 season."
    )

    if crop_focus == "corn":
        recommendations.append(
            f"For this latitude band, keep corn hybrid selection centered around RM {guidance.corn_rm_range}."
        )
    elif crop_focus == "soybean":
        recommendations.append(
            f"For this latitude band, keep soybean maturity selection centered around MG {guidance.soybean_mg_range}."
        )
    else:
        recommendations.append(
            f"Rotation signals are mixed, so compare both corn RM {guidance.corn_rm_range or 'regional'} and soybean MG {guidance.soybean_mg_range or 'regional'} options before locking the 2026 plan."
        )

    aws = _safe_float(field_row.get("total_aws_inches"))
    if aws is not None:
        if aws < 4.0:
            recommendations.append(
                "Available water storage is light, so prioritize stress monitoring through rapid-growth and reproductive windows."
            )
        elif aws >= 6.0:
            recommendations.append(
                "Water-holding capacity is a strength here; use it to support higher-yield management where drainage stays workable."
            )

    drainage = str(field_row.get("drainage_class", "")).lower()
    if drainage:
        if "poorly" in drainage:
            recommendations.append(
                "Drainage is a likely limiter, so watch saturated periods closely before sidedress, fungicide, or post-emerge passes."
            )
        elif "well drained" in drainage:
            recommendations.append(
                "Better drainage supports timely field operations, but track dry-down in hot windows to avoid hidden moisture stress."
            )

    diversity = _safe_float(field_row.get("crop_diversity"))
    if diversity is not None and diversity <= 1.0:
        recommendations.append(
            "Low recent rotation diversity raises disease and weed pressure, so keep scouting intensity high and preserve trait/chemistry flexibility."
        )

    monitoring = [
        f"Watch for {guidance.watchouts[0]}.",
        f"Also monitor {guidance.watchouts[1]}.",
    ]

    return {
        "crop_focus": crop_focus,
        "region": guidance.label,
        "planting_window": guidance.planting_window,
        "recommendations": recommendations[:4],
        "monitoring": monitoring,
    }


def generate_farm_recommendations(field_df: pd.DataFrame, *, farm_name: str) -> dict[str, Any]:
    if field_df.empty:
        return {
            "title": f"{farm_name} 2026 strategy outlook",
            "bullets": [
                "No field reporting data is available yet for crop-strategy recommendations."
            ],
        }

    row_dicts = [row.to_dict() for _, row in field_df.iterrows()]
    focus_counts = {
        "corn": sum(1 for row in row_dicts if _crop_focus(row) == "corn"),
        "soybean": sum(1 for row in row_dicts if _crop_focus(row) == "soybean"),
        "mixed": sum(1 for row in row_dicts if _crop_focus(row) == "mixed"),
    }
    avg_aws = (
        field_df["total_aws_inches"].dropna().mean()
        if "total_aws_inches" in field_df.columns
        else None
    )
    avg_om = field_df["avg_om_pct"].dropna().mean() if "avg_om_pct" in field_df.columns else None
    low_diversity_fields = 0
    if "crop_diversity" in field_df.columns:
        low_diversity_fields = int((field_df["crop_diversity"].fillna(99) <= 1).sum())

    lead_crop = max(focus_counts, key=focus_counts.get)
    lead_label = (
        "corn-heavy"
        if lead_crop == "corn"
        else "soybean-heavy"
        if lead_crop == "soybean"
        else "mixed corn-soy"
    )
    bullets = [
        f"{farm_name} reads as a {lead_label} portfolio for 2026, so keep whole-farm seed, fertility, and fungicide plans aligned around that bias.",
    ]
    if avg_aws is not None and not pd.isna(avg_aws):
        bullets.append(
            f"Average available water storage is {float(avg_aws):.1f} in across the farm; use that spread to rank which fields need the earliest stress scouting."
        )
    if avg_om is not None and not pd.isna(avg_om):
        bullets.append(
            f"Average organic matter is {float(avg_om):.1f}%, which should shape residue, tillage, and nutrient timing decisions across the grower group."
        )
    if low_diversity_fields > 0:
        bullets.append(
            f"{low_diversity_fields} field(s) show low crop diversity, so disease carryover and herbicide-resistance watchlists deserve extra attention this season."
        )
    bullets.append(
        "Use the 2026 outlook to pre-assign scouting priorities by region: disease pressure, planting window execution, and reproductive-stage moisture risk."
    )

    return {
        "title": f"{farm_name} 2026 strategy outlook",
        "bullets": bullets[:4],
    }
