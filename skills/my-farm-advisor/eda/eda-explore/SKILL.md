---
name: eda-explore
description: Explore and summarize agricultural datasets using pandas. Generate descriptive statistics, identify data types, find missing values, and detect outliers.
version: 1.0.0
author: Boreal Bytes
tags: [eda, exploration, pandas, statistics, analysis]
---

# Skill: eda-explore

## Description

Explore and understand agricultural datasets using standard pandas operations. This skill teaches you how to generate comprehensive data summaries, identify data quality issues, and profile your data using real pandas code.

## When to Use This Skill

- **First look at data**: Get a quick overview of what's in your dataset
- **Data quality check**: Find missing values, duplicates, and outliers
- **Understanding distributions**: See means, medians, ranges for numeric columns
- **Data profiling**: Identify categorical vs numeric columns
- **Pre-analysis**: Before building models or creating visualizations

## Prerequisites

```bash
pip install pandas numpy
```

## Quick Start

```python
import pandas as pd
import numpy as np

# Load your data
df = pd.read_csv('data/soil_measurements.csv')

# Get comprehensive summary
print(df.describe())
print(f"\nShape: {df.shape}")
print(f"Missing values:\n{df.isnull().sum()}")
```

## Common Tasks

### Task 1: Generate Descriptive Statistics

**What**: Calculate summary statistics for all numeric columns.

**When to use**: To understand central tendencies and spread of data.

**Code**:

```python
import pandas as pd

# Load data
df = pd.read_csv('data/field_data.csv')

# Generate descriptive statistics
summary = df.describe()

# Save to CSV
summary.to_csv('output/summary_statistics.csv')

print("Summary Statistics:")
print(summary)

# Get specific statistics
print(f"\nDataset shape: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"Numeric columns: {len(df.select_dtypes(include=[np.number]).columns)}")
print(f"Categorical columns: {len(df.select_dtypes(include=['object']).columns)}")
```

### Task 2: Check Data Types and Missing Values

**What**: Identify column types and find missing data.

**When to use**: For data quality assessment and cleaning preparation.

**Code**:

```python
import pandas as pd

# Load data
df = pd.read_csv('data/weather_data.csv')

# Get data types
print("Data Types:")
print(df.dtypes)
print("\n" + "="*50 + "\n")

# Check for missing values
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)

missing_summary = pd.DataFrame({
    'missing_count': missing,
    'missing_percent': missing_pct
})

print("Missing Values:")
print(missing_summary[missing_summary['missing_count'] > 0])

# Check for duplicates
duplicates = df.duplicated().sum()
print(f"\nDuplicate rows: {duplicates}")

# Memory usage
print(f"\nMemory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
```

### Task 3: Identify Outliers Using IQR

**What**: Find potential outliers using the Interquartile Range method.

**When to use**: To detect unusual values that might be errors or interesting cases.

**Code**:

```python
import pandas as pd

def find_outliers_iqr(df, column):
    """Find outliers using IQR method"""
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1

    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    return outliers

# Load data
df = pd.read_csv('data/soil_data.csv')

# Check multiple columns for outliers
columns_to_check = ['ph_water', 'organic_matter', 'clay_content']

for col in columns_to_check:
    if col in df.columns:
        outliers = find_outliers_iqr(df, col)
        print(f"{col}: {len(outliers)} outliers")

        if len(outliers) > 0:
            print(f"  Range: {df[col].min():.2f} - {df[col].max():.2f}")
            print(f"  Outlier values: {outliers[col].tolist()[:5]}")
        print()
```

### Task 4: Profile Categorical Columns

**What**: Analyze categorical variables (unique values, frequencies).

**When to use**: To understand categorical distributions and imbalances.

**Code**:

```python
import pandas as pd

# Load data
df = pd.read_csv('data/crop_data.csv')

# Get categorical columns
categorical_cols = df.select_dtypes(include=['object']).columns

print("Categorical Column Profiles:")
print("="*60)

for col in categorical_cols:
    print(f"\n{col.upper()}:")
    print(f"  Unique values: {df[col].nunique()}")
    print(f"  Most common:")
    print(f"    {df[col].value_counts().head(3).to_string().replace(chr(10), chr(10) + '    ')}")
```

### Task 5: Create Comprehensive EDA Report

**What**: Generate a complete data profile report.

**When to use**: For documentation or sharing data quality insights.

**Code**:

