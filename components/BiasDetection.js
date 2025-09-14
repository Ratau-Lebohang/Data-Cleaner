function BiasDetection({ results }) {
  try {
    if (!results) return null;

    const { column, analysis, recommendations } = results;

    return (
      <div className="space-y-6" data-name="bias-detection" data-file="components/BiasDetection.js">
        <div className="flex items-center gap-3">
          <div className="icon-shield-alert text-2xl text-[var(--warning-color)]"></div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Bias Detection Results</h2>
            <p className="text-[var(--text-secondary)]">Analysis for column: {column}</p>
          </div>
        </div>

        {/* Bias Score */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Bias Score</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              analysis.biasScore > 0.7 ? 'bg-red-100 text-red-800' :
              analysis.biasScore > 0.4 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {analysis.biasScore > 0.7 ? 'High Risk' :
               analysis.biasScore > 0.4 ? 'Medium Risk' : 'Low Risk'}
            </div>
          </div>
          
          <div className="progress-bar mb-3">
            <div 
              className="progress-fill"
              style={{ width: `${analysis.biasScore * 100}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-[var(--text-secondary)]">
            Bias Score: {(analysis.biasScore * 100).toFixed(1)}%
          </p>
        </div>

        {/* Distribution Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Distribution Analysis</h3>
          <div className="space-y-4">
            {analysis.distribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[var(--primary-color)] rounded"></div>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {item.count} ({item.percentage}%)
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-[var(--primary-color)] rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <div className="icon-lightbulb text-xl text-yellow-500"></div>
            Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="icon-check-circle text-lg text-blue-600 mt-0.5"></div>
                <p className="text-blue-800">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const data = JSON.stringify(results, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `bias_analysis_${column}.json`;
              a.click();
            }}
            className="btn-secondary"
          >
            <div className="icon-download text-lg"></div>
            Export Analysis
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BiasDetection component error:', error);
    return null;
  }
}