function DownloadPanel({ cleanedData, cleaningLog, fileName, onBiasDetection }) {
  try {
    const [selectedColumn, setSelectedColumn] = React.useState('');

    const downloadCleanedData = () => {
      const csvContent = arrayToCSV(cleanedData);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanFileName = fileName.replace('.csv', '_clean_v1.csv');
      a.download = cleanFileName;
      a.click();
    };

    const downloadLog = () => {
      const logContent = JSON.stringify(cleaningLog, null, 2);
      const blob = new Blob([logContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cleaning_log_${fileName.replace('.csv', '')}.json`;
      a.click();
    };

    const handleBiasDetection = () => {
      if (selectedColumn) {
        onBiasDetection(selectedColumn);
      }
    };

    if (!cleanedData || !cleaningLog) return null;

    const columns = Object.keys(cleanedData[0] || {});

    return (
      <div className="space-y-6" data-name="download-panel" data-file="components/DownloadPanel.js">
        <div className="flex items-center gap-3">
          <div className="icon-check-circle text-2xl text-green-600"></div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Data Cleaning Complete</h2>
            <p className="text-[var(--text-secondary)]">Your dataset has been successfully cleaned</p>
          </div>
        </div>

        {/* Cleaning Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="icon-check text-xl text-green-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{cleanedData.length}</p>
              <p className="text-sm text-[var(--text-secondary)]">Clean Rows</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="icon-trash-2 text-xl text-blue-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{cleaningLog.rowsRemoved}</p>
              <p className="text-sm text-[var(--text-secondary)]">Rows Removed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="icon-edit text-xl text-purple-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{cleaningLog.valuesImputed}</p>
              <p className="text-sm text-[var(--text-secondary)]">Values Imputed</p>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="card">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Download Options</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={downloadCleanedData} className="btn-primary">
              <div className="icon-download text-lg"></div>
              Download Clean Dataset
            </button>
            <button onClick={downloadLog} className="btn-secondary">
              <div className="icon-file-text text-lg"></div>
              Download Cleaning Log
            </button>
          </div>
        </div>

        {/* Bias Detection */}
        <div className="card">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Bias Detection</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Select a column to analyze for potential bias and imbalances
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="px-4 py-2 border border-[var(--border-color)] rounded-lg flex-1"
            >
              <option value="">Select column for bias analysis...</option>
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
            <button 
              onClick={handleBiasDetection}
              disabled={!selectedColumn}
              className={`btn-primary ${!selectedColumn ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="icon-shield-alert text-lg"></div>
              Analyze Bias
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DownloadPanel component error:', error);
    return null;
  }
}