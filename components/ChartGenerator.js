function ChartGenerator({ data, chart, className = "h-64" }) {
  try {
    const canvasRef = React.useRef(null);
    const chartInstanceRef = React.useRef(null);

    React.useEffect(() => {
      if (data && chart && canvasRef.current) {
        generateChart();
      }
      
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }, [data, chart]);

    const generateChart = () => {
      const ctx = canvasRef.current.getContext('2d');
      
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const chartConfig = createChartConfig(data, chart);
      chartInstanceRef.current = new Chart(ctx, chartConfig);
    };

    const createChartConfig = (data, chart) => {
      switch (chart.type) {
        case 'stacked-bar':
          return createStackedBarChart(data, chart.config);
        case 'boxplot':
          return createBoxplotChart(data, chart.config);
        case 'heatmap':
          return createHeatmapChart(data, chart.config);
        default:
          return createAutoChart(data, chart.config);
      }
    };

    return (
      <div className={`card ${className}`} data-name="chart-generator" data-file="components/ChartGenerator.js">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)]">{chart.title}</h3>
          <div className="flex gap-2">
            <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]">
              <div className="icon-download text-lg"></div>
            </button>
            <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]">
              <div className="icon-maximize text-lg"></div>
            </button>
          </div>
        </div>
        
        <div className="relative h-full">
          <canvas ref={canvasRef} className="max-h-full"></canvas>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ChartGenerator component error:', error);
    return null;
  }
}