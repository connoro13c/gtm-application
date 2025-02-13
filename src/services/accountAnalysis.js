import { trainModel, predictScores } from './modelTraining';

export const runAccountAnalysis = async (data, fields, modelConfig, weights) => {
  try {
    // Train the model and get predictions
    const { model, accuracy, additionalMetrics } = await trainModel(data, fields, modelConfig);
    const scores = await predictScores(model, data, fields);

    // Calculate propensity distribution
    const summary = {
      totalAccounts: scores.length,
      highPropensity: scores.filter(s => s.score >= 0.7).length,
      mediumPropensity: scores.filter(s => s.score >= 0.4 && s.score < 0.7).length,
      lowPropensity: scores.filter(s => s.score < 0.4).length
    };

    // Calculate feature importance and top factors for each account
    const enrichedScores = scores.map(score => {
      const topFactors = calculateTopFactors(score.features, weights);
      return {
        ...score,
        topFactors
      };
    });

    // Generate data quality warnings
    const warnings = generateDataWarnings(data, fields);

    return {
      accuracy,
      additionalMetrics,
      scores: enrichedScores,
      summary,
      warnings
    };
  } catch (error) {
    console.error('Error running account analysis:', error);
    throw new Error('Failed to complete account analysis');
  }
};

const calculateTopFactors = (features, weights) => {
  // Convert features and weights into impact scores
  const impacts = Object.entries(features).map(([name, value]) => {
    const weight = weights[name] || 0;
    const impact = value * weight;
    return { name, impact };
  });

  // Sort by impact and return top 3
  return impacts
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 3);
};

const generateDataWarnings = (data, fields) => {
  const warnings = [];

  // Check for missing values
  fields.forEach(field => {
    const missingCount = data.filter(row => !row[field]).length;
    const missingPercentage = (missingCount / data.length) * 100;
    
    if (missingPercentage > 20) {
      warnings.push({
        type: 'missing_data',
        field,
        message: `${field} is missing in ${missingPercentage.toFixed(1)}% of accounts`
      });
    }
  });

  // Check for data quality issues
  fields.forEach(field => {
    const uniqueValues = new Set(data.map(row => row[field]));
    if (uniqueValues.size === 1) {
      warnings.push({
        type: 'low_variance',
        field,
        message: `${field} has the same value across all accounts`
      });
    }
  });

  // Check for sufficient data
  if (data.length < 100) {
    warnings.push({
      type: 'sample_size',
      message: 'Small dataset size may affect model accuracy'
    });
  }

  return warnings;
}; 