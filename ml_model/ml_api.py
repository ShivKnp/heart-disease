from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from io import BytesIO
import os
import base64
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO

app = Flask(__name__)

# Load models and scaler
print("⏳ Loading models and scaler...")
scaler = joblib.load('scaler.pkl')
models = {
    "logistic_regression": joblib.load('models/logistic_regression_model.pkl'),
    "random_forest": joblib.load('models/random_forest_model.pkl'),
    "svm": joblib.load('models/svm_model.pkl'),
    "knn": joblib.load('models/knn_model.pkl')
}
print("✅ Models loaded successfully")

# Create visualizations directory if it doesn't exist
os.makedirs('api_visualizations', exist_ok=True)

def generate_visualizations(y_true, y_pred, y_prob, model_name):
    vis_data = {}
    
    # Confusion Matrix
    plt.figure(figsize=(6, 6))
    cm = confusion_matrix(y_true, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=['No Disease', 'Disease'],
                yticklabels=['No Disease', 'Disease'])
    plt.title(f'Confusion Matrix - {model_name}')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    
    # Save to buffer
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    vis_data['confusion_matrix'] = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    
    # ROC Curve
    plt.figure(figsize=(8, 6))
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    roc_auc = roc_auc_score(y_true, y_prob)
    plt.plot(fpr, tpr, label=f'ROC curve (AUC = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title(f'ROC Curve - {model_name}')
    plt.legend(loc="lower right")
    
    # Save to buffer
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    vis_data['roc_curve'] = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    
    return vis_data

    

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Validate input
        required_fields = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
                          'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Convert input to DataFrame
        input_data = pd.DataFrame([[
            data['age'],
            data['sex'],
            data['cp'],
            data['trestbps'],
            data['chol'],
            data['fbs'],
            data['restecg'],
            data['thalach'],
            data['exang'],
            data['oldpeak'],
            data['slope'],
            data['ca'],
            data['thal']
        ]], columns=required_fields)
        
        # Standardize numerical features
        num_cols = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
        input_data[num_cols] = scaler.transform(input_data[num_cols])
        
        # Get predictions from all models
        predictions = {}
        for name, model in models.items():
            proba = model.predict_proba(input_data)[0][1]
            pred = int(proba >= 0.5)
            predictions[name] = {
                'prediction': pred,
                'probability': float(proba),
                'model_name': name.replace('_', ' ').title()
            }
        
        # Generate visualizations if ground truth is provided
        visualizations = {}
        if 'target' in data:  # If ground truth is provided
            for name, model in models.items():
                y_pred = model.predict(input_data)
                y_prob = model.predict_proba(input_data)[:, 1]
                visualizations[name] = generate_visualizations(
                    [data['target']], y_pred, y_prob, name)
        
        # Prepare response
        response = {
            'primary_prediction': predictions.get('random_forest', next(iter(predictions.values()))),
            'all_predictions': predictions,
            'visualizations': visualizations  # This includes the confusion matrices and ROC curves
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/model_performance', methods=['GET'])
def model_performance():
    """Endpoint to get model performance metrics"""
    try:
        # In a real app, you would load these from your evaluation results
        metrics = {
            "logistic_regression": {
                "accuracy": 0.85,
                "precision": 0.83,
                "recall": 0.88,
                "f1": 0.85,
                "roc_auc": 0.92
            },
            "random_forest": {
                "accuracy": 0.88,
                "precision": 0.86,
                "recall": 0.91,
                "f1": 0.88,
                "roc_auc": 0.94
            },
            "svm": {
                "accuracy": 0.82,
                "precision": 0.81,
                "recall": 0.84,
                "f1": 0.82,
                "roc_auc": 0.89
            },
            "knn": {
                "accuracy": 0.80,
                "precision": 0.79,
                "recall": 0.82,
                "f1": 0.80,
                "roc_auc": 0.87
            }
        }
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    from sklearn.metrics import confusion_matrix, roc_curve, roc_auc_score
    app.run(host='0.0.0.0', port=5000, debug=True)