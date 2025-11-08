# 🚀 Starting Flask AI Service

## Quick Start

```bash
cd flask_ai
python app.py
```

## Expected Output

```
🚀 Flask AI Service starting on port 5001
📊 Model status: Using fallback
 * Running on http://0.0.0.0:5001
 * Running on http://127.0.0.1:5001
```

## Testing the Service

Once running, test the health endpoint:

```bash
curl http://localhost:5001/health
```

Or open in browser: http://localhost:5001/health

## Note

The app uses a fallback scoring algorithm if no trained model is found. This is normal for initial setup. To use a real ML model:

1. Train your model using the data in `flask_ai/data/synthetic_financial_data.csv`
2. Save the model to `flask_ai/models/loan_model.pkl`
3. Save the SHAP explainer to `flask_ai/models/shap_explainer.pkl`

The fallback algorithm will work fine for development and testing!

