// Advanced data cleaning functions

function handleDuplicateRows(data, method) {
  if (method === 'drop') {
    return removeDuplicates(data);
  } else if (method === 'keep_first') {
    const seen = new Set();
    return data.filter(row => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } else if (method === 'keep_last') {
    const seen = new Set();
    const reversed = [...data].reverse();
    const filtered = reversed.filter(row => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return filtered.reverse();
  }
  return data;
}

function normalizeTextFields(data, options) {
  return data.map(row => {
    const newRow = { ...row };
    Object.keys(newRow).forEach(column => {
      if (typeof newRow[column] === 'string') {
        let value = newRow[column];
        
        if (options.trimWhitespace) {
          value = value.trim();
        }
        
        if (options.standardizeCase === 'lower') {
          value = value.toLowerCase();
        } else if (options.standardizeCase === 'upper') {
          value = value.toUpperCase();
        } else if (options.standardizeCase === 'title') {
          value = value.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        }
        
        if (options.removeSpecialChars) {
          value = value.replace(/[^\w\s]/gi, '');
        }
        
        newRow[column] = value;
      }
    });
    return newRow;
  });
}

function handleMissingValuesAdvanced(data, options) {
  const result = {
    data: [...data],
    rowsRemoved: 0,
    valuesImputed: 0,
    operations: []
  };

  if (options.handleMissing === 'drop') {
    const beforeCount = result.data.length;
    result.data = result.data.filter(row => 
      Object.values(row).every(value => value !== '' && value !== null && value !== undefined)
    );
    result.rowsRemoved = beforeCount - result.data.length;
    result.operations.push(`Dropped ${result.rowsRemoved} rows with missing values`);
  } else {
    const columns = Object.keys(data[0] || {});
    
    columns.forEach(column => {
      const values = result.data.map(row => row[column])
        .filter(v => v !== '' && v !== null && v !== undefined);
      
      let fillValue;
      if (options.handleMissing === 'mean') {
        const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
        if (numericValues.length > 0) {
          fillValue = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
        }
      } else if (options.handleMissing === 'median') {
        const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v)).sort((a, b) => a - b);
        if (numericValues.length > 0) {
          fillValue = numericValues[Math.floor(numericValues.length / 2)];
        }
      } else if (options.handleMissing === 'mode') {
        const counts = {};
        values.forEach(v => counts[v] = (counts[v] || 0) + 1);
        fillValue = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      } else if (options.handleMissing === 'custom') {
        fillValue = options.customFillValue || '';
      }
      
      if (fillValue !== undefined) {
        let imputedCount = 0;
        result.data.forEach(row => {
          if (row[column] === '' || row[column] === null || row[column] === undefined) {
            row[column] = fillValue.toString();
            imputedCount++;
          }
        });
        if (imputedCount > 0) {
          result.valuesImputed += imputedCount;
          result.operations.push(`Imputed ${imputedCount} values in '${column}' with ${options.handleMissing}`);
        }
      }
    });
  }

  return result;
}

function standardizeFormats(data, options) {
  return data.map(row => {
    const newRow = { ...row };
    Object.keys(newRow).forEach(column => {
      const value = newRow[column];
      
      // Date standardization
      if (options.standardizeDates && isDateColumn(column, value)) {
        const standardizedDate = standardizeDate(value, options.dateFormat);
        if (standardizedDate) {
          newRow[column] = standardizedDate;
        }
      }
      
      // Number standardization
      if (options.standardizeNumbers && !isNaN(Number(value))) {
        newRow[column] = Number(value).toString();
      }
    });
    return newRow;
  });
}

function handleOutliersAdvanced(data, options) {
  const result = {
    data: [...data],
    rowsRemoved: 0,
    columnsAdded: 0,
    operations: []
  };

  const numericColumns = Object.keys(data[0] || {}).filter(col => {
    const values = data.map(row => row[col]).filter(v => v !== '' && v !== null);
    return values.length > 0 && values.every(v => !isNaN(Number(v)));
  });

  numericColumns.forEach(column => {
    const outlierInfo = detectOutliers(data, column);
    const outlierIndices = options.outlierMethod === 'iqr' ? 
      outlierInfo.iqr.indices : outlierInfo.zScore.indices;

    if (outlierIndices.length > 0) {
      if (options.handleOutliers === 'remove') {
        const beforeCount = result.data.length;
        result.data = result.data.filter((_, index) => !outlierIndices.includes(index));
        result.rowsRemoved += beforeCount - result.data.length;
        result.operations.push(`Removed ${outlierIndices.length} outliers from '${column}'`);
      } else if (options.handleOutliers === 'cap') {
        const bounds = options.outlierMethod === 'iqr' ? 
          outlierInfo.iqr.bounds : { lower: -3, upper: 3 };
        
        result.data.forEach((row, index) => {
          const value = Number(row[column]);
          if (!isNaN(value)) {
            if (value < bounds.lower) row[column] = bounds.lower.toString();
            if (value > bounds.upper) row[column] = bounds.upper.toString();
          }
        });
        result.operations.push(`Capped ${outlierIndices.length} outliers in '${column}'`);
      } else if (options.handleOutliers === 'mark') {
        const flagColumn = `${column}_outlier_flag`;
        result.data.forEach((row, index) => {
          row[flagColumn] = outlierIndices.includes(index) ? '1' : '0';
        });
        result.columnsAdded++;
        result.operations.push(`Added outlier flag column for '${column}'`);
      }
    }
  });

  return result;
}

function encodeCategoricalValues(data, method) {
  const result = {
    data: [...data],
    columnsAdded: 0
  };

  const categoricalColumns = Object.keys(data[0] || {}).filter(col => {
    const values = data.map(row => row[col]).filter(v => v !== '' && v !== null);
    const uniqueValues = new Set(values);
    return uniqueValues.size < values.length * 0.5 && uniqueValues.size > 1;
  });

  categoricalColumns.forEach(column => {
    const uniqueValues = [...new Set(data.map(row => row[column]))];
    
    if (method === 'label') {
      const mapping = {};
      uniqueValues.forEach((value, index) => {
        mapping[value] = index;
      });
      
      result.data.forEach(row => {
        row[column] = mapping[row[column]] !== undefined ? mapping[row[column]].toString() : row[column];
      });
    } else if (method === 'onehot') {
      uniqueValues.forEach(value => {
        const newColumn = `${column}_${value}`;
        result.data.forEach(row => {
          row[newColumn] = row[column] === value ? '1' : '0';
        });
        result.columnsAdded++;
      });
    }
  });

  return result;
}

function enforceDataSchema(data) {
  return data.map(row => {
    const newRow = { ...row };
    Object.keys(newRow).forEach(column => {
      const value = newRow[column];
      
      // Convert string numbers to actual numbers where appropriate
      if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
        newRow[column] = Number(value).toString();
      }
      
      // Ensure consistent null representation
      if (value === null || value === undefined || value === 'null' || value === 'undefined') {
        newRow[column] = '';
      }
    });
    return newRow;
  });
}

function isDateColumn(column, value) {
  const columnLower = column.toLowerCase();
  const dateKeywords = ['date', 'time', 'created', 'updated', 'birth', 'expire'];
  
  if (dateKeywords.some(keyword => columnLower.includes(keyword))) {
    return true;
  }
  
  // Check if value looks like a date
  if (typeof value === 'string' && value.match(/\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/)) {
    return true;
  }
  
  return false;
}

function standardizeDate(value, format) {
  if (!value || typeof value !== 'string') return value;
  
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}
