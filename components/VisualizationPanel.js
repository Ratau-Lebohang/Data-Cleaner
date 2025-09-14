function VisualizationPanel({ data, recommendations, profileData }) {
  try {
    const [selectedVisualization, setSelectedVisualization] = React.useState(null);
    
    React.useEffect(() => {
      if (window.Chart) {
        window.ChartJS = window.Chart;
      }
    }, []);

    if (!data || !recommendations) return null;

    const generateChart = (rec) => {
      setSelectedVisualization(rec);
    };

    return (
      <div className="space-y-6" data-name="visualization-panel" data-file="components/VisualizationPanel.js">
        <div className="flex items-center gap-3">
          <div className="icon-bar-chart text-2xl text-[var(--primary-color)]"></div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Visualization Recommendations</h2>
            <p className="text-[var(--text-secondary)]">AI-suggested charts based on your data structure</p>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="card cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateChart(rec)}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rec.priority === 'high' ? 'bg-green-100' : rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <div className={`icon-${rec.icon} text-xl ${rec.priority === 'high' ? 'text-green-600' : rec.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'}`}></div>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{rec.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{rec.variables.join(' + ')}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.priority === 'high' ? 'bg-green-100 text-green-800' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {rec.priority} priority
                </span>
                <button className="text-[var(--primary-color)] text-sm font-medium hover:underline">
                  Generate Chart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Display */}
        {selectedVisualization && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{selectedVisualization.title}</h3>
              <div className="flex gap-2">
                <button className="btn-secondary">
                  <div className="icon-download text-lg"></div>
                  Export PNG
                </button>
                <button className="btn-secondary">
                  <div className="icon-code text-lg"></div>
                  Export HTML
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <canvas id="visualization-chart" width="400" height="200"></canvas>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              {selectedVisualization.insight}
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('VisualizationPanel component error:', error);
    return null;
  }
}