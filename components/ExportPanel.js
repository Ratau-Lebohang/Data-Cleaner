function ExportPanel({ cleanedData, cleaningLog, fileName, onBack }) {
  try {
    const [exportFormat, setExportFormat] = React.useState('csv');
    const [isExporting, setIsExporting] = React.useState(false);

    const downloadData = async (format) => {
      setIsExporting(true);
      
      try {
        let content, mimeType, fileExtension;
        
        switch (format) {
          case 'csv':
            content = arrayToCSV(cleanedData);
            mimeType = 'text/csv';
            fileExtension = '.csv';
            break;
          case 'json':
            content = JSON.stringify(cleanedData, null, 2);
            mimeType = 'application/json';
            fileExtension = '.json';
            break;
          case 'excel':
            // For simplicity, export as CSV with Excel-friendly format
            content = arrayToCSV(cleanedData);
            mimeType = 'application/vnd.ms-excel';
            fileExtension = '.csv';
            break;
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanFileName = fileName.replace(/\.[^/.]+$/, '');
        a.download = `${cleanFileName}_cleaned${fileExtension}`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting file');
      } finally {
        setIsExporting(false);
      }
    };

    const downloadLog = () => {
      const logContent = JSON.stringify(cleaningLog, null, 2);
      const blob = new Blob([logContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanFileName = fileName.replace(/\.[^/.]+$/, '');
      a.download = `${cleanFileName}_cleaning_log.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="space-y-6" data-name="export-panel" data-file="components/ExportPanel.js">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="icon-check-circle text-2xl text-green-600"></div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Data Cleaning Complete</h2>
              <p className="text-[var(--text-secondary)]">Your data has been successfully cleaned</p>
            </div>
          </div>
          <button onClick={onBack} className="btn-secondary">
            <div className="icon-arrow-left text-lg"></div>
            Back to Cleaning
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="icon-check text-xl text-green-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{cleanedData?.length || 0}</p>
              <p className="text-sm text-[var(--text-secondary)]">Clean Rows</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="icon-trash-2 text-xl text-blue-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{cleaningLog?.rowsRemoved || 0}</p>
              <p className="text-sm text-[var(--text-secondary)]">Rows Removed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="icon-edit text-xl text-purple-600"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{cleaningLog?.valuesImputed || 0}</p>
              <p className="text-sm text-[var(--text-secondary)]">Values Fixed</p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="card">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Export Cleaned Data</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Export Format
            </label>
            <select 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg"
            >
              <option value="csv">CSV (Comma Separated Values)</option>
              <option value="json">JSON (JavaScript Object Notation)</option>
              <option value="excel">Excel Compatible CSV</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => downloadData(exportFormat)}
              disabled={isExporting}
              className={`btn-primary ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="icon-download text-lg"></div>
              {isExporting ? 'Exporting...' : 'Download Cleaned Data'}
            </button>
            <button onClick={downloadLog} className="btn-secondary">
              <div className="icon-file-text text-lg"></div>
              Download Cleaning Log
            </button>
          </div>
        </div>

        {/* Cleaning Operations Log */}
        {cleaningLog && cleaningLog.operations && (
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Cleaning Operations</h3>
            <div className="space-y-2">
              {cleaningLog.operations.map((operation, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="icon-check-circle text-green-600"></div>
                  <span>{operation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ExportPanel component error:', error);
    return null;
  }
}