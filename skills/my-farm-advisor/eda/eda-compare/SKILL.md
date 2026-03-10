---
name: eda-compare
description: Compare groups and categories in agricultural datasets using pandas and scipy. Perform statistical tests, create comparative visualizations, and identify significant differences between groups.
version: 1.0.0
author: Boreal Bytes
tags: [comparison, statistics, groups, pandas, scipy]
---

# Skill: eda-compare

## Description

Compare groups and categories within agricultural datasets using standard pandas and scipy. Perform statistical comparisons, create comparative visualizations, and calculate statistical significance using real library code.

## When to Use This Skill

- **Comparing regions**: Compare yields across different areas
- **Crop comparisons**: Analyze differences between crop types
- **Before/after tests**: Measure treatment effects
- **Group analysis**: Identify significant differences
- **Statistical testing**: Validate observed differences

## Prerequisites

```bash
pip install pandas scipy matplotlib seaborn
```

## Quick Start

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Load data
df = pd.read_csv('data/yields.csv')

# Compare yields by crop
plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x='crop', y='yield')
plt.title('Yield by Crop Type')
plt.savefig('yield_comparison.png')
plt.close()

# Statistical test
corn = df[df['crop'] == 'corn']['yield']
soy = df[df['crop'] == 'soybeans']['yield']
t_stat, p_value = stats.ttest_ind(corn, soy)
print(f"T-test p-value: {p_value:.4f}")
```

## Common Tasks

### Task 1: Compare Groups with Box Plots

**What**: Visualize distributions across categories.

**When to use**: Compare groups visually, identify outliers.

**Code**:

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data/soil_by_region.csv')

# Create box plot
plt.figure(figsize=(12, 6))
sns.boxplot(data=df, x='region', y='ph_water', palette='Set2')
plt.title('Soil pH by Region', fontsize=14, fontweight='bold')
plt.xlabel('Region', fontsize=12)
plt.ylabel('pH Level', fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('output/ph_by_region.png', dpi=300)
plt.close()

print("Created: output/ph_by_region.png")
```

### Task 2: Calculate Group Statistics

**What**: Compute summary statistics by group.

**When to use**: Quantify differences, create comparison tables.

**Code**:

```python
import pandas as pd

# Load data
df = pd.read_csv('data/yields.csv')

# Calculate statistics by group
stats = df.groupby('crop')['yield'].agg([
    'count', 'mean', 'std', 'min', 'max'
]).round(2)

print("Yield Statistics by Crop:")
print(stats)

# Save to CSV
stats.to_csv('output/yield_stats_by_crop.csv')

# Compare specific metrics
print("\nMean yields:")
print(df.groupby('crop')['yield'].mean().sort_values(ascending=False))
```

### Task 3: T-Test for Two Groups

**What**: Test if two groups have significantly different means.

**When to use**: Compare exactly two groups (e.g., treated vs control).

**Code**:

```python
import pandas as pd
from scipy import stats

# Load data
df = pd.read_csv('data/treatment_results.csv')

# Separate groups
treated = df[df['treatment'] == 'treated']['yield']
control = df[df['treatment'] == 'control']['yield']

# Perform t-test
t_stat, p_value = stats.ttest_ind(treated, control)

print("T-Test Results:")
print(f"  Treated group: n={len(treated)}, mean={treated.mean():.2f}")
print(f"  Control group: n={len(control)}, mean={control.mean():.2f}")
print(f"  T-statistic: {t_stat:.3f}")
print(f"  P-value: {p_value:.4f}")

# Interpret
alpha = 0.05
if p_value < alpha:
    print(f"  ✓ Significant difference (p < {alpha})")
    diff = treated.mean() - control.mean()
    pct_change = (diff / control.mean()) * 100
    print(f"  Difference: {diff:.2f} units ({pct_change:+.1f}%)")
else:
    print(f"  ✗ No significant difference (p >= {alpha})")
```

### Task 4: ANOVA for Multiple Groups

**What**: Test if three or more groups have different means.

**When to use**: Compare multiple regions, crops, or treatments.

**Code**:

```python
import pandas as pd
from scipy import stats

# Load data
df = pd.read_csv('data/yields_by_region.csv')

# Separate groups
groups = []
region_names = df['region'].unique()

for region in region_names:
    group_data = df[df['region'] == region]['yield']
    groups.append(group_data)
    print(f"{region}: n={len(group_data)}, mean={group_data.mean():.2f}")

# Perform ANOVA
f_stat, p_value = stats.f_oneway(*groups)

print(f"\nANOVA Results:")
print(f"  F-statistic: {f_stat:.3f}")
print(f"  P-value: {p_value:.4f}")

alpha = 0.05
if p_value < alpha:
    print(f"  ✓ Significant differences between regions (p < {alpha})")
else:
    print(f"  ✗ No significant differences (p >= {alpha})")

# If significant, do post-hoc analysis
if p_value < alpha:
    print("\nPost-hoc pairwise comparisons (t-tests):")
    for i, region1 in enumerate(region_names):
        for region2 in region_names[i+1:]:
            g1 = df[df['region'] == region1]['yield']
            g2 = df[df['region'] == region2]['yield']
            _, p = stats.ttest_ind(g1, g2)
            sig = "*" if p < 0.05 else ""
            print(f"  {region1} vs {region2}: p={p:.4f} {sig}")
```

