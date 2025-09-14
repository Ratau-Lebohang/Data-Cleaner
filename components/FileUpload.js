function FileUpload({ onUpload }) {
  try {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const handleFileSelect = async (file) => {
      if (!file || !file.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }

      setIsUploading(true);
      try {
        const text = await file.text();
        const data = parseCSV(text);
        onUpload(data, file.name);
      } catch (error) {
        console.error('File processing error:', error);
        alert('Error processing file. Please check if it\'s a valid CSV.');
      } finally {
        setIsUploading(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    return (
      <div className="max-w-2xl mx-auto" data-name="file-upload" data-file="components/FileUpload.js">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Upload Your Dataset
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Start by uploading your raw CSV file to begin automated profiling and cleaning
          </p>
        </div>

        <div
          className={`upload-zone cursor-pointer ${isDragOver ? 'border-[var(--primary-color)] bg-blue-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          
          {isUploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-[var(--primary-color)] rounded-full flex items-center justify-center animate-pulse">
                <div className="icon-upload text-2xl text-white"></div>
              </div>
              <p className="text-lg font-medium text-[var(--primary-color)]">Processing file...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
                <div className="icon-file-text text-2xl text-[var(--primary-color)]"></div>
              </div>
              <div>
                <p className="text-lg font-medium text-[var(--text-primary)] mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Supports CSV files up to 50MB
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <div className="icon-eye text-xl text-green-600"></div>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">Profile Data</h3>
            <p className="text-sm text-[var(--text-secondary)]">Analyze missing values, duplicates, and data types</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <div className="icon-settings text-xl text-blue-600"></div>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">Clean Data</h3>
            <p className="text-sm text-[var(--text-secondary)]">Remove duplicates and handle missing values</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <div className="icon-shield-alert text-xl text-purple-600"></div>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">Detect Bias</h3>
            <p className="text-sm text-[var(--text-secondary)]">Identify imbalances and potential issues</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('FileUpload component error:', error);
    return null;
  }
}