```python
import pandas as pd
import numpy as np
from datetime import datetime

# Load data
df = pd.read_csv('data/agricultural_data.csv')

# Create report
report = []
report.append("="*60)
report.append("EXPLORATORY DATA ANALYSIS REPORT")
report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
report.append("="*60)
report.append("")

# Basic info
report.append(f"Dataset Shape: {df.shape[0]} rows × {df.shape[1]} columns")
report.append(f"Memory Usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
report.append("")

# Column breakdown
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
datetime_cols = df.select_dtypes(include=['datetime64']).columns.tolist()

report.append(f"Column Types:")
report.append(f"  Numeric: {len(numeric_cols)}")
report.append(f"  Categorical: {len(categorical_cols)}")
report.append(f"  Datetime: {len(datetime_cols)}")
report.append("")

# Missing values
total_missing = df.isnull().sum().sum()
report.append(f"Missing Values: {total_missing} total")
if total_missing > 0:
    cols_with_missing = df.isnull().sum()[df.isnull().sum() > 0]
    report.append("  Columns with missing data:")
    for col, count in cols_with_missing.items():
        report.append(f"    {col}: {count} ({count/len(df)*100:.1f}%)")
report.append("")

# Duplicates
duplicates = df.duplicated().sum()
report.append(f"Duplicate Rows: {duplicates}")
report.append("")

# Numeric summary
if numeric_cols:
    report.append("NUMERIC COLUMNS SUMMARY:")
    report.append("-" * 60)
    for col in numeric_cols[:5]:  # Show first 5
        stats = df[col].describe()
        report.append(f"\n{col}:")
        report.append(f"  Mean: {stats['mean']:.2f}")
        report.append(f"  Std: {stats['std']:.2f}")
        report.append(f"  Range: {stats['min']:.2f} - {stats['max']:.2f}")

# Save report
report_text = "\n".join(report)
with open('output/eda_report.txt', 'w') as f:
    f.write(report_text)

print(report_text)
print("\n✓ Report saved to: output/eda_report.txt")
```

## Complete Example

### Full Data Exploration Workflow

```python
import pandas as pd
import numpy as np
import os

# Ensure output directory exists
os.makedirs('output/exploration', exist_ok=True)

# Load data
print("Loading data...")
df = pd.read_csv('data/soil_measurements.csv')

# 1. Basic info
print(f"\nDataset loaded: {df.shape[0]} rows × {df.shape[1]} columns")

# 2. Save column list
with open('output/exploration/columns.txt', 'w') as f:
    f.write("Columns:\n")
    for i, col in enumerate(df.columns, 1):
        f.write(f"{i}. {col}\n")

# 3. Generate and save descriptive statistics
print("\nGenerating statistics...")
desc = df.describe()
desc.to_csv('output/exploration/descriptive_statistics.csv')

# 4. Check data types
df.dtypes.to_csv('output/exploration/data_types.csv', header=['dtype'])

# 5. Missing values analysis
missing = df.isnull().sum()
missing[missing > 0].to_csv('output/exploration/missing_values.csv', header=['count'])

# 6. Outlier detection (example for ph_water)
if 'ph_water' in df.columns:
    Q1 = df['ph_water'].quantile(0.25)
    Q3 = df['ph_water'].quantile(0.75)
    IQR = Q3 - Q1
    outliers = df[(df['ph_water'] < Q1 - 1.5*IQR) | (df['ph_water'] > Q3 + 1.5*IQR)]
    outliers.to_csv('output/exploration/ph_outliers.csv', index=False)
    print(f"Found {len(outliers)} pH outliers")

# 7. Categorical summaries
categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    df[col].value_counts().to_csv(f'output/exploration/{col}_distribution.csv')

print("\n✓ Exploration complete. Results saved to output/exploration/")
print(f"Files created: {len(os.listdir('output/exploration'))}")
```

## Key Methods Reference

### Essential Pandas Methods for EDA

| Method                  | Purpose            | Example                     |
| ----------------------- | ------------------ | --------------------------- |
| `df.head()`             | First n rows       | `df.head(10)`               |
| `df.describe()`         | Numeric statistics | `df.describe()`             |
| `df.info()`             | DataFrame info     | `df.info()`                 |
| `df.shape`              | Dimensions         | `rows, cols = df.shape`     |
| `df.dtypes`             | Column types       | `df.dtypes`                 |
| `df.isnull().sum()`     | Missing counts     | `df.isnull().sum()`         |
| `df.duplicated().sum()` | Duplicate rows     | `df.duplicated().sum()`     |
| `df.nunique()`          | Unique values      | `df.nunique()`              |
| `df.value_counts()`     | Value frequencies  | `df['crop'].value_counts()` |
| `df.corr()`             | Correlation matrix | `df.corr()`                 |
| `df.memory_usage()`     | Memory usage       | `df.memory_usage()`         |

## Best Practices

### Memory Management

- Use `df.memory_usage(deep=True)` to check memory
- Drop unnecessary columns: `df = df[['col1', 'col2']]`
- Convert types: `df['col'] = df['col'].astype('category')`

### Handling Large Datasets

- Sample first: `df_sample = df.sample(n=10000)`
- Use chunks: `pd.read_csv('file.csv', chunksize=10000)`
- Specify dtypes: `pd.read_csv('file.csv', dtype={'id': 'int32'})`

### Data Quality Checks

- Always check for missing values
- Verify data types match expectations
- Look for impossible values (negative acres, pH > 14)
- Check for inconsistent categories

## Common Issues

### Issue: Too much data to display

**Fix**: Use `.head()` or sample:

```python
print(df.head())  # First 5 rows
print(df.describe().T)  # Transposed for readability
```

### Issue: Scientific notation in output

**Fix**: Set display options:

```python
pd.set_option('display.float_format', '{:.2f}'.format)
```

### Issue: Dates not parsing

**Fix**: Specify date columns:

```python
df = pd.read_csv('file.csv', parse_dates=['date_col'])
```

### Issue: Mixed types warning

**Fix**: Force dtype on load:

```python
df = pd.read_csv('file.csv', dtype={'col': str})
```

## Resources

- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Pandas Cheat Sheet](https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf)
- [Exploratory Data Analysis Guide](https://en.wikipedia.org/wiki/Exploratory_data_analysis)
