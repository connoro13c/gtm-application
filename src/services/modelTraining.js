import * as tf from '@tensorflow/tfjs';

export const trainModel = async (data, fields, modelConfig) => {
  try {
    // Prepare data
    const { features, labels } = prepareData(data, fields);
    
    // Split data into training and testing sets
    const splitIndex = Math.floor(data.length * 0.8);
    const trainFeatures = features.slice(0, splitIndex);
    const trainLabels = labels.slice(0, splitIndex);
    const testFeatures = features.slice(splitIndex);
    const testLabels = labels.slice(splitIndex);

    // Create and train model based on config
    const model = await createModel(modelConfig, fields.length);
    await trainModelWithConfig(model, trainFeatures, trainLabels, modelConfig);

    // Calculate metrics
    const predictions = model.predict(tf.tensor2d(testFeatures));
    const accuracy = await calculateAccuracy(predictions, testLabels);
    const additionalMetrics = await calculateAdditionalMetrics(predictions, testLabels);

    return {
      model,
      accuracy,
      additionalMetrics
    };
  } catch (error) {
    console.error('Error training model:', error);
    throw new Error('Failed to train model');
  }
};

export const predictScores = async (model, data, fields) => {
  try {
    const { features } = prepareData(data, fields);
    const predictions = model.predict(tf.tensor2d(features));
    const scores = await predictions.array();

    return data.map((account, index) => ({
      accountId: account.id,
      name: account.name,
      score: scores[index][0],
      features: extractFeatures(account, fields)
    }));
  } catch (error) {
    console.error('Error predicting scores:', error);
    throw new Error('Failed to predict scores');
  }
};

const prepareData = (data, fields) => {
  const features = data.map(account => 
    fields.map(field => normalizeValue(account[field]))
  );
  
  const labels = data.map(account => [account.target ? 1 : 0]);

  return { features, labels };
};

const normalizeValue = (value) => {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    // Convert categorical values to numbers
    // This is a simple approach - in production you'd want more sophisticated encoding
    return hashString(value) / 1000000;
  }
  return 0;
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const createModel = async (modelConfig, numFeatures) => {
  const model = tf.sequential();
  
  switch (modelConfig.type) {
    case 'logistic':
      model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid',
        inputShape: [numFeatures]
      }));
      break;
      
    case 'random_forest':
    case 'gradient_boosting':
      // For these more complex models, we use a neural network approximation
      model.add(tf.layers.dense({
        units: 32,
        activation: 'relu',
        inputShape: [numFeatures]
      }));
      model.add(tf.layers.dropout({ rate: 0.2 }));
      model.add(tf.layers.dense({
        units: 16,
        activation: 'relu'
      }));
      model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
      }));
      break;
      
    default:
      throw new Error(`Unsupported model type: ${modelConfig.type}`);
  }

  model.compile({
    optimizer: tf.train.adam(modelConfig.learningRate || 0.001),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  return model;
};

const trainModelWithConfig = async (model, features, labels, config) => {
  const trainTensors = {
    x: tf.tensor2d(features),
    y: tf.tensor2d(labels)
  };

  await model.fit(trainTensors.x, trainTensors.y, {
    epochs: config.epochs || 50,
    batchSize: config.batchSize || 32,
    validationSplit: 0.2,
    shuffle: true
  });

  trainTensors.x.dispose();
  trainTensors.y.dispose();
};

const calculateAccuracy = async (predictions, labels) => {
  const predArray = await predictions.array();
  const correct = predArray.reduce((sum, pred, i) => 
    sum + (Math.round(pred) === labels[i][0] ? 1 : 0), 0
  );
  return correct / labels.length;
};

const calculateAdditionalMetrics = async (predictions, labels) => {
  const predArray = await predictions.array();
  
  let truePos = 0, falsePos = 0, trueNeg = 0, falseNeg = 0;
  
  predArray.forEach((pred, i) => {
    const predicted = Math.round(pred);
    const actual = labels[i][0];
    
    if (predicted === 1 && actual === 1) truePos++;
    if (predicted === 1 && actual === 0) falsePos++;
    if (predicted === 0 && actual === 0) trueNeg++;
    if (predicted === 0 && actual === 1) falseNeg++;
  });
  
  const precision = truePos / (truePos + falsePos) || 0;
  const recall = truePos / (truePos + falseNeg) || 0;
  
  // Calculate AUC (simplified version)
  const sortedPairs = predArray.map((pred, i) => ({
    pred: pred[0],
    label: labels[i][0]
  })).sort((a, b) => b.pred - a.pred);
  
  let auc = 0;
  let prevX = 0;
  let prevY = 0;
  
  const totalPos = labels.filter(l => l[0] === 1).length;
  const totalNeg = labels.length - totalPos;
  
  sortedPairs.forEach(pair => {
    const curX = pair.label === 0 ? 1/totalNeg : 0;
    const curY = pair.label === 1 ? 1/totalPos : 0;
    auc += (curX + prevX) * (curY + prevY) / 2;
    prevX = curX;
    prevY = curY;
  });

  return {
    precision,
    recall,
    auc
  };
};

const extractFeatures = (account, fields) => {
  const features = {};
  fields.forEach(field => {
    features[field] = normalizeValue(account[field]);
  });
  return features;
}; 