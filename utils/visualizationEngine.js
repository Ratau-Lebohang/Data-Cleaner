// Visualization recommendation engine

function generateVisualizationRecommendations(data, profileData) {
  try {
    if (!data || !profileData) return [];
    
    const recommendations = [];
    const columns = profileData.columns;
    const numericColumns = columns.filter(col => col.type === 'number');
    const categoricalColumns = columns.filter(col => col.type === 'text');
    const dateColumns = columns.filter(col => col.type === 'date');

    // Rule-based chart suggestions based on variable types
    
    // Categorical variables → Bar/Pie charts
    categoricalColumns.forEach(col => {
      if (col.uniqueCount <= 20) {
        recommendations.push({
          title: `${col.name} Distribution`,
          type: 'bar',
          variables: [col.name],
          description: `Bar chart showing frequency distribution (Rule: Categorical → Bar chart)`,
          priority: 'high',
          icon: 'bar-chart-3',
          insight: `Analyze category distribution and identify potential bias in ${col.name}`,
          ruleType: 'categorical-distribution'
        });
        
        if (col.uniqueCount <= 8) {
          recommendations.push({
            title: `${col.name} Pie Chart`,
            type: 'pie',
            variables: [col.name],
            description: `Pie chart for categorical proportions (Rule: Few categories → Pie chart)`,
            priority: 'medium',
            icon: 'pie-chart',
            insight: `Visual proportion analysis of ${col.name} categories`,
            ruleType: 'categorical-pie'
          });
        }
      }
    });

    // Numeric variables → Histogram/Boxplot
    numericColumns.forEach(col => {
      recommendations.push({
        title: `${col.name} Distribution`,
        type: 'histogram',
        variables: [col.name],
        description: `Histogram showing distribution pattern (Rule: Numeric → Histogram)`,
        priority: 'high',
        icon: 'bar-chart',
        insight: `Examine statistical distribution and identify outliers in ${col.name}`,
        ruleType: 'numeric-distribution'
      });
      
      // Add outlier-specific visualization if outliers detected
      if (profileData.outliers && profileData.outliers[col.name]) {
        recommendations.push({
          title: `${col.name} Outlier Detection`,
          type: 'boxplot',
          variables: [col.name],
          description: `Box plot highlighting outliers (Rule: Outliers detected → Box plot)`,
          priority: 'high',
          icon: 'alert-triangle',
          insight: `Identify and analyze ${profileData.outliers[col.name].combined?.length || 0} potential outliers`,
          ruleType: 'outlier-detection',
          isOutlierChart: true
        });
      }
    });

    // Categorical + Numeric → Violin/Grouped bar
    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
      categoricalColumns.slice(0, 2).forEach(catCol => {
        if (catCol.uniqueCount <= 10) {
          numericColumns.slice(0, 2).forEach(numCol => {
            recommendations.push({
              title: `${numCol.name} by ${catCol.name}`,
              type: 'violin',
              variables: [catCol.name, numCol.name],
              description: `Violin plot comparing distributions (Rule: Categorical + Numeric → Violin plot)`,
              priority: 'medium',
              icon: 'activity',
              insight: `Compare ${numCol.name} distributions across ${catCol.name} groups for bias analysis`,
              ruleType: 'categorical-numeric-violin',
              isBiasChart: true
            });
          });
        }
      });
    }

    // Two numeric → Scatter/Line/Correlation heatmap
    if (numericColumns.length >= 2) {
      for (let i = 0; i < Math.min(numericColumns.length, 3); i++) {
        for (let j = i + 1; j < Math.min(numericColumns.length, 3); j++) {
          recommendations.push({
            title: `${numericColumns[i].name} vs ${numericColumns[j].name}`,
            type: 'scatter',
            variables: [numericColumns[i].name, numericColumns[j].name],
            description: `Scatter plot for correlation analysis (Rule: Two numeric → Scatter plot)`,
            priority: 'medium',
            icon: 'scatter-chart',
            insight: `Identify correlations and patterns between numeric variables`,
            ruleType: 'numeric-correlation'
          });
        }
      }
    }

    // Time series → Line/Area charts
    if (dateColumns.length > 0 && numericColumns.length > 0) {
      dateColumns.slice(0, 1).forEach(dateCol => {
        numericColumns.slice(0, 1).forEach(numCol => {
          recommendations.push({
            title: `${numCol.name} Over Time`,
            type: 'line',
            variables: [dateCol.name, numCol.name],
            description: `Time series analysis (Rule: Date + Numeric → Line chart)`,
            priority: 'high',
            icon: 'trending-up',
            insight: `Analyze temporal patterns and trends in ${numCol.name}`,
            ruleType: 'time-series'
          });
        });
      });
    }

    // Bias-specific visualizations
    categoricalColumns.forEach(col => {
      if (col.uniqueCount > 2 && col.uniqueCount <= 15) {
        recommendations.push({
          title: `${col.name} Bias Analysis`,
          type: 'bias-heatmap',
          variables: [col.name],
          description: `Bias detection visualization (Rule: Multi-category → Bias heatmap)`,
          priority: 'high',
          icon: 'shield-alert',
          insight: `Analyze representation bias and fairness metrics for ${col.name}`,
          ruleType: 'bias-analysis',
          isBiasChart: true
        });
      }
    });

    // Correlation heatmap for multiple numeric variables
    if (numericColumns.length >= 3) {
      recommendations.push({
        title: 'Correlation Matrix',
        type: 'heatmap',
        variables: numericColumns.slice(0, 6).map(col => col.name),
        description: 'Correlation heatmap (Rule: Multiple numeric → Heatmap)',
        priority: 'medium',
        icon: 'grid-3x3',
        insight: 'Identify multicollinearity and variable relationships',
        ruleType: 'correlation-matrix'
      });
    }

    return recommendations.slice(0, 10); // Limit to top 10 recommendations
  } catch (error) {
    console.error('Visualization recommendation error:', error);
    return [];
  }
}
