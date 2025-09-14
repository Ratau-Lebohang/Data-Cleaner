// Duplicate Detection Utilities
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
        duplicateType: analyzeDuplicateType(group.sample),
        severity: calculateDuplicateSeverity(group.indices.length, data.length)
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

function calculateDuplicateSeverity(duplicateCount, totalRows) {
  const percentage = (duplicateCount / totalRows) * 100;
  if (percentage > 5) return 'High';
  if (percentage > 1) return 'Medium';
  return 'Low';
}

function removeDuplicates(data, keepFirst = true) {
  const seen = new Set();
  const uniqueData = [];
  const removedIndices = [];
  
  data.forEach((row, index) => {
    const key = JSON.stringify(row);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueData.push(row);
    } else {
      removedIndices.push(index);
    }
  });
  
  return {
    cleanedData: uniqueData,
    removedIndices: removedIndices,
    duplicatesRemoved: removedIndices.length
  };
}