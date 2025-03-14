from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

@app.route('/api/suggest-mappings', methods=['POST'])
def suggest_mappings():
    """Suggest field mappings between two datasets"""
    data = request.json
    source_fields = data.get('sourceFields', [])
    target_fields = data.get('targetFields', [])
    
    # Create a vectorizer to convert field names to vectors
    vectorizer = TfidfVectorizer()
    all_fields = source_fields + target_fields
    vectors = vectorizer.fit_transform(all_fields)
    
    # Calculate similarity between source and target fields
    source_vectors = vectors[:len(source_fields)]
    target_vectors = vectors[len(source_fields):]
    
    similarity_matrix = cosine_similarity(source_vectors, target_vectors)
    
    # Find best matches
    suggested_mappings = {}
    for i, source_field in enumerate(source_fields):
        best_match_idx = np.argmax(similarity_matrix[i])
        score = similarity_matrix[i][best_match_idx]
        if score > 0.5:  # Only suggest if similarity is above threshold
            suggested_mappings[source_field] = {
                'targetField': target_fields[best_match_idx],
                'confidence': float(score)
            }
    
    return jsonify({
        'success': True,
        'mappings': suggested_mappings
    })

@app.route('/api/match-identifiers', methods=['POST'])
def match_identifiers():
    """Match records across datasets using fuzzy matching"""
    data = request.json
    datasets = data.get('datasets', [])
    identifier_field = data.get('identifierField', '')
    
    # Implementation would use fuzzy matching algorithms
    # to identify potential matches across datasets
    
    # Mock response for now
    return jsonify({
        'success': True,
        'matches': [
            {'confidence': 0.95, 'records': {'dataset1': 'Acme Inc', 'dataset2': 'Acme Incorporated'}},
            {'confidence': 0.87, 'records': {'dataset1': 'XYZ Corp', 'dataset2': 'XYZ Corporation'}}
        ],
        'unmatchedRecords': [
            {'dataset': 'dataset1', 'value': 'Unknown Company'}
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)