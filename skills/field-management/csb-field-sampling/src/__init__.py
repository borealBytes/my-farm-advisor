"""CSB Field Sampling - Deterministic sampling from USDA NASS Crop Sequence Boundaries.

This module provides functions to sample agricultural field boundaries
deterministically using random seeds, with support for region and crop filtering.
"""

from .csb_sampling import (
    export_sample,
    get_fields_by_aoi,
    get_fields_by_bbox,
    get_random_fields,
    get_sampling_summary,
    sample_fields,
)

__version__ = "1.0.0"
__author__ = "Boreal Bytes"

__all__ = [
    "sample_fields",
    "get_random_fields",
    "get_fields_by_aoi",
    "get_fields_by_bbox",
    "export_sample",
    "get_sampling_summary",
]