### Task 5: Violin Plots for Distribution Comparison

**What**: Compare full distributions across groups.

**When to use**: See shape of distributions, not just statistics.

**Code**:

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data/soil_data.csv')

# Create violin plot
plt.figure(figsize=(12, 6))
sns.violinplot(data=df, x='crop_type', y='organic_matter', palette='Set2')
plt.title('Organic Matter Distribution by Crop Type', fontsize=14, fontweight='bold')
plt.xlabel('Crop Type', fontsize=12)
plt.ylabel('Organic Matter (%)', fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('output/organic_matter_violin.png', dpi=300)
plt.close()

print("Created: output/organic_matter_violin.png")
```

## Complete Example

### Full Group Comparison Workflow

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import os

# Ensure output directory
os.makedirs('output/comparisons', exist_ok=True)

# Load data
print("Loading data...")
df = pd.read_csv('data/field_data.csv')

# 1. Group statistics
print("\n1. Calculating group statistics...")
crop_stats = df.groupby('crop_type').agg({
    'yield': ['count', 'mean', 'std', 'min', 'max'],
    'field_size': 'mean'
}).round(2)

crop_stats.to_csv('output/comparisons/crop_statistics.csv')
print("Crop Statistics:")
print(crop_stats)

# 2. Visualization
print("\n2. Creating visualizations...")

# Box plot
plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x='crop_type', y='yield', palette='Set2')
plt.title('Yield by Crop Type')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('output/comparisons/yield_boxplot.png', dpi=300)
plt.close()

# Violin plot
plt.figure(figsize=(10, 6))
sns.violinplot(data=df, x='crop_type', y='yield', palette='Set2')
plt.title('Yield Distribution by Crop Type')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('output/comparisons/yield_violin.png', dpi=300)
plt.close()

# 3. Statistical tests
print("\n3. Performing statistical tests...")

# Get crop types
crops = df['crop_type'].unique()

if len(crops) == 2:
    # T-test for 2 groups
    group1 = df[df['crop_type'] == crops[0]]['yield']
    group2 = df[df['crop_type'] == crops[1]]['yield']
    t_stat, p_value = stats.ttest_ind(group1, group2)

    print(f"T-test ({crops[0]} vs {crops[1]}):")
    print(f"  t-statistic: {t_stat:.3f}")
    print(f"  p-value: {p_value:.4f}")
    print(f"  {'Significant' if p_value < 0.05 else 'Not significant'} difference")

elif len(crops) > 2:
    # ANOVA for 3+ groups
    groups = [df[df['crop_type'] == crop]['yield'] for crop in crops]
    f_stat, p_value = stats.f_oneway(*groups)

    print(f"ANOVA ({len(crops)} groups):")
    print(f"  F-statistic: {f_stat:.3f}")
    print(f"  p-value: {p_value:.4f}")
    print(f"  {'Significant' if p_value < 0.05 else 'Not significant'} differences")

# 4. Pairwise comparisons
print("\n4. Pairwise comparisons:")
for i, crop1 in enumerate(crops):
    for crop2 in crops[i+1:]:
        g1 = df[df['crop_type'] == crop1]['yield']
        g2 = df[df['crop_type'] == crop2]['yield']
        _, p = stats.ttest_ind(g1, g2)
        sig = "***" if p < 0.001 else "**" if p < 0.01 else "*" if p < 0.05 else ""
        print(f"  {crop1} vs {crop2}: p={p:.4f} {sig}")

print("\n✓ Comparison analysis complete!")
print("Output saved to: output/comparisons/")
```

## Statistical Test Selection

### Choose the Right Test

| Comparison    | Test           | Use When                               |
| ------------- | -------------- | -------------------------------------- |
| **2 groups**  | t-test         | Exactly 2 groups, normally distributed |
| **2 groups**  | Mann-Whitney U | Non-normal, ordinal data               |
| **3+ groups** | ANOVA          | Multiple groups, normal distribution   |
| **3+ groups** | Kruskal-Wallis | Multiple groups, non-normal            |
| **Paired**    | Paired t-test  | Before/after, same subjects            |

### Assumptions

**T-test/ANOVA:**

- Data is normally distributed
- Equal variances (or use Welch's correction)
- Independent observations

**Mann-Whitney U:**

- Ordinal or continuous data
- Non-normal distributions
- Independent groups

## Best Practices

### Statistical Testing

- Check assumptions before choosing test
- Report effect size, not just p-value
- Use α = 0.05 unless specified
- Correct for multiple comparisons if needed

### Visualization

- Box plots for median/IQR
- Violin plots for distribution shape
- Strip plots for individual points
- Error bars for confidence intervals

### Interpretation

- Small p-value ≠ large effect
- Report confidence intervals
- Consider practical significance
- Check for outliers

## Resources

- [Scipy Statistics](https://docs.scipy.org/doc/scipy/reference/stats.html)
- [T-Test Guide](https://en.wikipedia.org/wiki/Student%27s_t-test)
- [ANOVA](https://en.wikipedia.org/wiki/Analysis_of_variance)
- [Mann-Whitney U](https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test)
