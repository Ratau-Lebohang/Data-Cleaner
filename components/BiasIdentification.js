function BiasIdentification({ data, profileData, onBiasDetected }) {
  try {
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [quickResults, setQuickResults] = React.useState(null);

    const runBiasAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const biasResults = await analyzeDatasetBias(data, profileData);
        setQuickResults(biasResults);
        
        setTimeout(() => {
          onBiasDetected(biasResults);
        }, 500);
      } catch (error) {
        console.error('Bias analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const analyzeDatasetBias = async (data, profileData) => {
      const results = {
        overallBiasScore: 0,
        detectedBiases: [],
        recommendations: []
      };

      // Analyze categorical columns for bias
      const categoricalColumns = profileData.columns.filter(col => 
        col.type === 'text' && col.uniqueCount > 1 && col.uniqueCount <= 20
      );

      for (const col of categoricalColumns) {
        const biasResult = detectBias(data, col.name);
        if (biasResult && biasResult.analysis.biasScore > 0.3) {
          results.detectedBiases.push({
            column: col.name,
            biasScore: biasResult.analysis.biasScore,
            type: biasResult.analysis.biasScore > 0.7 ? 'High' : 'Moderate',
            fairnessMetrics: biasResult.analysis.fairnessMetrics
          });
        }
      }

      results.overallBiasScore = results.detectedBiases.length > 0 
        ? results.detectedBiases.reduce((sum, b) => sum + b.biasScore, 0) / results.detectedBiases.length
        : 0;

      return results;
    };

    return (
      <div className="card" data-name="bias-identification" data-file="components/BiasIdentification.js">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="icon-shield-alert text-xl text-orange-600"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Bias Detection</h3>
              <p className="text-sm text-[var(--text-secondary)]">Identify potential biases in your dataset</p>
            </div>
          </div>
          
          <button 
            onClick={runBiasAnalysis}
            disabled={isAnalyzing}
            className={`btn-primary ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 loading-spinner"></div>
                Analyzing...
              </>
            ) : (
              <>
                <div className="icon-search text-lg"></div>
                Identify Bias
              </>
            )}
          </button>
        </div>

        {quickResults && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Overall Bias Score:</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  quickResults.overallBiasScore > 0.7 ? 'bg-red-500' :
                  quickResults.overallBiasScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="font-semibold">
                  {(quickResults.overallBiasScore * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            {quickResults.detectedBiases.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Detected Issues:</p>
                {quickResults.detectedBiases.slice(0, 3).map((bias, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-orange-50 rounded">
                    <span>{bias.column}</span>
                    <span className={`font-medium ${bias.type === 'High' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {bias.type} Bias ({(bias.biasScore * 100).toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-[var(--text-secondary)]">
              Click "Identify Bias" again for detailed analysis and recommendations.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('BiasIdentification component error:', error);
    return null;
  }
}