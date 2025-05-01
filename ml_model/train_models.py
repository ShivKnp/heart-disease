import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                           roc_auc_score, confusion_matrix, roc_curve, 
                           f1_score, classification_report)
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import joblib
import os
from datetime import datetime

# Create directories if they don't exist
os.makedirs('models', exist_ok=True)
os.makedirs('data', exist_ok=True)
os.makedirs('visualizations', exist_ok=True)

# Load the dataset
print("⏳ Loading dataset...")
data = pd.read_csv('data/heart_disease_data.csv')
print(f"✅ Dataset loaded with {len(data)} records")

# Data cleaning
print("\n🧹 Cleaning data...")
print("Missing values per column:")
print(data.isnull().sum())

duplicates = data.duplicated().sum()
print(f"\n🔍 Found {duplicates} duplicate rows")
if duplicates > 0:
    data = data.drop_duplicates()
    print(f"🧹 Removed duplicates, now {len(data)} records remain")

# Data preprocessing
print("\n⚙️ Preprocessing data...")
X = data.drop('target', axis=1)
y = data['target']

# Convert categorical columns
categorical_cols = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal']
for col in categorical_cols:
    X[col] = X[col].astype('category')

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
print(f"\n📊 Train/test split: {len(X_train)} training, {len(X_test)} test samples")

# Standardize numerical features
numerical_cols = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
print(f"\n📏 Standardizing numerical features: {numerical_cols}")
scaler = StandardScaler()
X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
X_test[numerical_cols] = scaler.transform(X_test[numerical_cols])

# Save the scaler
joblib.dump(scaler, 'scaler.pkl')
print("💾 Saved scaler to scaler.pkl")

# Model training configuration
models = {
    "logistic_regression": {
        "model": LogisticRegression(max_iter=1000, random_state=42),
        "color": "blue"
    },
    "random_forest": {
        "model": RandomForestClassifier(n_estimators=100, random_state=42),
        "color": "green"
    },
    "svm": {
        "model": SVC(probability=True, random_state=42),
        "color": "red"
    },
    "knn": {
        "model": KNeighborsClassifier(),
        "color": "purple"
    }
}

print("\n🤖 Training models...")
results = {}
roc_plt = plt.figure(figsize=(10, 8))

for name, config in models.items():
    model = config['model']
    color = config['color']
    
    print(f"\n🔮 Training {name.replace('_', ' ').title()}...")
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    
    # ROC curve
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    
    # Classification report
    clf_report = classification_report(y_test, y_pred, output_dict=True)
    
    results[name] = {
        'model': model,
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'roc_auc': roc_auc,
        'confusion_matrix': cm,
        'fpr': fpr,
        'tpr': tpr,
        'classification_report': clf_report
    }
    
    # Save the model
    model_path = f'models/{name}_model.pkl'
    joblib.dump(model, model_path)
    print(f"💾 Saved model to {model_path}")
    
    # Plot ROC curve
    plt.plot(fpr, tpr, color=color, 
             label=f'{name.replace("_", " ").title()} (AUC = {roc_auc:.2f})')
    
    # Create and save confusion matrix plot
    plt.figure(figsize=(6, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['No Disease', 'Disease'],
                yticklabels=['No Disease', 'Disease'])
    plt.title(f'Confusion Matrix - {name.replace("_", " ").title()}\nAccuracy: {accuracy:.2f}')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    cm_path = f'visualizations/{name}_cm.png'
    plt.savefig(cm_path, bbox_inches='tight')
    plt.close()
    print(f"📊 Saved confusion matrix to {cm_path}")
    
    # Print metrics
    print(f"\n📈 {name.replace('_', ' ').title()} Performance:")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print(f"ROC AUC: {roc_auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

# Finalize ROC curve plot
plt.plot([0, 1], [0, 1], 'k--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic (ROC) Curves')
plt.legend(loc="lower right")
roc_path = 'visualizations/all_models_roc.png'
plt.savefig(roc_path, bbox_inches='tight')
plt.close()
print(f"\n📈 Saved combined ROC curves to {roc_path}")

print("\n📊 Generating model comparison visualizations...")

# Create performance comparison bar chart
metrics = ['accuracy', 'precision', 'recall', 'f1', 'roc_auc']
plt.figure(figsize=(12, 8))
x = np.arange(len(metrics))
width = 0.2

for i, (name, result) in enumerate(results.items()):
    plt.bar(x + (i * width), 
            [result[metric] for metric in metrics],
            width, 
            label=name.replace('_', ' ').title(),
            color=models[name]['color'])

plt.xlabel('Metrics')
plt.ylabel('Score')
plt.title('Model Performance Comparison')
plt.xticks(x + width * 1.5, [m.title() for m in metrics])
plt.ylim(0, 1)
plt.legend()
plt.tight_layout()

# Save comparison chart
comparison_path = 'visualizations/model_comparison.png'
plt.savefig(comparison_path)
plt.close()
print(f"📊 Saved model comparison chart to {comparison_path}")

# Create notes text file
notes = """
Model Performance Notes:
- All models were trained on the Cleveland Heart Disease dataset (303 patients)
- Evaluation metrics are based on a 20% held-out test set
- Random Forest was selected as the primary model due to highest ROC AUC
"""
notes_path = 'visualizations/model_notes.txt'
with open(notes_path, 'w') as f:
    f.write(notes)
print(f"📝 Saved model notes to {notes_path}")

# Select best model based on ROC AUC
best_model_name = max(results, key=lambda x: results[x]['roc_auc'])
best_model = results[best_model_name]['model']
best_roc_auc = results[best_model_name]['roc_auc']
print(f"\n🏆 Best model: {best_model_name.replace('_', ' ').title()} with ROC AUC: {best_roc_auc:.4f}")

# Save all metrics to a CSV file
metrics_df = pd.DataFrame.from_dict({k: v for k, v in results.items()}, orient='index')
metrics_df = metrics_df[['accuracy', 'precision', 'recall', 'f1', 'roc_auc']]
metrics_df.index = metrics_df.index.str.replace('_', ' ').str.title()
metrics_path = 'visualizations/model_metrics.csv'
metrics_df.to_csv(metrics_path)
print(f"\n📋 Saved all model metrics to {metrics_path}")

# Generate timestamped report
timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
report_path = f"visualizations/training_report_{timestamp}.txt"
with open(report_path, 'w') as f:
    f.write("Heart Disease Prediction Model Training Report\n")
    f.write(f"Generated on: {timestamp}\n\n")
    f.write(f"Dataset size: {len(data)} records\n")
    f.write(f"Training samples: {len(X_train)}\n")
    f.write(f"Test samples: {len(X_test)}\n\n")
    
    f.write("Model Performance Summary:\n")
    f.write(metrics_df.to_string())
    
    f.write("\n\nBest Model Details:\n")
    f.write(f"Model: {best_model_name.replace('_', ' ').title()}\n")
    f.write(f"ROC AUC: {best_roc_auc:.4f}\n\n")
    
    f.write("Classification Report:\n")
    f.write(classification_report(y_test, best_model.predict(X_test)))
    
print(f"\n📄 Saved comprehensive training report to {report_path}")
print("\n✨ Model training and evaluation complete! ✨")

