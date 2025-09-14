// Data validation and type conversion utilities

function validateAndConvertDataTypes(data) {
  try {
    if (!data || data.length === 0) return { data, log: [] };
    
    const log = [];
    const convertedData = data.map(row => {
      const newRow = { ...row };
      
      Object.keys(newRow).forEach(column => {
        const originalValue = newRow[column];
        const convertedValue = attemptTypeConversion(originalValue, column);
        
        if (convertedValue !== originalValue) {
          newRow[column] = convertedValue;
        }
      });
      
      return newRow;
    });
    
    return { data: convertedData, log };
  } catch (error) {
    console.error('Data type validation error:', error);
    return { data, log: ['Error during type conversion'] };
  }
}

function attemptTypeConversion(value, column) {
  if (!value || value === '') return value;
  
  // Try number conversion
  if (typeof value === 'string') {
    // Clean the string first
    const cleaned = value.trim();
    
    // Check if it's a number
    if (/^-?\d*\.?\d+$/.test(cleaned)) {
      const num = parseFloat(cleaned);
      if (!isNaN(num)) return num;
    }
    
    // Check if it's a date
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/,           // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/,         // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/,           // MM-DD-YYYY
    ];
    
    if (dateFormats.some(format => format.test(cleaned))) {
      const date = new Date(cleaned);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // Return as YYYY-MM-DD
      }
    }
  }
  
  return value;
}

function detectInvalidData(data) {
  try {
    const invalidEntries = [];
    
    data.forEach((row, rowIndex) => {
      Object.entries(row).forEach(([column, value]) => {
        if (isInvalidValue(value, column)) {
          invalidEntries.push({
            row: rowIndex + 1,
            column,
            value,
            reason: getInvalidReason(value, column)
          });
        }
      });
    });
    
    return invalidEntries;
  } catch (error) {
    console.error('Invalid data detection error:', error);
    return [];
  }
}

function isInvalidValue(value, column) {
  if (!value || value === '') return false;
  
  const columnLower = column.toLowerCase();
  
  // Age validation
  if (columnLower.includes('age')) {
    const num = parseFloat(value);
    return !isNaN(num) && (num < 0 || num > 150);
  }
  
  // Date validation
  if (columnLower.includes('date') || columnLower.includes('time')) {
    const date = new Date(value);
    return isNaN(date.getTime());
  }
  
  // Email validation
  if (columnLower.includes('email')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value);
  }
  
  return false;
}

function getInvalidReason(value, column) {
  const columnLower = column.toLowerCase();
  
  if (columnLower.includes('age')) {
    return 'Invalid age (negative or > 150)';
  }
  
  if (columnLower.includes('date') || columnLower.includes('time')) {
    return 'Invalid date format';
  }
  
  if (columnLower.includes('email')) {
    return 'Invalid email format';
  }
  
  return 'Invalid value detected';
}

function standardizeText(data, options = {}) {
  try {
    const {
      trimWhitespace = true,
      standardizeCase = 'none',
      removeSpecialChars = false
    } = options;
    
    const processedData = data.map(row => {
      const newRow = { ...row };
      
      Object.keys(newRow).forEach(column => {
        let value = newRow[column];
        
        if (typeof value === 'string') {
          if (trimWhitespace) {
            value = value.trim();
          }
          
          if (standardizeCase === 'upper') {
            value = value.toUpperCase();
          } else if (standardizeCase === 'lower') {
            value = value.toLowerCase();
          }
          
          if (removeSpecialChars) {
            value = value.replace(/[^\w\s]/gi, '');
          }
          
          newRow[column] = value;
        }
      });
      
      return newRow;
    });
    
    return processedData;
  } catch (error) {
    console.error('Text standardization error:', error);
    return data;
  }
}

function normalizeNumericalData(data, columns, method = 'minmax') {
  try {
    const normalizedData = [...data];
    const stats = {};
    
    // Calculate statistics for each column
    columns.forEach(column => {
      const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
      
      if (values.length > 0) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        stats[column] = { min, max, mean, stdDev };
      }
    });
    
    // Apply normalization
    normalizedData.forEach(row => {
      columns.forEach(column => {
        const value = parseFloat(row[column]);
        if (!isNaN(value) && stats[column]) {
          const { min, max, mean, stdDev } = stats[column];
          
          if (method === 'minmax') {
            row[column] = max > min ? (value - min) / (max - min) : 0;
          } else if (method === 'zscore') {
            row[column] = stdDev > 0 ? (value - mean) / stdDev : 0;
          }
        }
      });
    });
    
    return normalizedData;
  } catch (error) {
    console.error('Data normalization error:', error);
    return data;
  }
}