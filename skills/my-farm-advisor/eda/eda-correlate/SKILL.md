---
name: eda-correlate
description: Analyze correlations between variables in agricultural datasets using pandas and scipy. Calculate correlation coefficients, identify significant relationships, and create correlation matrices with heatmaps.
version: 1.0.0
author: Boreal Bytes
tags: [correlation, statistics, pandas, scipy, analysis]
---

# Skill: eda-correlate

## Description

Analyze correlations between variables in agricultural datasets using standard pandas and scipy. Calculate correlation coefficients, identify significant relationships, and create correlation matrices with heatmaps using real library code.

## When to Use This Skill

- **Finding relationships**: Discover which variables are related
- **Feature selection**: Identify redundant variables for modeling
- **Hypothesis testing**: Validate expected correlations
- **Data understanding**: Learn which factors move together
- **Reporting**: Create correlation matrices for publications

## Prerequisites

```bash
pip install pandas numpy matplotlib seaborn scipy
```

## Quick Start

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load your data
df = pd.read_csv('data/soil_measurements.csv')

# Calculate correlation matrix for numeric columns
numeric_cols = ['ph_water', 'organic_matter', 'clay', 'sand']
corr_matrix = df[numeric_cols].corr()

print(corr_matrix)

# Create heatmap
plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Soil Properties Correlation Matrix')
plt.savefig('correlation_heatmap.png', dpi=300)
plt.close()
```

## Common Tasks

### Task 1: Calculate Correlation Matrix

**What**: Compute pairwise correlations between all numeric columns.

**When to use**: To see all relationships at once, create a correlation table.

**Code**:

```python
import pandas as pd

# Load data
df = pd.read_csv('data/soil_data.csv')

# Select numeric columns
numeric_cols = df.select_dtypes(include=[np.number]).columns

# Calculate correlation matrix
corr_matrix = df[numeric_cols].corr()

# Save to CSV
corr_matrix.to_csv('output/correlation_matrix.csv')

print("Correlation Matrix:")
print(corr_matrix.round(3))
```

### Task 2: Find Strongest Correlations

**What**: Identify the strongest relationships in your data.

**When to use**: To focus on the most important variable relationships.

**Code**:

```python
import pandas as pd
import numpy as np

# Load data
df = pd.read_csv('data/soil_data.csv')

# Calculate correlation matrix
numeric_cols = df.select_dtypes(include=[np.number]).columns
corr_matrix = df[numeric_cols].corr()

# Find strongest correlations (exclude self-correlations)
# Stack and reset to get pairs
corr_pairs = corr_matrix.stack().reset_index()
corr_pairs.columns = ['var1', 'var2', 'correlation']

# Remove self-correlations and duplicates
corr_pairs = corr_pairs[corr_pairs['var1'] != corr_pairs['var2']]
corr_pairs = corr_pairs[corr_pairs['var1'] < corr_pairs['var2']]

# Sort by absolute correlation
corr_pairs['abs_corr'] = corr_pairs['correlation'].abs()
corr_pairs = corr_pairs.sort_values('abs_corr', ascending=False)

print("Top 5 Strongest Correlations:")
print(corr_pairs.head(5)[['var1', 'var2', 'correlation']].to_string(index=False))
```

### Task 3: Test Statistical Significance

**What**: Determine if correlations are statistically significant.

**When to use**: To avoid false positives, ensure relationships are real.

**Code**:

```python
import pandas as pd
from scipy.stats import pearsonr

# Load data
df = pd.read_csv('data/soil_data.csv')

# Test correlation between two variables
var1 = 'ph_water'
var2 = 'organic_matter'

# Remove missing values
valid_data = df[[var1, var2]].dropna()

# Calculate correlation and p-value
corr, p_value = pearsonr(valid_data[var1], valid_data[var2])

print(f"Correlation between {var1} and {var2}:")
print(f"  Coefficient: {corr:.3f}")
print(f"  P-value: {p_value:.4f}")

# Interpret significance
alpha = 0.05
if p_value < alpha:
    print(f"  ✓ Significant (p < {alpha})")
else:
    print(f"  ✗ Not significant (p >= {alpha})")

