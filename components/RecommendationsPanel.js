function RecommendationsPanel({ recommendations, onChartSelect }) {
  try {
    return (
      <div className="card h-fit" data-name="recommendations-panel" data-file="components/RecommendationsPanel.js">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="icon-lightbulb text-xl text-yellow-500"></div>
          Chart Recommendations
        </h3>
        
        <div className="space-y-3">
          {recommendations?.slice(0, 6).map((rec, index) => (
            <div 
              key={index}
              onClick={() => onChartSelect(rec)}
              className="p-3 border border-[var(--border-color)] rounded-lg cursor-pointer hover:bg-[var(--secondary-color)] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  rec.priority === 'high' ? 'bg-green-100' : 
                  rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <div className={`icon-${rec.icon} text-sm ${
                    rec.priority === 'high' ? 'text-green-600' : 
                    rec.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-[var(--text-primary)]">{rec.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{rec.ruleType}</p>
                </div>
              </div>
              
              <p className="text-xs text-[var(--text-secondary)] mb-2">{rec.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  rec.isBiasChart ? 'bg-red-100 text-red-700' :
                  rec.isOutlierChart ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {rec.isBiasChart ? 'Bias Analysis' :
                   rec.isOutlierChart ? 'Outlier Detection' : 
                   rec.priority}
                </span>
                <button className="text-xs text-[var(--primary-color)] hover:underline">
                  Generate
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm text-blue-800 mb-1">Rule-Based Engine</h4>
          <p className="text-xs text-blue-700">
            Charts are suggested based on variable types, cardinality, and data patterns.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RecommendationsPanel component error:', error);
    return null;
  }
}