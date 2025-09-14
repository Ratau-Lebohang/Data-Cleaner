// Outlier detection utilities

function detectOutliers(data, column) {
  try {
    const values = data.map(row => parseFloat(row[column]))
      .filter(v => !isNaN(v));
    
    if (values.length === 0) return { outliers: [], method: 'none', statistics: {} };

    const iqrOutliers = detectIQROutliers(values);
    const zScoreOutliers = detectZScoreOutliers(values);
    
    return {
      iqr: iqrOutliers,
      zScore: zScoreOutliers,
      combined: [...new Set([...iqrOutliers.indices, ...zScoreOutliers.indices])],
      statistics: calculateColumnStats(values)
    };
  } catch (error) {
    console.error('Outlier detection error:', error);
    return { outliers: [], method: 'error', statistics: {} };
  }
}

function detectIQROutliers(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  const outliers = [];
  const indices = [];
  
  values.forEach((value, index) => {
    if (value < lowerBound || value > upperBound) {
      outliers.push(value);
      indices.push(index);
    }
  });

  return {
    outliers,
    indices,
    bounds: { lower: lowerBound, upper: upperBound },
    method: 'IQR'
  };
}

function detectZScoreOutliers(values, threshold = 3) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  const outliers = [];
  const indices = [];
  
  values.forEach((value, index) => {
    const zScore = Math.abs((value - mean) / stdDev);
    if (zScore > threshold) {
      outliers.push(value);
      indices.push(index);
    }
  });

  return {
    outliers,
    indices,
    threshold,
    statistics: { mean, stdDev },
    method: 'Z-Score'
  };
}

function calculateColumnStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const median = percentile(sorted, 50);
  
  return {
    count: values.length,
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    q1: percentile(sorted, 25),
    q3: percentile(sorted, 75)
  };
}

function percentile(sortedArray, p) {
  const index = (p / 100) * (sortedArray.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1];
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}