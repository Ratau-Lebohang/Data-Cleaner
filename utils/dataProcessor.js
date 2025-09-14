// Data profiling and processing utilities

async function generateEnhancedDataProfile(data) {
  try {
    const basicProfile = generateDataProfile(data);
    if (!basicProfile) return null;

    // Process large datasets in chunks
    const chunkSize = Math.min(5000, Math.max(1000, Math.floor(data.length / 10)));
    const numericColumns = basicProfile.columns.filter(col => col.type === 'number');
    
    const correlations = await processInChunks(data, numericColumns, calculateCorrelations, chunkSize);
    const outliers = {};
    
    // Process outlier detection asynchronously
    for (const col of numericColumns) {
      outliers[col.name] = await processOutliersAsync(data, col.name, chunkSize);
    }

    return {
      ...basicProfile,
      correlations,
      outliers,
      enhanced: true,
      processingInfo: {
        chunkSize,
        totalRows: data.length,
        processedAsynchronously: data.length > chunkSize
      }
    };
  } catch (error) {
    console.error('Enhanced data profiling error:', error);
    return generateDataProfile(data);
  }
}

async function processInChunks(data, numericColumns, processor, chunkSize) {
  if (data.length <= chunkSize) {
    return processor(data, numericColumns);
  }
  
  const results = {};
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const chunkResult = processor(chunk, numericColumns);
    
    // Merge results (simple merge for correlations)
    Object.assign(results, chunkResult);
    
    // Yield control to prevent blocking
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
}

async function processOutliersAsync(data, columnName, chunkSize) {
  if (data.length <= chunkSize) {
    return detectOutliers(data, columnName);
  }
  
  // For large datasets, sample for outlier detection
  const sampleSize = Math.min(chunkSize, data.length);
  const step = Math.floor(data.length / sampleSize);
  const sample = data.filter((_, index) => index % step === 0);
  
  await new Promise(resolve => setTimeout(resolve, 0));
  return detectOutliers(sample, columnName);
}

function generateDataProfile(data) {
  try {
    if (!data || data.length === 0) return null;

    const totalRows = data.length;
    const columns = Object.keys(data[0]);
    const totalColumns = columns.length;
    
    let totalMissingValues = 0;
    const duplicateRows = findDuplicates(data);
    const duplicateGroups = findDuplicateGroups(data);
    const issues = [];
    
    const columnAnalysis = columns.map(column => {
      const values = data.map(row => row[column]);
      const missingCount = values.filter(v => v === '' || v === null || v === undefined).length;
      const uniqueValues = new Set(values.filter(v => v !== '' && v !== null && v !== undefined));
      
      totalMissingValues += missingCount;
      
      const type = detectDataType(values);
      const issues = detectColumnIssues(values, column);
      
      return {
        name: column,
        type,
        missingCount,
        missingPercent: Math.round((missingCount / totalRows) * 100),
        uniqueCount: uniqueValues.size,
        sampleValues: Array.from(uniqueValues).slice(0, 5),
        issues
      };
    });

    // Identify issues
    if (duplicateRows.length > 0) {
      issues.push({
        type: 'Duplicate Rows',
        description: `Found ${duplicateRows.length} duplicate rows that may affect analysis`
      });
    }
    
    if (totalMissingValues > 0) {
      issues.push({
        type: 'Missing Values',
        description: `${totalMissingValues} missing values detected across ${columnAnalysis.filter(c => c.missingCount > 0).length} columns`
      });
    }

    // Calculate quality score
    const qualityScore = calculateQualityScore(totalRows, totalColumns, totalMissingValues, duplicateRows.length, columnAnalysis);
    
    return {
      summary: {
        totalRows,
        totalColumns,
        missingValues: totalMissingValues,
        duplicates: duplicateRows.length,
        qualityScore
      },
      columns: columnAnalysis,
      issues
    };
  } catch (error) {
    console.error('Data profiling error:', error);
    return null;
  }
}

