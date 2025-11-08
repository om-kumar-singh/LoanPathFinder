from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import shap
import os

app = Flask(__name__)
CORS(app)

# Global variables for model and explainer
model = None
explainer = None

def load_model():
    """Load the trained model and SHAP explainer"""
    global model, explainer
    try:
        model_path = os.path.join('models', 'loan_model.pkl')
        explainer_path = os.path.join('models', 'shap_explainer.pkl')
        
        if os.path.exists(model_path):
            model = joblib.load(model_path)
        else:
            # Create a dummy model for demo purposes
            from sklearn.ensemble import GradientBoostingRegressor
            model = GradientBoostingRegressor(n_estimators=100, random_state=42)
            # Train on dummy data
            X_dummy = np.random.rand(100, 7)
            y_dummy = np.random.rand(100) * 100
            model.fit(X_dummy, y_dummy)
            print("⚠️  Using dummy model - train a real model for production")
        
        if os.path.exists(explainer_path):
            explainer = joblib.load(explainer_path)
        else:
            # Create a dummy explainer
            X_dummy = np.random.rand(10, 7)
            explainer = shap.TreeExplainer(model)
            print("⚠️  Using dummy explainer - train a real explainer for production")
            
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
        explainer = None

# Load model on startup
load_model()

def preprocess_data(data):
    """Preprocess input data for prediction"""
    # Expected features: income, expenses, creditUtilization, debtRatio, savings, creditScore, employmentYears
    features = [
        'income',
        'expenses',
        'creditUtilization',
        'debtRatio',
        'savings',
        'creditScore',
        'employmentYears'
    ]
    
    # Create DataFrame with proper feature order
    df = pd.DataFrame([{
        'income': data.get('income', 50000),
        'expenses': data.get('expenses', 20000),
        'creditUtilization': data.get('creditUtilization', 30),
        'debtRatio': data.get('debtRatio', 25),
        'savings': data.get('savings', 10000),
        'creditScore': data.get('creditScore', 720),
        'employmentYears': data.get('employmentYears', 5)
    }])
    
    return df

def calculate_risk_category(score):
    """Determine risk category based on score"""
    if score >= 75:
        return 'Low'
    elif score >= 50:
        return 'Moderate'
    else:
        return 'High'

