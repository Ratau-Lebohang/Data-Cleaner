// Chart utility functions for generating different chart types

function createStackedBarChart(data, config) {
  const { x, group } = config;
  const processedData = processStackedBarData(data, x, group);
  
  return {
    type: 'bar',
    data: {
      labels: processedData.labels,
      datasets: processedData.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: { stacked: true }
      },
      plugins: {
        legend: { position: 'top' }
      }
    }
  };
}

function createBoxplotChart(data, config) {
  // Simplified boxplot using bar chart
  const { x, y } = config;
  const processedData = processBoxplotData(data, x, y);
  
  return {
    type: 'bar',
    data: {
      labels: processedData.labels,
      datasets: [{
        label: `${y} Distribution`,
        data: processedData.values,
        backgroundColor: 'rgba(37, 99, 235, 0.7)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  };
}

function createHeatmapChart(data, config) {
  if (config.type === 'missing') {
    const processedData = processMissingValuesHeatmap(data);
    
    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Missing Values',
          data: processedData.points,
          backgroundColor: processedData.colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { 
            type: 'linear',
            position: 'bottom',
            ticks: { callback: (value) => processedData.columnNames[Math.floor(value)] || '' }
          },
          y: {
            ticks: { callback: (value) => `Row ${Math.floor(value)}` }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    };
  }
  
  return createAutoChart(data, config);
}

function createAutoChart(data, config) {
  const { xAxis, yAxis, aggregation } = config;
  
  if (!xAxis && !yAxis) return null;
  
  // Auto-detect chart type based on data types
  const processedData = processAutoChartData(data, xAxis, yAxis, aggregation);
  
  return {
    type: processedData.chartType,
    data: {
      labels: processedData.labels,
      datasets: processedData.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: processedData.datasets.length > 1 }
      }
    }
  };
}

// Data processing functions
function processStackedBarData(data, xCol, groupCol) {
  const grouped = {};
  const groups = new Set();
  
  data.forEach(row => {
    const xVal = row[xCol] || 'Unknown';
    const groupVal = row[groupCol] || 'Unknown';
    
    groups.add(groupVal);
    if (!grouped[xVal]) grouped[xVal] = {};
    grouped[xVal][groupVal] = (grouped[xVal][groupVal] || 0) + 1;
  });
  
  const labels = Object.keys(grouped);
  const datasets = Array.from(groups).map((group, index) => ({
    label: group,
    data: labels.map(label => grouped[label][group] || 0),
    backgroundColor: `hsl(${index * 60}, 70%, 60%)`
  }));
  
  return { labels, datasets };
}

function processBoxplotData(data, xCol, yCol) {
  const grouped = {};
  
  data.forEach(row => {
    const xVal = row[xCol] || 'Unknown';
    const yVal = parseFloat(row[yCol]);
    
    if (!isNaN(yVal)) {
      if (!grouped[xVal]) grouped[xVal] = [];
      grouped[xVal].push(yVal);
    }
  });
  
  const labels = Object.keys(grouped);
  const values = labels.map(label => {
    const vals = grouped[label].sort((a, b) => a - b);
    return vals[Math.floor(vals.length / 2)]; // Median as simplified representation
  });
  
  return { labels, values };
}

function processMissingValuesHeatmap(data) {
  const columns = Object.keys(data[0] || {});
  const points = [];
  const colors = [];
  
  data.slice(0, 100).forEach((row, rowIndex) => { // Limit to first 100 rows for performance
    columns.forEach((col, colIndex) => {
      const isMissing = !row[col] || row[col] === '' || row[col] === null;
      points.push({ x: colIndex, y: rowIndex });
      colors.push(isMissing ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)');
    });
  });
  
  return { points, colors, columnNames: columns };
}

function processAutoChartData(data, xCol, yCol, aggregation) {
  if (!xCol && yCol) {
    // Histogram
    const values = data.map(row => parseFloat(row[yCol])).filter(v => !isNaN(v));
    const bins = createHistogramBins(values, 10);
    
    return {
      chartType: 'bar',
      labels: bins.labels,
      datasets: [{
        label: yCol,
        data: bins.counts,
        backgroundColor: 'rgba(37, 99, 235, 0.7)'
      }]
    };
  }
  
  if (xCol && yCol) {
    // Scatter or grouped data
    const isXNumeric = !isNaN(parseFloat(data[0][xCol]));
    const isYNumeric = !isNaN(parseFloat(data[0][yCol]));
    
    if (isXNumeric && isYNumeric) {
      // Scatter plot
      const points = data.map(row => ({
        x: parseFloat(row[xCol]),
        y: parseFloat(row[yCol])
      })).filter(p => !isNaN(p.x) && !isNaN(p.y));
      
      return {
        chartType: 'scatter',
        labels: [],
        datasets: [{
          label: `${xCol} vs ${yCol}`,
          data: points,
          backgroundColor: 'rgba(37, 99, 235, 0.7)'
        }]
      };
    } else {
      // Grouped bar chart
      const grouped = {};
      data.forEach(row => {
        const xVal = row[xCol] || 'Unknown';
        const yVal = isYNumeric ? parseFloat(row[yCol]) : 1;
        
        if (!grouped[xVal]) grouped[xVal] = [];
        if (!isNaN(yVal)) grouped[xVal].push(yVal);
      });
      
      const labels = Object.keys(grouped);
      const values = labels.map(label => {
        const vals = grouped[label];
        if (aggregation === 'avg') {
          return vals.reduce((sum, val) => sum + val, 0) / vals.length;
        } else if (aggregation === 'sum') {
          return vals.reduce((sum, val) => sum + val, 0);
        } else {
          return vals.length; // count
        }
      });
      
      return {
        chartType: 'bar',
        labels,
        datasets: [{
          label: `${aggregation} of ${yCol}`,
          data: values,
          backgroundColor: 'rgba(37, 99, 235, 0.7)'
        }]
      };
    }
  }
  
  return null;
}

function createHistogramBins(values, binCount) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / binCount;
  
  const bins = Array(binCount).fill(0);
  const labels = [];
  
  for (let i = 0; i < binCount; i++) {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
  }
  
  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
    bins[binIndex]++;
  });
  
  return { labels, counts: bins };
}
