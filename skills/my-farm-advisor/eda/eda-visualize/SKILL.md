---
name: eda-visualize
description: Create professional data visualizations using pandas, matplotlib, and seaborn. Generate histograms, scatter plots, box plots, bar charts, and heatmaps for agricultural data analysis.
version: 1.0.0
author: Boreal Bytes
tags: [visualization, plotting, matplotlib, seaborn, pandas]
---

# Skill: eda-visualize

## Description

Create professional data visualizations for agricultural datasets using standard Python libraries (pandas, matplotlib, seaborn). This skill provides copy-paste ready code examples for common visualization tasks - no custom wrappers, just real library code.

## When to Use This Skill

- **Exploring distributions**: Use histograms to see how values are spread
- **Finding relationships**: Use scatter plots to see correlations
- **Comparing groups**: Use box plots or bar charts to compare categories
- **Showing correlations**: Use heatmaps to visualize correlation matrices
- **Presenting results**: Create publication-ready charts for reports

## Prerequisites

```bash
pip install pandas matplotlib seaborn
```

## Quick Start

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load your data
df = pd.read_csv('data/soil_measurements.csv')

# Create a histogram
plt.figure(figsize=(10, 6))
sns.histplot(df['ph_water'], bins=20, kde=True)
plt.title('Soil pH Distribution')
plt.xlabel('pH Level')
plt.ylabel('Count')
plt.savefig('ph_distribution.png', dpi=300, bbox_inches='tight')
plt.close()
```

## Common Tasks

### Task 1: Create a Histogram

**What**: Show the distribution of a single numeric variable.

**When to use**: To see the shape of data, identify outliers, check for normality.

**Code**:

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data/soil_data.csv')

# Create histogram
plt.figure(figsize=(10, 6))
sns.histplot(data=df, x='ph_water', bins=20, kde=True, color='steelblue')
plt.title('Soil pH Distribution', fontsize=14, fontweight='bold')
plt.xlabel('pH Level', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.grid(axis='y', alpha=0.3)
plt.savefig('output/ph_distribution.png', dpi=300, bbox_inches='tight')
plt.close()

print("Created: output/ph_distribution.png")
```

### Task 2: Create a Scatter Plot

**What**: Show relationship between two numeric variables.

**When to use**: To find correlations, identify clusters, spot outliers.

**Code**:

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data/fields_with_soil.csv')

# Create scatter plot
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='ph_water', y='organic_matter',
                hue='region', alpha=0.7, s=100)
