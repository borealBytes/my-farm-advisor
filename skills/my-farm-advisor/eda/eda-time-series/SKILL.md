# Skill: eda-time-series

## Description

This skill analyzes time-based agricultural data to identify trends, seasonality, and patterns over time. Create time series plots, calculate rolling averages, detect anomalies, and forecast future values. Perfect for understanding weather patterns, crop development cycles, and seasonal field conditions without time-series coding.

## Requirements

- Python 3.9+
- pandas
- matplotlib
- seaborn

## Installation

```bash
pip install pandas matplotlib seaborn
```

## Usage

### plot_time_series

Create time series plots for one or more variables.

```python
from skills.eda_time_series import EDATimeSeriesSkill

skill = EDATimeSeriesSkill()
skill.plot_time_series(
    data_path='data/weather.csv',
    date_column='date',
    value_columns=['temperature', 'precipitation'],
    output_path='data/viz/weather_trends.png',
    title='Weather Over Time'
)
```

Parameters:

- `data_path` (str): Path to CSV file with time-series data
- `date_column` (str): Column containing dates
- `value_columns` (list[str]): Columns to plot over time
- `output_path` (str): Path to save the chart
- `title` (str): Chart title

### calculate_rolling_average

Calculate moving averages to smooth trends.

```python
rolling_avg = skill.calculate_rolling_average(
    data_path='data/weather.csv',
    date_column='date',
    value_column='temperature',
    window=7,  # 7-day rolling average
    output_path='data/analysis/rolling_temp.csv'
)
```

Parameters:

- `data_path` (str): Path to CSV file
- `date_column` (str): Column containing dates
- `value_column` (str): Column to calculate rolling average for
- `window` (int): Number of periods for rolling window
- `output_path` (str): Path to save results

Returns:

- pandas.DataFrame: Original data with rolling average column added

### detect_anomalies

Identify unusual values or outliers in time series.

```python
anomalies = skill.detect_anomalies(
    data_path='data/weather.csv',
    date_column='date',
    value_column='temperature',
    method='iqr',  # Options: 'iqr', 'zscore', 'rolling'
    output_path='data/analysis/anomalies.csv'
)
```

Parameters:

- `data_path` (str): Path to CSV file
- `date_column` (str): Column containing dates
- `value_column` (str): Column to analyze
- `method` (str): Anomaly detection method
- `output_path` (str): Path to save results

Returns:

- pandas.DataFrame: Detected anomalies with dates and values

### compare_periods

Compare different time periods (e.g., years, seasons).

```python
comparison = skill.compare_periods(
    data_path='data/weather.csv',
    date_column='date',
    value_column='precipitation',
    period_column='year',  # Groups to compare
    output_path='data/analysis/yearly_comparison.csv'
)
```

Parameters:

- `data_path` (str): Path to CSV file
- `date_column` (str): Column containing dates
- `value_column` (str): Column to compare
- `period_column` (str): Column defining periods to compare
- `output_path` (str): Path to save results

Returns:

- dict: Statistics for each period

## Examples

### Example 1: Seasonal Temperature Trends

```python
from skills.eda_time_series import EDATimeSeriesSkill

skill = EDATimeSeriesSkill()

# Plot temperature over growing season
skill.plot_time_series(
    data_path='data/daily_weather_2023.csv',
    date_column='date',
    value_columns=['temperature', 'temperature_max', 'temperature_min'],
    output_path='data/viz/temperature_trends.png',
    title='Temperature Trends During Growing Season'
)

print("Created temperature trend visualization")
```

### Example 2: Rolling Averages

```python
from skills.eda_time_series import EDATimeSeriesSkill

skill = EDATimeSeriesSkill()

# Calculate 7-day and 30-day rolling averages
for window in [7, 30]:
    rolling = skill.calculate_rolling_average(
        data_path='data/daily_weather.csv',
        date_column='date',
        value_column='precipitation',
        window=window,
        output_path=f'data/analysis/rolling_{window}day_precip.csv'
    )
    print(f"Created {window}-day rolling average")

# Create plot with rolling averages
skill.plot_time_series(
    data_path='data/analysis/rolling_7day_precip.csv',
    date_column='date',
    value_columns=['precipitation', 'rolling_avg'],
    output_path='data/viz/precipitation_with_rolling.png',
    title='Precipitation with 7-Day Rolling Average'
)
```