# Interpret strength
if abs(corr) >= 0.7:
    strength = "Strong"
elif abs(corr) >= 0.3:
    strength = "Moderate"
else:
    strength = "Weak"

direction = "positive" if corr > 0 else "negative"
print(f"  Strength: {strength} {direction}")
```

### Task 4: Create Correlation Heatmap

**What**: Visualize correlations as a color-coded matrix.

**When to use**: For presentations, reports, quick visual assessment.

**Code**:

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data/soil_data.csv')

# Select numeric columns
numeric_cols = ['ph_water', 'organic_matter', 'clay', 'sand', 'silt']

# Calculate correlation matrix
corr_matrix = df[numeric_cols].corr()

# Create heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(
    corr_matrix,
    annot=True,              # Show correlation values
    fmt='.2f',              # Format to 2 decimals
    cmap='coolwarm',        # Color scheme
    center=0,               # Center colormap at 0
    square=True,            # Square cells
    linewidths=0.5,         # Grid lines
    cbar_kws={"shrink": 0.8}  # Colorbar size
)

plt.title('Soil Properties Correlation Matrix', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('output/correlation_heatmap.png', dpi=300, bbox_inches='tight')
plt.close()

print("Saved: output/correlation_heatmap.png")
```

### Task 5: Compare Correlation Methods

**What**: Compare Pearson, Spearman, and Kendall correlations.

**When to use**: When relationships might be non-linear or ranked.

**Code**:

```python
import pandas as pd
from scipy.stats import pearsonr, spearmanr, kendalltau

# Load data
df = pd.read_csv('data/soil_data.csv')

var1 = 'ph_water'
var2 = 'organic_matter'

# Remove missing values
valid_data = df[[var1, var2]].dropna()
x = valid_data[var1]
y = valid_data[var2]

# Calculate different correlation methods
pearson_corr, pearson_p = pearsonr(x, y)
spearman_corr, spearman_p = spearmanr(x, y)
kendall_corr, kendall_p = kendalltau(x, y)

print(f"Correlations between {var1} and {var2}:")
print(f"  Pearson (linear):     {pearson_corr:.3f} (p={pearson_p:.4f})")
print(f"  Spearman (rank):      {spearman_corr:.3f} (p={spearman_p:.4f})")
print(f"  Kendall (concordance): {kendall_corr:.3f} (p={kendall_p:.4f})")

# When to use which:
# - Pearson: Linear relationships, normally distributed
# - Spearman: Monotonic relationships, ranked data, outliers present
# - Kendall: Ordinal data, small samples, many tied ranks
```

## Complete Example

### Full Correlation Analysis Workflow

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import pearsonr
import os

# Ensure output directory exists
os.makedirs('output/correlations', exist_ok=True)

# Load data
print("Loading data...")
df = pd.read_csv('data/agricultural_data.csv')

# Select numeric columns
numeric_cols = ['field_size', 'ph_water', 'organic_matter', 'clay', 'sand', 'yield']
print(f"Analyzing {len(numeric_cols)} variables: {', '.join(numeric_cols)}")

# 1. Calculate full correlation matrix
print("\n1. Calculating correlation matrix...")
corr_matrix = df[numeric_cols].corr()
corr_matrix.to_csv('output/correlations/correlation_matrix.csv')
print("Saved: correlation_matrix.csv")

# 2. Find strongest correlations
print("\n2. Finding strongest correlations...")
# Get upper triangle (avoid duplicates)
mask = np.triu(np.ones_like(corr_matrix, dtype=bool), k=1)
correlations = corr_matrix.where(mask).stack().reset_index()
correlations.columns = ['var1', 'var2', 'correlation']
correlations = correlations.sort_values('correlation', key=abs, ascending=False)

correlations.to_csv('output/correlations/strongest_correlations.csv', index=False)
print("Top 5 correlations:")
for idx, row in correlations.head(5).iterrows():
    print(f"  {row['var1']} ↔ {row['var2']}: {row['correlation']:.3f}")

# 3. Create heatmap
print("\n3. Creating heatmap...")
plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0, square=True)
plt.title('Agricultural Data Correlations')
plt.tight_layout()
plt.savefig('output/correlations/correlation_heatmap.png', dpi=300)
plt.close()
print("Saved: correlation_heatmap.png")