plt.title('Soil pH vs Organic Matter by Region', fontsize=14, fontweight='bold')
plt.xlabel('pH Level', fontsize=12)
plt.ylabel('Organic Matter (%)', fontsize=12)
plt.legend(title='Region', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.savefig('output/ph_vs_om.png', dpi=300, bbox_inches='tight')
plt.close()

print("Created: output/ph_vs_om.png")
```

### Task 3: Create a Box Plot

**What**: Compare distributions across categories.

**When to use**: To compare groups, identify outliers, see median and spread.

**Code**:

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data/field_data.csv')

# Create box plot
plt.figure(figsize=(12, 6))
sns.boxplot(data=df, x='region', y='field_size', palette='Set2')
plt.title('Field Size Distribution by Region', fontsize=14, fontweight='bold')
plt.xlabel('Region', fontsize=12)
plt.ylabel('Field Size (acres)', fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('output/size_by_region.png', dpi=300, bbox_inches='tight')
plt.close()

print("Created: output/size_by_region.png")
```

### Task 4: Create a Bar Chart

**What**: Show counts or values for categories.

**When to use**: To compare categorical data, show frequencies.

**Code**:

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data/crop_data.csv')

# Count crops and create bar chart
plt.figure(figsize=(10, 6))
crop_counts = df['crop_type'].value_counts()
sns.barplot(x=crop_counts.index, y=crop_counts.values, palette='viridis')
plt.title('Crop Type Distribution', fontsize=14, fontweight='bold')
plt.xlabel('Crop Type', fontsize=12)
plt.ylabel('Number of Fields', fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('output/crop_counts.png', dpi=300, bbox_inches='tight')
plt.close()

print("Created: output/crop_counts.png")
```

### Task 5: Create a Correlation Heatmap

**What**: Visualize correlations between multiple variables.

**When to use**: To find relationships, identify redundant variables.

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
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0,
            square=True, fmt='.2f', cbar_kws={"shrink": .8})
plt.title('Soil Properties Correlation Matrix', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('output/correlation_heatmap.png', dpi=300, bbox_inches='tight')
plt.close()

print("Created: output/correlation_heatmap.png")
```

## Complete Examples

### Example: Full EDA Visualization Suite

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Ensure output directory exists
os.makedirs('output/visualizations', exist_ok=True)

# Load data
df = pd.read_csv('data/agricultural_data.csv')

print(f"Dataset shape: {df.shape}")
print(f"\nCreating visualization suite...")

# 1. Histogram of field sizes
plt.figure(figsize=(10, 6))
sns.histplot(df['field_size'], bins=30, kde=True, color='steelblue')
plt.title('Field Size Distribution')
plt.xlabel('Size (acres)')
plt.ylabel('Count')
plt.savefig('output/visualizations/field_size_dist.png', dpi=300, bbox_inches='tight')
plt.close()

# 2. Scatter: pH vs Organic Matter
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='ph_water', y='organic_matter', alpha=0.6)
plt.title('pH vs Organic Matter')
plt.savefig('output/visualizations/ph_om_scatter.png', dpi=300, bbox_inches='tight')
plt.close()

# 3. Box plot by region
plt.figure(figsize=(12, 6))
sns.boxplot(data=df, x='region', y='yield')
plt.title('Yield by Region')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('output/visualizations/yield_by_region.png', dpi=300, bbox_inches='tight')
plt.close()

# 4. Correlation heatmap
numeric_cols = ['field_size', 'ph_water', 'organic_matter', 'yield']
plt.figure(figsize=(8, 6))
sns.heatmap(df[numeric_cols].corr(), annot=True, cmap='coolwarm', center=0)
plt.title('Variable Correlations')
plt.tight_layout()
plt.savefig('output/visualizations/correlation_heatmap.png', dpi=300, bbox_inches='tight')
plt.close()

print("✓ Created 4 visualizations in output/visualizations/")
```

## Best Practices

### Figure Size

- Use `figsize=(10, 6)` for standard plots
- Use `figsize=(12, 8)` for heatmaps or complex plots
- Use `plt.tight_layout()` to prevent label cutoff

### DPI and Quality

- Always use `dpi=300` for publication quality
- Use `bbox_inches='tight'` to include all elements

### Colors

- Use colorblind-friendly palettes: 'viridis', 'coolwarm', 'Set2'
- Avoid red-green combinations

### Saving

- Always close plots after saving: `plt.close()`
- Create output directories if they don't exist

## Common Issues

### Issue: Labels cut off

**Fix**: Add `plt.tight_layout()` before saving

### Issue: Too many points in scatter plot

**Fix**: Sample the data: `df.sample(n=1000)` or use `alpha=0.5`

### Issue: Overlapping x-axis labels

**Fix**: Rotate labels: `plt.xticks(rotation=45)`

### Issue: Figure too small

**Fix**: Increase figsize: `plt.figure(figsize=(12, 8))`
**Fix**: Increase figsize: `plt.figure(figsize=(12, 8))`

## Data Output Standards

### Save Your Visualization Scripts

Always save the Python script that generates your plots:

```python
# scripts/create_field_analysis_plots.py
"""Create visualization suite for field data.

Creates:
- data/plots/field_size_distribution.png
- data/plots/ph_vs_organic_matter.png
- data/plots/yield_by_region.png
- data/plots/correlation_heatmap.png
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Create directories
Path('data/plots').mkdir(parents=True, exist_ok=True)

# Load data
df = pd.read_csv('data/soil_measurements.csv')

# Plot 1: Field size distribution
plt.figure(figsize=(10, 6))
sns.histplot(df['area_acres'], bins=20, kde=True)
plt.title('Field Size Distribution')
plt.xlabel('Area (acres)')
plt.ylabel('Count')
plt.savefig('data/plots/field_size_distribution.png', dpi=300, bbox_inches='tight')
plt.close()

print("Created: data/plots/field_size_distribution.png")

# Plot 2: pH vs Organic Matter
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='ph_water', y='organic_matter', hue='region')
plt.title('pH vs Organic Matter by Region')
plt.savefig('data/plots/ph_vs_organic_matter.png', dpi=300, bbox_inches='tight')
plt.close()

print("Created: data/plots/ph_vs_organic_matter.png")

print("All plots saved to: data/plots/")
```

### Output Directory Structure

```
eda-visualize/
├── data/
│   ├── plots/                      # Generated visualizations
│   │   ├── field_size_distribution.png
│   │   ├── ph_vs_organic_matter.png
│   │   └── README.md             # Documents plots
│   └── README.md                 # Documents data
├── scripts/                        # Python scripts
│   └── create_field_analysis_plots.py
├── examples/                       # Committed samples
│   └── sample_plot.png
└── SKILL.md
```

### README Template for data/plots/

````markdown
# Visualization Outputs

Generated: 2024-01-15

## Files

| File                        | Script                         | Description              |
| --------------------------- | ------------------------------ | ------------------------ |
| field_size_distribution.png | create_field_analysis_plots.py | Histogram of field sizes |
| ph_vs_organic_matter.png    | create_field_analysis_plots.py | Scatter by region        |

## Regeneration

```bash
cd scripts
python create_field_analysis_plots.py
```
````

```
## Resources

- [Matplotlib Documentation](https://matplotlib.org/stable/contents.html)
- [Seaborn Documentation](https://seaborn.pydata.org/)
- [Pandas Visualization](https://pandas.pydata.org/docs/user_guide/visualization.html)
- [Data Visualization Best Practices](https://clauswilke.com/dataviz/)
```