async function processAdvancedDataCleaning(data, options) {
  try {
    const result = await processDataCleaningOptimized(data, options);
    
    // Add advanced transformations with memory optimization
    if (options.trimWhitespace) {
      result.cleanedData = await processTransformationChunked(result.cleanedData, (row) => {
        const trimmedRow = {};
        Object.keys(row).forEach(key => {
          trimmedRow[key] = typeof row[key] === 'string' ? row[key].trim() : row[key];
        });
        return trimmedRow;
      });
      result.log.operations.push('Trimmed whitespace from text fields');
    }

    if (options.standardizeCase) {
      result.cleanedData = await processTransformationChunked(result.cleanedData, (row) => {
        const standardizedRow = {};
        Object.keys(row).forEach(key => {
          if (typeof row[key] === 'string' && options.standardizeCase !== 'none') {
            standardizedRow[key] = options.standardizeCase === 'upper' ? 
              row[key].toUpperCase() : row[key].toLowerCase();
          } else {
            standardizedRow[key] = row[key];
          }
        });
        return standardizedRow;
      });
      result.log.operations.push(`Standardized case to ${options.standardizeCase}`);
    }

    return result;
  } catch (error) {
    console.error('Advanced data cleaning error:', error);
    return processDataCleaning(data, options);
  }
}

async function processTransformationChunked(data, transformer, chunkSize = 1000) {
  if (data.length <= chunkSize) {
    return data.map(transformer);
  }
  
  const result = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const transformedChunk = chunk.map(transformer);
    result.push(...transformedChunk);
    
    // Yield control to prevent blocking
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return result;
}

async function processDataCleaningOptimized(data, options) {
  try {
    let cleanedData = [...data];
    const log = createOptimizedLog(data.length);

    // Handle duplicates with memory optimization
    if (options.handleDuplicates === 'drop') {
      const beforeCount = cleanedData.length;
      cleanedData = await removeDuplicatesOptimized(cleanedData);
      const removed = beforeCount - cleanedData.length;
      log.rowsRemoved += removed;
      log.operations.push(`Removed ${removed} duplicate rows`);
    }

    // Handle missing values with chunked processing
    if (options.handleMissing !== 'keep') {
      const result = await handleMissingValuesOptimized(cleanedData, options.handleMissing);
      cleanedData = result.data;
      log.rowsRemoved += result.rowsRemoved;
      log.valuesImputed += result.valuesImputed;
      log.operations.push(...result.operations);
    }

    log.finalRows = cleanedData.length;
    return { cleanedData, log };
  } catch (error) {
    console.error('Optimized data cleaning error:', error);
    return { cleanedData: data, log: { error: error.message } };
  }
}

function createOptimizedLog(originalRows) {
  return {
    timestamp: new Date().toISOString(),
    originalRows,
    rowsRemoved: 0,
    valuesImputed: 0,
    operations: [],
    // Optimize memory by using object references instead of copying
    memoryOptimized: true
  };
}

