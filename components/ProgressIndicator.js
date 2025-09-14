function ProgressIndicator({ stage }) {
  try {
    return (
      <div className="flex flex-col items-center justify-center py-20" data-name="progress-indicator" data-file="components/ProgressIndicator.js">
        <div className="w-16 h-16 loading-spinner mb-6"></div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Processing Data</h3>
        <p className="text-[var(--text-secondary)] text-center max-w-md">
          {stage || 'Preparing your data for analysis...'}
        </p>
        <div className="mt-6 w-64 progress-bar">
          <div className="progress-fill animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProgressIndicator component error:', error);
    return null;
  }
}