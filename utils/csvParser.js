// CSV parsing and utility functions

function parseCSV(text) {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) throw new Error('Empty CSV file');

    const headers = parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }

    return data;
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw error;
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

function arrayToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvLines = [headers.join(',')];

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      return value.toString().includes(',') ? `"${value}"` : value;
    });
    csvLines.push(values.join(','));
  });

  return csvLines.join('\n');
}

function findDuplicates(data) {
  const seen = new Map();
  const duplicateIndices = [];

  data.forEach((row, index) => {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicateIndices.push(index);
      // Also mark the first occurrence if not already marked
      const firstIndex = seen.get(key);
      if (!duplicateIndices.includes(firstIndex)) {
        duplicateIndices.push(firstIndex);
      }
    } else {
      seen.set(key, index);
    }
  });

  return duplicateIndices;
}

function findDuplicateGroups(data) {
  const duplicateGroups = [];
  const seen = new Map();
  
  data.forEach((row, index) => {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      seen.get(key).indices.push(index + 1);
    } else {
      seen.set(key, { indices: [index + 1], sample: row, hash: key });
    }
  });
  
  seen.forEach((group) => {
    if (group.indices.length > 1) {
      duplicateGroups.push({
        indices: group.indices,
        sample: group.sample,
        count: group.indices.length,
        duplicateType: analyzeDuplicateType(group.sample)
      });
    }
  });
  
  return duplicateGroups.sort((a, b) => b.count - a.count);
}

function analyzeDuplicateType(row) {
  const values = Object.values(row);
  const hasEmptyValues = values.some(v => !v || v.trim() === '');
  const hasIds = Object.keys(row).some(key => 
    key.toLowerCase().includes('id') || key.toLowerCase().includes('key')
  );
  
  if (hasEmptyValues) return 'Incomplete Data';
  if (hasIds) return 'System Duplicate';
  return 'Exact Match';
}

function removeDuplicates(data) {
  const seen = new Set();
  return data.filter(row => {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      return false;
    } else {
      seen.add(key);
      return true;
    }
  });
}

function detectDataType(values) {
  const nonEmptyValues = values.filter(v => v !== '' && v !== null && v !== undefined);
  if (nonEmptyValues.length === 0) return 'text';

  const numericCount = nonEmptyValues.filter(v => !isNaN(Number(v))).length;
  const dateCount = nonEmptyValues.filter(v => !isNaN(Date.parse(v))).length;

  if (numericCount / nonEmptyValues.length > 0.8) return 'number';
  if (dateCount / nonEmptyValues.length > 0.8) return 'date';
  return 'text';
}

function handleMissingValues(data, method) {
  const result = {
    data: [...data],
    rowsRemoved: 0,
    valuesImputed: 0,
    operations: []
  };

  if (method === 'drop') {
    const beforeCount = result.data.length;
    result.data = result.data.filter(row => 
      Object.values(row).every(value => value !== '' && value !== null && value !== undefined)
    );
    result.rowsRemoved = beforeCount - result.data.length;
    result.operations.push(`Dropped ${result.rowsRemoved} rows with missing values`);
  } else if (method === 'median' || method === 'mean') {
    const columns = Object.keys(data[0] || {});
    
    columns.forEach(column => {
      const values = result.data.map(row => row[column])
        .filter(v => v !== '' && v !== null && v !== undefined && !isNaN(Number(v)))
        .map(v => Number(v));
      
      if (values.length > 0) {
        let fillValue;
        if (method === 'median') {
          values.sort((a, b) => a - b);
          fillValue = values[Math.floor(values.length / 2)];
        } else {
          fillValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        }
        
        let imputedCount = 0;
        result.data.forEach(row => {
          if ((row[column] === '' || row[column] === null || row[column] === undefined) && 
              !isNaN(Number(fillValue))) {
            row[column] = fillValue.toString();
            imputedCount++;
          }
        });
        
        if (imputedCount > 0) {
          result.valuesImputed += imputedCount;
          result.operations.push(`Imputed ${imputedCount} values in column '${column}' with ${method}`);
        }
      }
    });
  }

  return result;
}