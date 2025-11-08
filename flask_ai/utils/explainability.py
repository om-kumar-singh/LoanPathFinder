"""
SHAP explainability utilities
"""
import shap
import numpy as np
import pandas as pd

def create_shap_explainer(model, X_train, model_type='tree'):
    """
    Create SHAP explainer based on model type
    
    Args:
        model: Trained ML model
        X_train: Training data
        model_type: Type of model ('tree', 'linear', 'kernel')
        
    Returns:
        SHAP explainer object
    """
    if model_type == 'tree':
        explainer = shap.TreeExplainer(model)
    elif model_type == 'linear':
        explainer = shap.LinearExplainer(model, X_train)
    else:
        # Use KernelExplainer as fallback
        explainer = shap.KernelExplainer(model.predict, X_train[:100])
    
    return explainer

def get_shap_values(explainer, X, feature_names=None):
    """
    Get SHAP values for given data
    
    Args:
        explainer: SHAP explainer
        X: Data to explain
        feature_names: Optional list of feature names
        
    Returns:
        Dictionary of feature names and SHAP values
    """
    shap_values = explainer.shap_values(X)
    
    # Handle different SHAP output formats
    if isinstance(shap_values, list):
        shap_values = shap_values[0]
    
    if len(shap_values.shape) > 1:
        shap_values = shap_values[0]
    
    # Create dictionary
    if feature_names is None:
        feature_names = [f'Feature_{i}' for i in range(len(shap_values))]
    
    explanation = dict(zip(feature_names, shap_values))
    
    return explanation

def format_shap_explanation(shap_dict, top_n=10):
    """
    Format SHAP explanation for display
    
    Args:
        shap_dict: Dictionary of feature names and SHAP values
        top_n: Number of top features to return
        
    Returns:
        Sorted list of (feature, value) tuples
    """
    sorted_features = sorted(
        shap_dict.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )
    
    return sorted_features[:top_n]

