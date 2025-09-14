function DataProfile({ data, fileName, rawData }) {
  try {
    const [selectedColumn, setSelectedColumn] = React.useState('');
    const [newDataType, setNewDataType] = React.useState('text');
    
    if (!data) return null;

    const { summary, columns, issues } = data;
    
    // Generate dirty data description
    const dirtyDataDescription = generateDirtyDataDescription(summary, columns, issues);
    
    // Find duplicate rows with details using the new detection system
    const duplicateDetails = findDuplicateGroups(rawData);
    
    // Detect potential bias
    const biasAnalysis = detectDatasetBias(rawData, columns);



    return (
      <div className="space-y-6" data-name="data-profile" data-file="components/DataProfile.js">
        <div className="flex items-center gap-2">
          <div style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"24px","color":"#2e54ea","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="icon-file-text text-2xl text-[var(--primary-color)]"></div>
          <div>
            <h2 style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"24px","color":"#2c32e8","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"700","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="text-2xl font-bold text-[var(--text-primary)]">Data Profile</h2>
            <p className="text-[var(--text-secondary)]">Analysis for {fileName}</p>
          </div>
        </div>

        {/* Dirty Data Description */}
        <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"24px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#eaeff1","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <div className="icon-search text-xl text-red-600"></div>
            Data Quality Assessment
          </h3>
          <p className="text-[var(--text-secondary)] mb-3">{dirtyDataDescription}</p>
          
          {summary.qualityScore && (
            <div className="flex items-center gap-3">
              <span className="font-medium">Quality Score:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-xs">
                <div 
                  className={`h-3 rounded-full ${
                    summary.qualityScore >= 80 ? 'bg-green-500' :
                    summary.qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${summary.qualityScore}%` }}
                ></div>
              </div>
              <span className="font-semibold">{summary.qualityScore}%</span>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="icon-layers text-xl text-blue-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{summary.totalRows}</p>
              <p className="text-sm text-[var(--text-secondary)]">Total Rows</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="icon-columns text-xl text-green-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{summary.totalColumns}</p>
              <p className="text-sm text-[var(--text-secondary)]">Columns</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="icon-alert-circle text-xl text-orange-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{summary.missingValues}</p>
              <p className="text-sm text-[var(--text-secondary)]">Missing Values</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="icon-copy text-xl text-red-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{summary.duplicates}</p>
              <p className="text-sm text-[var(--text-secondary)]">Duplicates</p>
            </div>
          </div>
        </div>

        {/* Bias Detection */}
        {biasAnalysis && biasAnalysis.hasBias && (
          <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"24px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#eff5f5","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <div style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"20px","color":"#f41f1f","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"600","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="icon-shield-alert text-xl text-purple-600"></div>
              Potential Bias Detected
            </h3>
            <div className="space-y-3">
              <p className="text-[var(--text-secondary)]">{biasAnalysis.explanation}</p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Recommended Solutions:</h4>
                <ul className="space-y-1">
                  {biasAnalysis.solutions.map((solution, index) => (
                    <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                      <div className="icon-arrow-right text-xs mt-1"></div>
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Duplicate Details */}
        {duplicateDetails.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <div className="icon-copy text-xl text-red-600"></div>
              Duplicate Analysis ({duplicateDetails.length} groups found)
            </h3>
            
            {/* Duplicate Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-red-800">Total Affected Rows</p>
                <p className="text-xl font-bold text-red-900">
                  {duplicateDetails.reduce((sum, group) => sum + group.count, 0)}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-orange-800">Largest Group</p>
                <p className="text-xl font-bold text-orange-900">
                  {Math.max(...duplicateDetails.map(g => g.count))} rows
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Data Impact</p>
                <p className="text-xl font-bold text-yellow-900">
                  {((duplicateDetails.reduce((sum, group) => sum + group.count - 1, 0) / summary.totalRows) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Detailed Duplicate Groups */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {duplicateDetails.slice(0, 10).map((group, index) => (
                <div key={index} className="border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-red-800">
                        Group {index + 1}: {group.count} identical rows
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.severity === 'High' ? 'bg-red-100 text-red-700' :
                        group.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {group.severity} Impact
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {group.duplicateType}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mb-1">
                    Rows: {group.indices.join(', ')}
                  </p>
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 font-mono">
                    {Object.entries(group.sample).slice(0, 3).map(([key, value]) => (
                      <div key={key}>{key}: "{String(value).slice(0, 30)}{String(value).length > 30 ? '...' : ''}"</div>
                    ))}
                    {Object.keys(group.sample).length > 3 && (
                      <div>... and {Object.keys(group.sample).length - 3} more fields</div>
                    )}
                  </div>
                </div>
              ))}
              {duplicateDetails.length > 10 && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Showing top 10 groups. {duplicateDetails.length - 10} more groups available.
                  </p>
                </div>
              )}
            </div>

            {/* Duplicate Removal Recommendation */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Recommendations:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Remove {duplicateDetails.reduce((sum, group) => sum + group.count - 1, 0)} duplicate rows to clean your dataset</li>
                <li>• Consider keeping the first occurrence of each duplicate group</li>
                <li>• Verify that duplicate removal won't affect your analysis requirements</li>
              </ul>
            </div>
          </div>
        )}

        {/* Data Type Conversion */}
        <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"24px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#eff4f6","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
          <h3 style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"16px","marginLeft":"0px","fontSize":"18px","color":"#2421c4","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"600","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="text-lg font-semibold text-[var(--text-primary)] mb-4">Data Type Conversion</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select 
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="px-3 py-2 border border-[var(--border-color)] rounded-lg"
            >
              <option value="">Select column to convert</option>
              {columns.map(col => (
                <option key={col.name} value={col.name}>{col.name} ({col.type})</option>
              ))}
            </select>
            <select 
              value={newDataType}
              onChange={(e) => setNewDataType(e.target.value)}
              className="px-3 py-2 border border-[var(--border-color)] rounded-lg"
              disabled={!selectedColumn}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            <button 
              onClick={() => convertColumnType(selectedColumn, newDataType)}
              disabled={!selectedColumn}
              className="btn-secondary disabled:opacity-50"
            >
              Convert Type
            </button>
          </div>
        </div>

        {/* Column Details */}
        <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"24px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#f2f8f7","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
          <h3 style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"16px","marginLeft":"0px","fontSize":"18px","color":"#272cd3","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"600","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="text-lg font-semibold text-[var(--text-primary)] mb-4">Column Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)]">Column</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)]">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)]">Missing</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)]">Unique</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)]">Issues</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((column, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{column.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        column.type === 'number' ? 'bg-blue-100 text-blue-800' :
                        column.type === 'date' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {column.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{column.missingCount} ({column.missingPercent}%)</td>
                    <td className="py-3 px-4">{column.uniqueCount}</td>
                    <td className="py-3 px-4">
                      {column.issues ? (
                        <span className="text-red-600 text-xs">{column.issues}</span>
                      ) : (
                        <span className="text-green-600 text-xs">Clean</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DataProfile component error:', error);
    return null;
  }
}

function generateDirtyDataDescription(summary, columns, issues) {
  const problems = [];
  
  if (summary.missingValues > 0) {
    problems.push(`${summary.missingValues} missing values`);
  }
  if (summary.duplicates > 0) {
    problems.push(`${summary.duplicates} duplicate rows`);
  }
  
  const invalidColumns = columns.filter(col => col.issues);
  if (invalidColumns.length > 0) {
    problems.push(`${invalidColumns.length} columns with data quality issues`);
  }
  
  if (problems.length === 0) {
    return "Your dataset appears to be relatively clean with minimal data quality issues.";
  }
  
  return `Your dataset contains ${problems.join(', ')}. These issues may affect analysis accuracy and should be addressed through data cleaning.`;
}

// Duplicate detection functions moved to utils/duplicateDetection.js

function detectDatasetBias(data, columns) {
  const categoricalColumns = columns.filter(col => 
    col.type === 'text' && col.uniqueCount > 1 && col.uniqueCount <= 20
  );
  
  for (const col of categoricalColumns) {
    const values = data.map(row => row[col.name]).filter(v => v && v !== '');
    const counts = {};
    values.forEach(v => counts[v] = (counts[v] || 0) + 1);
    
    const maxCount = Math.max(...Object.values(counts));
    const minCount = Math.min(...Object.values(counts));
    const imbalanceRatio = maxCount / minCount;
    
    if (imbalanceRatio > 3) {
      return {
        hasBias: true,
        column: col.name,
        explanation: `The column "${col.name}" shows significant imbalance with a ${imbalanceRatio.toFixed(1)}:1 ratio between most and least frequent categories. This could lead to biased model predictions.`,
        solutions: [
          'Apply stratified sampling to balance representation',
          'Use SMOTE or other oversampling techniques',
          'Consider collecting more data for underrepresented categories',
          'Apply class weights during model training',
          'Monitor fairness metrics during model evaluation'
        ]
      };
    }
  }
  
  return { hasBias: false };
}

function convertColumnType(columnName, newType) {
  try {
    if (!columnName || !newType) {
      alert('Please select both a column and target data type');
      return;
    }
    
    // This is a placeholder function for demonstration
    // In a real implementation, this would update the data structure
    console.log(`Converting column "${columnName}" to type "${newType}"`);
    alert(`Column "${columnName}" conversion to "${newType}" initiated. This feature will be implemented in the data processing pipeline.`);
  } catch (error) {
    console.error('Column type conversion error:', error);
    alert('Error converting column type');
  }
}