async function removeDuplicatesOptimized(data, chunkSize = 2000) {
  if (data.length <= chunkSize) {
    return removeDuplicates(data);
  }
  
  const seen = new Set();
  const result = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    
    chunk.forEach(row => {
      const key = JSON.stringify(row);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(row);
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return result;
}

async function handleMissingValuesOptimized(data, method, chunkSize = 1500) {
  if (data.length <= chunkSize) {
    return handleMissingValues(data, method);
  }
  
  const result = { data: [], rowsRemoved: 0, valuesImputed: 0, operations: [] };
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const chunkResult = handleMissingValues(chunk, method);
    
    result.data.push(...chunkResult.data);
    result.rowsRemoved += chunkResult.rowsRemoved;
    result.valuesImputed += chunkResult.valuesImputed;
    
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  result.operations.push(`Processed ${data.length} rows in chunks for ${method} imputation`);
  return result;
}

function processDataCleaning(data, options) {
  try {
    let cleanedData = [...data];
    const log = {
      timestamp: new Date().toISOString(),
      originalRows: data.length,
      rowsRemoved: 0,
      valuesImputed: 0,
      columnsAdded: 0,
      operations: []
    };

    // 1. Handle duplicates
    if (options.handleDuplicates && options.handleDuplicates !== 'keep') {
      const beforeCount = cleanedData.length;
      cleanedData = handleDuplicateRows(cleanedData, options.handleDuplicates);
      const removed = beforeCount - cleanedData.length;
      log.rowsRemoved += removed;
      log.operations.push(`Handled duplicates: ${options.handleDuplicates} (${removed} rows affected)`);
    }

    // 2. Text normalization
    if (options.trimWhitespace || options.standardizeCase !== 'none' || options.removeSpecialChars) {
      cleanedData = normalizeTextFields(cleanedData, options);
      log.operations.push('Applied text normalization');
    }

    // 3. Handle missing values
    if (options.handleMissing !== 'keep') {
      const result = handleMissingValuesAdvanced(cleanedData, options);
      cleanedData = result.data;
      log.rowsRemoved += result.rowsRemoved;
      log.valuesImputed += result.valuesImputed;
      log.operations.push(...result.operations);
    }

    // 4. Format standardization
    if (options.standardizeDates || options.standardizeNumbers) {
      cleanedData = standardizeFormats(cleanedData, options);
      log.operations.push('Standardized data formats');
    }

    // 5. Outlier handling
    if (options.handleOutliers !== 'none') {
      const result = handleOutliersAdvanced(cleanedData, options);
      cleanedData = result.data;
      log.rowsRemoved += result.rowsRemoved;
      log.columnsAdded += result.columnsAdded;
      log.operations.push(...result.operations);
    }

    // 6. Categorical encoding
    if (options.encodeCategories) {
      const result = encodeCategoricalValues(cleanedData, options.encodingMethod);
      cleanedData = result.data;
      log.columnsAdded += result.columnsAdded;
      log.operations.push(`Applied ${options.encodingMethod} encoding`);
    }

    // 7. Schema enforcement
    if (options.enforceSchema) {
      cleanedData = enforceDataSchema(cleanedData);
      log.operations.push('Enforced schema consistency');
    }

    log.finalRows = cleanedData.length;
    return { cleanedData, log };
  } catch (error) {
    console.error('Data cleaning error:', error);
    return { cleanedData: data, log: { error: error.message } };
  }
}

function detectBias(data, column) {
  try {
    const values = data.map(row => row[column]).filter(v => v !== '' && v !== null && v !== undefined);
    const valueCounts = {};
    
    values.forEach(value => {
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    const total = values.length;
    const distribution = Object.entries(valueCounts)
      .map(([value, count]) => ({
        value,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate bias score and fairness metrics
    const maxPercentage = Math.max(...distribution.map(d => d.percentage));
    const minPercentage = Math.min(...distribution.map(d => d.percentage));
    const biasScore = maxPercentage / 100;
    
    const fairnessMetrics = calculateFairnessMetrics(distribution, total);
    const recommendations = generateBiasRecommendations(biasScore, fairnessMetrics, distribution);

    return {
      column,
      analysis: {
        biasScore,
        distribution: distribution.slice(0, 10),
        totalValues: total,
        uniqueValues: distribution.length,
        fairnessMetrics
      },
      recommendations
    };
  } catch (error) {
    console.error('Bias detection error:', error);
    return null;
  }
}

function calculateFairnessMetrics(distribution, total) {
  const equalShare = 100 / distribution.length;
  let giniCoeff = 0;
  let demographicParity = 0;
  
  // Calculate Gini coefficient for inequality measurement
  distribution.forEach((item, i) => {
    distribution.forEach((otherItem, j) => {
      giniCoeff += Math.abs(item.percentage - otherItem.percentage);
    });
  });
  giniCoeff = giniCoeff / (2 * distribution.length * distribution.length * (total / distribution.length));
  
  // Calculate demographic parity (deviation from equal representation)
  demographicParity = distribution.reduce((sum, item) => {
    return sum + Math.abs(item.percentage - equalShare);
  }, 0) / distribution.length;
  
  return {
    giniCoefficient: Math.round(giniCoeff * 100) / 100,
    demographicParity: Math.round(demographicParity * 100) / 100,
    equalShare: Math.round(equalShare * 100) / 100,
    imbalanceRatio: Math.round((Math.max(...distribution.map(d => d.percentage)) / 
                               Math.min(...distribution.map(d => d.percentage))) * 100) / 100
  };
}

function generateBiasRecommendations(biasScore, fairnessMetrics, distribution) {
  const recommendations = [];
  
  if (biasScore > 0.7 || fairnessMetrics.giniCoefficient > 0.5) {
    recommendations.push('High bias detected - Implement stratified sampling to balance groups');
    recommendations.push('Apply SMOTE (Synthetic Minority Oversampling) for underrepresented categories');
    recommendations.push('Use fairness-aware machine learning algorithms');
    recommendations.push('Consider collecting more data for minority groups');
  } else if (biasScore > 0.4 || fairnessMetrics.demographicParity > 20) {
    recommendations.push('Moderate bias detected - Monitor model performance across groups');
    recommendations.push('Implement bias detection in model evaluation pipeline');
    recommendations.push('Consider weighted sampling during model training');
  } else {
    recommendations.push('Distribution appears relatively balanced');
    recommendations.push('Continue monitoring for bias in model predictions');
  }
  
  // Specific actionable recommendations
  const minGroup = distribution[distribution.length - 1];
  const maxGroup = distribution[0];
  
  if (fairnessMetrics.imbalanceRatio > 3) {
    recommendations.push(`Consider increasing "${minGroup.value}" representation by ${maxGroup.count - minGroup.count} samples`);
    recommendations.push(`Apply class weights: majority group (${maxGroup.value}) weight: 0.5, minority group (${minGroup.value}) weight: 2.0`);
  }
  
  return recommendations;
}

function calculateCorrelations(data, numericColumns) {
  try {
    const correlations = {};
    
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i].name;
        const col2 = numericColumns[j].name;
        
        const values1 = data.map(row => parseFloat(row[col1])).filter(v => !isNaN(v));
        const values2 = data.map(row => parseFloat(row[col2])).filter(v => !isNaN(v));
        
        if (values1.length > 0 && values2.length > 0) {
          const correlation = pearsonCorrelation(values1, values2);
          correlations[`${col1}_${col2}`] = Math.round(correlation * 100) / 100;
        }
      }
    }
    
    return correlations;
  } catch (error) {
    console.error('Correlation calculation error:', error);
    return {};
  }
}

function pearsonCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  
  const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
  const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
  const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

function detectColumnIssues(values, columnName) {
  const nonEmptyValues = values.filter(v => v !== '' && v !== null && v !== undefined);
  if (nonEmptyValues.length === 0) return null;
  
  const issues = [];
  
  // Check for inconsistent data types
  const types = nonEmptyValues.map(v => {
    if (!isNaN(Number(v))) return 'number';
    if (!isNaN(Date.parse(v))) return 'date';
    return 'text';
  });
  
  const typeSet = new Set(types);
  if (typeSet.size > 1) {
    issues.push('Mixed data types');
  }
  
  // Check for potential encoding issues
  const encodingIssues = nonEmptyValues.filter(v => 
    typeof v === 'string' && (v.includes('�') || /[^\x00-\x7F]/.test(v))
  );
  if (encodingIssues.length > 0) {
    issues.push('Encoding issues');
  }
  
  // Check for suspicious patterns
  const suspiciousValues = nonEmptyValues.filter(v => 
    typeof v === 'string' && (
      v.toLowerCase() === 'null' || 
      v.toLowerCase() === 'undefined' ||
      v === 'N/A' ||
      v === '#N/A'
    )
  );
  if (suspiciousValues.length > 0) {
    issues.push('Contains null-like strings');
  }
  
  return issues.length > 0 ? issues.join(', ') : null;
}

function calculateQualityScore(totalRows, totalColumns, missingValues, duplicates, columns) {
  let score = 100;
  
  // Deduct for missing values (up to 30 points)
  const missingRatio = missingValues / (totalRows * totalColumns);
  score -= Math.min(30, missingRatio * 100);
  
  // Deduct for duplicates (up to 20 points)
  const duplicateRatio = duplicates / totalRows;
  score -= Math.min(20, duplicateRatio * 50);
  
  // Deduct for columns with issues (up to 25 points)
  const columnsWithIssues = columns.filter(col => col.issues).length;
  const issueRatio = columnsWithIssues / totalColumns;
  score -= Math.min(25, issueRatio * 100);
  
  // Deduct for highly sparse columns (up to 15 points)
  const sparseColumns = columns.filter(col => col.missingPercent > 50).length;
  const sparseRatio = sparseColumns / totalColumns;
  score -= Math.min(15, sparseRatio * 30);
  
  return Math.max(0, Math.round(score));
}
