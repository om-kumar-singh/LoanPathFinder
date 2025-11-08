"""
Data preprocessing utilities for loan assessment
"""
import pandas as pd
import numpy as np

def clean_financial_data(df):
    """
    Clean and preprocess financial data
    
    Args:
        df: DataFrame with financial features
        
    Returns:
        Cleaned DataFrame
    """
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Handle missing values
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Remove outliers (using IQR method)
    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
    
    return df

def normalize_features(df, feature_cols):
    """
    Normalize features to 0-1 range
    
    Args:
        df: DataFrame
        feature_cols: List of column names to normalize
        
    Returns:
        DataFrame with normalized features
    """
    df_normalized = df.copy()
    
    for col in feature_cols:
        if col in df.columns:
            min_val = df[col].min()
            max_val = df[col].max()
            if max_val - min_val > 0:
                df_normalized[col] = (df[col] - min_val) / (max_val - min_val)
    
    return df_normalized

def create_features(df):
    """
    Create derived features from raw data
    
    Args:
        df: DataFrame with raw financial data
        
    Returns:
        DataFrame with additional features
    """
    df_features = df.copy()
    
    # Debt-to-income ratio (if not already present)
    if 'income' in df.columns and 'expenses' in df.columns:
        if 'debtRatio' not in df.columns:
            df_features['debtRatio'] = (df['expenses'] / df['income']) * 100
    
    # Savings ratio
    if 'income' in df.columns and 'savings' in df.columns:
        df_features['savingsRatio'] = (df['savings'] / df['income']) * 100
    
    # Credit utilization score (inverse)
    if 'creditUtilization' in df.columns:
        df_features['creditUtilizationScore'] = 100 - df['creditUtilization']
    
    return df_features

