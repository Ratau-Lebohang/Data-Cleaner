function CleaningOptions({ profileData, onClean }) {
  try {
    const [options, setOptions] = React.useState({
      // Missing Values
      handleMissing: 'median',
      customFillValue: '',
      
      // Duplicates
      handleDuplicates: 'drop',
      
      // Format Standardization
      standardizeDates: true,
      dateFormat: 'YYYY-MM-DD',
      standardizeNumbers: true,
      
      // Text Normalization
      trimWhitespace: true,
      standardizeCase: 'none',
      removeSpecialChars: false,
      
      // Outliers
      handleOutliers: 'none',
      outlierMethod: 'iqr',
      
      // Categorical Encoding
      encodeCategories: false,
      encodingMethod: 'label',
      
      // Schema Enforcement
      enforceSchema: true
    });

    const handleOptionChange = (key, value) => {
      setOptions(prev => ({ ...prev, [key]: value }));
    };

    const handleClean = () => {
      onClean(options);
    };

    if (!profileData) return null;

    return (
      <div className="space-y-6" data-name="cleaning-options" data-file="components/CleaningOptions.js">
        <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#eff4f6","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
          <h3 style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"24px","marginLeft":"0px","fontSize":"18px","color":"#2b4bee","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"600","objectFit":"fill","display":"flex","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <div style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"20px","color":"#1511e4","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"600","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="icon-settings text-xl text-[var(--primary-color)]"></div>
            Data Cleaning Actions
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Missing Values */}
            {profileData.summary.missingValues > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-[var(--text-primary)]">
                  Missing Values ({profileData.summary.missingValues} found)
                </h4>
                <select 
                  value={options.handleMissing}
                  onChange={(e) => handleOptionChange('handleMissing', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
                >
                  <option value="drop">Drop rows with missing values</option>
                  <option value="mean">Fill with mean (numeric only)</option>
                  <option value="median">Fill with median (numeric only)</option>
                  <option value="mode">Fill with mode (most frequent)</option>
                  <option value="custom">Fill with custom value</option>
                </select>
                {options.handleMissing === 'custom' && (
                  <input
                    type="text"
                    placeholder="Custom fill value"
                    value={options.customFillValue}
                    onChange={(e) => handleOptionChange('customFillValue', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
                  />
                )}
              </div>
            )}

            {/* Duplicates */}
            {profileData.summary.duplicates > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-[var(--text-primary)]">
                  Duplicates ({profileData.summary.duplicates} found)
                </h4>
                <select 
                  value={options.handleDuplicates}
                  onChange={(e) => handleOptionChange('handleDuplicates', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
                >
                  <option value="drop">Remove all duplicates</option>
                  <option value="keep_first">Keep first occurrence</option>
                  <option value="keep_last">Keep last occurrence</option>
                  <option value="keep">Keep all duplicates</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Format Standardization */}
        <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"24px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#f1f3f3","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
          <h4 className="font-medium text-[var(--text-primary)] mb-4">Format Standardization</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.standardizeDates}
                  onChange={(e) => handleOptionChange('standardizeDates', e.target.checked)}
                  className="text-[var(--primary-color)]"
                />
                <span>Standardize date formats</span>
              </label>
              {options.standardizeDates && (
                <select 
                  value={options.dateFormat}
                  onChange={(e) => handleOptionChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO format)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US format)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (European format)</option>
                </select>
              )}
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.standardizeNumbers}
                  onChange={(e) => handleOptionChange('standardizeNumbers', e.target.checked)}
                  className="text-[var(--primary-color)]"
                />
                <span>Standardize number formats</span>
              </label>
            </div>
          </div>
        </div>

        {/* Text Normalization */}
        <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"24px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#f0f4f4","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
          <h4 className="font-medium text-[var(--text-primary)] mb-4">Text Normalization</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.trimWhitespace}
                onChange={(e) => handleOptionChange('trimWhitespace', e.target.checked)}
                className="text-[var(--primary-color)]"
              />
              <span>Trim whitespace</span>
            </label>
            <div className="space-y-2">
              <label className="block text-sm">Case standardization</label>
              <select 
                value={options.standardizeCase}
                onChange={(e) => handleOptionChange('standardizeCase', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
              >
                <option value="none">Keep original case</option>
                <option value="lower">Convert to lowercase</option>
                <option value="upper">Convert to UPPERCASE</option>
                <option value="title">Convert to Title Case</option>
              </select>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.removeSpecialChars}
                onChange={(e) => handleOptionChange('removeSpecialChars', e.target.checked)}
                className="text-[var(--primary-color)]"
              />
              <span>Remove special characters</span>
            </label>
          </div>
        </div>

        {/* Outliers and Advanced Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#f0f4f5","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
            <h4 className="font-medium text-[var(--text-primary)] mb-4">Outlier Handling</h4>
            <div className="space-y-3">
              <select 
                value={options.handleOutliers}
                onChange={(e) => handleOptionChange('handleOutliers', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
              >
                <option value="none">Keep outliers</option>
                <option value="remove">Remove outliers</option>
                <option value="cap">Cap outliers to bounds</option>
                <option value="mark">Mark outliers (add flag column)</option>
              </select>
              {options.handleOutliers !== 'none' && (
                <select 
                  value={options.outlierMethod}
                  onChange={(e) => handleOptionChange('outlierMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
                >
                  <option value="iqr">IQR method (1.5 * IQR)</option>
                  <option value="zscore">Z-score method (3σ)</option>
                </select>
              )}
            </div>
          </div>

          <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#f8fbfc","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
            <h4 className="font-medium text-[var(--text-primary)] mb-4">Advanced Options</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.encodeCategories}
                  onChange={(e) => handleOptionChange('encodeCategories', e.target.checked)}
                  className="text-[var(--primary-color)]"
                />
                <span>Encode categorical values</span>
              </label>
              {options.encodeCategories && (
                <select 
                  value={options.encodingMethod}
                  onChange={(e) => handleOptionChange('encodingMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
                >
                  <option value="label">Label encoding</option>
                  <option value="onehot">One-hot encoding</option>
                </select>
              )}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.enforceSchema}
                  onChange={(e) => handleOptionChange('enforceSchema', e.target.checked)}
                  className="text-[var(--primary-color)]"
                />
                <span>Enforce schema consistency</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleClean}
            className="btn-cleaning"
          >
            <div className="icon-play text-lg"></div>
            Apply Cleaning Actions
          </button>
        </div>
        
        {/* Purpose Descriptions */}
        <div style={{"paddingTop":"24px","paddingRight":"24px","paddingBottom":"24px","paddingLeft":"24px","marginTop":"24px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"19px","color":"rgb(17, 24, 39)","backgroundColor":"#f7f8f8","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="card">
          <h4 className="font-medium text-[var(--text-primary)] mb-4">Purpose of Data Cleaning Actions</h4>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <div className="flex items-start gap-3">
              <div className="icon-droplets text-blue-600 mt-0.5"></div>
              <div>
                <p className="font-medium">Missing Values:</p>
                <p>Handle gaps in data to prevent analysis errors and ensure model accuracy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="icon-copy text-red-600 mt-0.5"></div>
              <div>
                <p className="font-medium">Duplicates:</p>
                <p>Remove redundant records that can skew statistical analysis and model training</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="icon-calendar text-green-600 mt-0.5"></div>
              <div>
                <p className="font-medium">Format Standardization:</p>
                <p>Ensure consistent data formats for proper parsing and analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="icon-type text-purple-600 mt-0.5"></div>
              <div>
                <p className="font-medium">Text Normalization:</p>
                <p>Clean and standardize text data for better pattern recognition</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="icon-target text-orange-600 mt-0.5"></div>
              <div>
                <p className="font-medium">Outlier Handling:</p>
                <p>Identify and manage extreme values that may distort statistical measures</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="icon-hash text-indigo-600 mt-0.5"></div>
              <div>
                <p className="font-medium">Categorical Encoding:</p>
                <p>Convert text categories to numbers for machine learning compatibility</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="icon-check-square text-teal-600 mt-0.5"></div>
              <div>
                <p className="font-medium">Schema Enforcement:</p>
                <p>Maintain consistent data types and structure across the dataset</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CleaningOptions component error:', error);
    return null;
  }
}