def estimate_apr(score, risk_category):
    """Estimate APR based on score and risk"""
    base_apr = {
        'Low': 3.5,
        'Moderate': 6.0,
        'High': 9.5
    }
    
    # Adjust based on score within category
    adjustment = (100 - score) * 0.05
    return base_apr.get(risk_category, 6.0) + adjustment

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Preprocess data
        df = preprocess_data(data)
        
        if model is None:
            # Fallback calculation if model not loaded
            score = calculate_fallback_score(data)
            explanation = generate_fallback_explanation(data)
            risk_category = calculate_risk_category(score)
            estimated_apr = estimate_apr(score, risk_category)
        else:
            # Make prediction
            prediction = model.predict(df)[0]
            score = max(0, min(100, float(prediction)))  # Clamp between 0-100
            
            # Generate SHAP explanation
            if explainer is not None:
                shap_values = explainer.shap_values(df)
                if isinstance(shap_values, list):
                    shap_values = shap_values[0]
                
                explanation = {}
                feature_names = [
                    'Stable Income History',
                    'Monthly Expenses',
                    'Credit Utilization',
                    'Debt-to-Income Ratio',
                    'Savings Buffer',
                    'Credit Score',
                    'Employment Stability'
                ]
                
                for i, feature in enumerate(feature_names):
                    if i < len(shap_values):
                        explanation[feature] = float(shap_values[i])
            else:
                explanation = generate_fallback_explanation(data)
            
            risk_category = calculate_risk_category(score)
            estimated_apr = estimate_apr(score, risk_category)
        
        return jsonify({
            'prediction': round(score, 2),
            'explanation': explanation,
            'riskCategory': risk_category,
            'estimatedAPR': round(estimated_apr, 2)
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

def calculate_fallback_score(data):
    """Fallback score calculation when model is not available"""
    income = data.get('income', 50000)
    expenses = data.get('expenses', 20000)
    credit_util = data.get('creditUtilization', 30)
    debt_ratio = data.get('debtRatio', 25)
    savings = data.get('savings', 10000)
    credit_score = data.get('creditScore', 720)
    employment = data.get('employmentYears', 5)
    
    # Simple scoring algorithm
    score = 50  # Base score
    
    # Income stability (0-20 points)
    if income > 40000:
        score += 15
    elif income > 30000:
        score += 10
    
    # Credit score (0-25 points)
    if credit_score >= 750:
        score += 25
    elif credit_score >= 700:
        score += 18
    elif credit_score >= 650:
        score += 10
    
    # Debt ratio (0-15 points)
    if debt_ratio < 20:
        score += 15
    elif debt_ratio < 30:
        score += 10
    elif debt_ratio < 40:
        score += 5
    
    # Credit utilization (0-15 points)
    if credit_util < 30:
        score += 15
    elif credit_util < 50:
        score += 8
    
    # Savings buffer (0-10 points)
    if savings > 20000:
        score += 10
    elif savings > 10000:
        score += 6
    elif savings > 5000:
        score += 3
    
    # Employment stability (0-10 points)
    if employment >= 5:
        score += 10
    elif employment >= 3:
        score += 6
    elif employment >= 1:
        score += 3
    
    # Expenses impact (negative)
    expense_ratio = (expenses / income) * 100 if income > 0 else 50
    if expense_ratio > 60:
        score -= 15
    elif expense_ratio > 50:
        score -= 10
    
    return max(0, min(100, score))

def generate_fallback_explanation(data):
    """Generate fallback SHAP-like explanation"""
    income = data.get('income', 50000)
    credit_util = data.get('creditUtilization', 30)
    debt_ratio = data.get('debtRatio', 25)
    credit_score = data.get('creditScore', 720)
    savings = data.get('savings', 10000)
    employment = data.get('employmentYears', 5)
    expenses = data.get('expenses', 20000)
    
    explanation = {}
    
    # Stable Income History
    if income > 40000:
        explanation['Stable Income History'] = 28
    elif income > 30000:
        explanation['Stable Income History'] = 18
    else:
        explanation['Stable Income History'] = 8
    
    # Credit Utilization
    if credit_util > 70:
        explanation['High Credit Utilization'] = -37
    elif credit_util > 50:
        explanation['Moderate Credit Utilization'] = -22
    else:
        explanation['Low Credit Utilization'] = 15
    
    # Debt-to-Income Ratio
    if debt_ratio < 20:
        explanation['Low Debt-to-Income Ratio'] = 22
    elif debt_ratio < 30:
        explanation['Moderate Debt-to-Income Ratio'] = 10
    else:
        explanation['High Debt-to-Income Ratio'] = -18
    
    # Credit Score
    if credit_score >= 750:
        explanation['Good Credit Score'] = 35
    elif credit_score >= 700:
        explanation['Fair Credit Score'] = 22
    else:
        explanation['Poor Credit Score'] = -15
    
    # Employment Stability
    if employment >= 5:
        explanation['Employment Stability'] = 18
    elif employment >= 3:
        explanation['Employment Stability'] = 12
    else:
        explanation['Employment Stability'] = 5
    
    # Savings Buffer
    if savings > 20000:
        explanation['Savings Buffer'] = 15
    elif savings > 10000:
        explanation['Savings Buffer'] = 9
    else:
        explanation['Savings Buffer'] = 3
    
    return explanation

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'explainer_loaded': explainer is not None
    })

if __name__ == '__main__':
    print("🚀 Flask AI Service starting on port 5001")
    print("📊 Model status:", "Loaded" if model else "Using fallback")
    app.run(debug=True, host='0.0.0.0', port=5001)