### Example 3: Weather Anomaly Detection

```python
from skills.eda_time_series import EDATimeSeriesSkill

skill = EDATimeSeriesSkill()

# Find unusual weather events
anomalies = skill.detect_anomalies(
    data_path='data/hourly_weather.csv',
    date_column='timestamp',
    value_column='temperature',
    method='rolling',
    output_path='data/analysis/temp_anomalies.csv'
)

print(f"Found {len(anomalies)} temperature anomalies")

# Show extreme events
if len(anomalies) > 0:
    print("\nTop 3 Anomalies:")
    for _, row in anomalies.head(3).iterrows():
        print(f"  {row['timestamp']}: {row['temperature']:.1f}°F")
```

### Example 4: Year-over-Year Comparison

```python
from skills.eda_time_series import EDATimeSeriesSkill

skill = EDATimeSeriesSkill()

# Compare precipitation across years
comparison = skill.compare_periods(
    data_path='data/weather_2020_2024.csv',
    date_column='date',
    value_column='precipitation',
    period_column='year',
    output_path='data/analysis/yearly_precipitation.csv'
)

print("Year-over-Year Precipitation Comparison:")
for year, stats in comparison.items():
    print(f"\n{year}:")
    print(f"  Total: {stats['sum']:.1f} inches")
    print(f"  Average: {stats['mean']:.2f} inches/day")
    print(f"  Wettest Month: {stats['max_month']}")
```

### Example 5: Complete Time Series Analysis

```python
from skills.eda_time_series import EDATimeSeriesSkill

skill = EDATimeSeriesSkill()

# Full growing season analysis
data_path = 'data/growing_season_2023.csv'

# 1. Plot raw time series
skill.plot_time_series(
    data_path=data_path,
    date_column='date',
    value_columns=['temperature', 'precipitation', 'humidity'],
    output_path='data/viz/growing_season_overview.png',
    title='Growing Season Conditions 2023'
)

# 2. Calculate trends with rolling averages
skill.calculate_rolling_average(
    data_path=data_path,
    date_column='date',
    value_column='temperature',
    window=7,
    output_path='data/analysis/temp_rolling.csv'
)

# 3. Detect weather anomalies
anomalies = skill.detect_anomalies(
    data_path=data_path,
    date_column='date',
    value_column='precipitation',
    method='iqr',
    output_path='data/analysis/rainfall_anomalies.csv'
)

print(f"Analysis complete: {len(anomalies)} anomalies detected")
```

## Data Source

- **Input**: CSV with datetime column and numeric value columns
- **Output**: Time series plots, rolling averages, anomaly reports
- **Date Formats**: Automatically detects common formats (YYYY-MM-DD, MM/DD/YYYY, etc.)

## Output Files

- `*_trends.png` - Time series line charts
- `*_rolling.csv` - Rolling average calculations
- `*_anomalies.csv` - Detected anomalies with dates
- `*_comparison.csv` - Period comparison statistics

## Notes

- Automatically parses various date formats
- Handles irregular time intervals gracefully
- Missing dates are shown as gaps in plots
- Rolling averages help identify trends in noisy data
- Anomaly detection uses statistical methods (IQR, Z-score)
- All plots include proper date formatting on axes
- Suitable for daily, weekly, monthly, or hourly data

## Resources

- [Time Series Analysis](https://en.wikipedia.org/wiki/Time_series)
- [Rolling Averages](https://en.wikipedia.org/wiki/Moving_average)
- [Seasonal Decomposition](https://en.wikipedia.org/wiki/Decomposition_of_time_series)
- [Pandas Time Series](https://pandas.pydata.org/docs/user_guide/timeseries.html)