# 4. Test significance of top correlation
print("\n4. Testing statistical significance...")
top_corr = correlations.iloc[0]
var1, var2 = top_corr['var1'], top_corr['var2']

valid_data = df[[var1, var2]].dropna()
corr, p_value = pearsonr(valid_data[var1], valid_data[var2])

print(f"Top correlation: {var1} ↔ {var2}")
print(f"  r = {corr:.3f}")
print(f"  p = {p_value:.4f}")
print(f"  {'Significant' if p_value < 0.05 else 'Not significant'} (α = 0.05)")

# 5. Create scatter plot of top correlation
print("\n5. Creating scatter plot...")
plt.figure(figsize=(10, 6))
plt.scatter(df[var1], df[var2], alpha=0.6)
plt.xlabel(var1)
plt.ylabel(var2)
plt.title(f'{var1} vs {var2}\nr = {corr:.3f}, p = {p_value:.4f}')

# Add trend line
z = np.polyfit(df[var1].dropna(), df[var2].dropna(), 1)
p = np.poly1d(z)
plt.plot(df[var1], p(df[var1]), "r--", alpha=0.8)

plt.savefig(f'output/correlations/{var1}_vs_{var2}.png', dpi=300)
plt.close()
print(f"Saved: {var1}_vs_{var2}.png")

print("\n✓ Correlation analysis complete!")
```

## Correlation Interpretation Guide

### Strength Guidelines

| Absolute Value | Strength    | Interpretation              |
| -------------- | ----------- | --------------------------- |
| 0.00 - 0.19    | Very weak   | Little to no relationship   |
| 0.20 - 0.39    | Weak        | Small relationship          |
| 0.40 - 0.59    | Moderate    | Clear relationship          |
| 0.60 - 0.79    | Strong      | Major relationship          |
| 0.80 - 1.00    | Very strong | Nearly perfect relationship |

### Statistical Significance

- **p < 0.05**: Statistically significant (95% confidence)
- **p < 0.01**: Highly significant (99% confidence)
- **p ≥ 0.05**: Not statistically significant

**Note**: Large correlations can be significant even with small p-values. Always check both effect size (correlation) and significance (p-value).

### Correlation vs Causation

**Remember**: Correlation ≠ Causation

- Correlation shows variables move together
- Does NOT prove one causes the other
- May be due to: direct causation, reverse causation, confounding variable, or coincidence

### Which Correlation Method?

| Method       | Use When                 | Assumptions                                  |
| ------------ | ------------------------ | -------------------------------------------- |
| **Pearson**  | Linear relationships     | Normal distribution, no outliers             |
| **Spearman** | Monotonic, ranked data   | Ordinal data, non-linear, robust to outliers |
| **Kendall**  | Small samples, many ties | Ordinal data, preferred for small n          |

## Best Practices

### Data Preparation

- Remove missing values before calculating correlations
- Check for outliers (can skew Pearson correlations)
- Ensure numeric data types
- Consider log transformation for skewed data

### Visualization

- Always center heatmap at 0 (coolwarm colormap)
- Annotate with correlation values
- Square cells for clarity
- Include statistical significance indicators

### Interpretation

- Report both correlation and p-value
- Consider effect size, not just significance
- Look for patterns in correlation matrices
- Verify unexpected correlations make sense

### Common Issues

#### Issue: Perfect correlations (1.0 or -1.0)

**Cause**: Duplicate or derived variables
**Fix**: Remove redundant columns

#### Issue: Very weak correlations

**Consider**: May still be significant with large n
**Don't**: Dismiss small effects without context

#### Issue: Missing values causing errors

**Fix**: Use `.dropna()` before correlation

```python
corr = df[['col1', 'col2']].dropna().corr()
```

## Resources

- [Pandas Correlation](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.corr.html)
- [Scipy Pearson](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.pearsonr.html)
- [Correlation Coefficient Guide](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient)
- [Interpreting Correlations](https://www.statisticssolutions.com/correlation-pearson-kendall-spearman/)
