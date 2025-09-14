function VisualizationsTab({ data, profileData, recommendations, onNextStep }) {
  try {
    const [selectedChart, setSelectedChart] = React.useState(null);
    const [pivotConfig, setPivotConfig] = React.useState({
      xAxis: null,
      yAxis: null,
      groupBy: null,
      aggregation: 'count'
    });
    const [defaultCharts, setDefaultCharts] = React.useState([]);

    React.useEffect(() => {
      if (data && profileData) {
        generateDefaultCharts();
      }
    }, [data, profileData]);

    const generateDefaultCharts = () => {
      const charts = [];
      const categoricalCols = profileData.columns.filter(col => col.type === 'text' && col.uniqueCount <= 20);
      const numericCols = profileData.columns.filter(col => col.type === 'number');

      // Cat vs Cat - Stacked bar
      if (categoricalCols.length >= 2) {
        charts.push({
          id: 'cat-cat',
          title: `${categoricalCols[0].name} vs ${categoricalCols[1].name}`,
          type: 'stacked-bar',
          config: { x: categoricalCols[0].name, group: categoricalCols[1].name }
        });
      }

      // Num vs Cat - Boxplot
      if (numericCols.length > 0 && categoricalCols.length > 0) {
        charts.push({
          id: 'num-cat',
          title: `${numericCols[0].name} by ${categoricalCols[0].name}`,
          type: 'boxplot',
          config: { y: numericCols[0].name, x: categoricalCols[0].name }
        });
      }

      // Missing values heatmap
      charts.push({
        id: 'missing-heatmap',
        title: 'Missing Values Analysis',
        type: 'heatmap',
        config: { type: 'missing' }
      });

      setDefaultCharts(charts);
    };

    const handlePivotChange = (field, value) => {
      setPivotConfig(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="space-y-6" data-name="visualizations-tab" data-file="components/VisualizationsTab.js">
        <div className="flex items-center gap-3">
          <div className="icon-chart-bar text-2xl text-[var(--primary-color)]"></div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Interactive Visualizations</h2>
            <p className="text-[var(--text-secondary)]">Explore your data with pivot-style operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Recommendations Panel */}
          <div className="lg:col-span-1">
            <RecommendationsPanel 
              recommendations={recommendations}
              onChartSelect={setSelectedChart}
            />
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pivot Controls */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Chart Configuration</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select 
                  value={pivotConfig.xAxis || ''}
                  onChange={(e) => handlePivotChange('xAxis', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Select X-Axis</option>
                  {profileData?.columns.map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
                <select 
                  value={pivotConfig.yAxis || ''}
                  onChange={(e) => handlePivotChange('yAxis', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Y-Axis</option>
                  {profileData?.columns.map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
                <select 
                  value={pivotConfig.groupBy || ''}
                  onChange={(e) => handlePivotChange('groupBy', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Group By</option>
                  {profileData?.columns.map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
                <select 
                  value={pivotConfig.aggregation}
                  onChange={(e) => handlePivotChange('aggregation', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="count">Count</option>
                  <option value="avg">Average</option>
                  <option value="sum">Sum</option>
                </select>
              </div>
            </div>

            {/* Default Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defaultCharts.map(chart => (
                <ChartGenerator 
                  key={chart.id}
                  data={data}
                  chart={chart}
                  className="h-80"
                />
              ))}
            </div>

            {/* Custom Chart */}
            {(pivotConfig.xAxis || pivotConfig.yAxis) && (
              <ChartGenerator 
                data={data}
                chart={{
                  title: 'Custom Chart',
                  type: 'auto',
                  config: pivotConfig
                }}
                className="h-96"
              />
            )}

            <div className="flex justify-end">
              <button onClick={onNextStep} className="btn-primary">
                <div className="icon-arrow-right text-lg"></div>
                Continue to Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('VisualizationsTab component error:', error);
    return null;
  }
}