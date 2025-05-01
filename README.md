# HeartGuard - Cardiovascular Risk Assessment System

![HeartGuard Logo](https://github.com/user-attachments/assets/4d342ff3-7173-4f58-901d-4c7dc8c362d0)

HeartGuard is a machine learning-powered web application that assesses cardiovascular disease risk using multiple predictive models and provides personalized health recommendations.

## Features

- 🩺 **Comprehensive Risk Assessment** using 4 ML models
- 📊 **Interactive Dashboard** with visual analytics
- 📝 **Detailed PDF Reports** with medical recommendations
- 🔐 **Secure User Authentication**
- 📱 **Responsive Design** works on all devices
- 🏥 **Doctor Appointment Booking** system

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Chart.js
- React Router
- Framer Motion (animations)

### Backend
- Node.js
- Express.js
- JWT Authentication
- PDFKit (report generation)
- Chart.js (server-side rendering)

### Machine Learning
- Python
- Scikit-learn
- Logistic Regression
- Random Forest
- SVM
- KNN

---

## Screenshots

![Screenshot 2025-04-28 051559](https://github.com/user-attachments/assets/07c2963e-b4d9-4c54-bd71-2f40f50b0e08)
![Screenshot 2025-04-28 051625](https://github.com/user-attachments/assets/0af9521b-3605-4fad-954f-ffe7a467542d)
![Screenshot 2025-04-28 051750](https://github.com/user-attachments/assets/2b7443ff-19de-4940-91d3-02e2b9c6b360)
![Screenshot 2025-04-28 053333](https://github.com/user-attachments/assets/6fe53e5c-13de-4b0b-95f5-af7a1b7e299c)
![Screenshot 2025-04-28 053228](https://github.com/user-attachments/assets/7dcf6eed-b55d-4ace-a62b-2b00fed5f7fc)
![Screenshot 2025-04-28 054200](https://github.com/user-attachments/assets/79b1b509-84ac-4b17-97a1-84d8ada57313)
![Screenshot 2025-04-28 054226](https://github.com/user-attachments/assets/b1cce48d-8f88-44e6-82d6-d523417fd6e3)
![Screenshot 2025-04-28 054316](https://github.com/user-attachments/assets/24d5e674-f24a-4f55-8ad9-1cfce74301d4)

---

## 🧪 Machine Learning Pipeline

1. **Dataset**: Cleveland Heart Disease Dataset
2. **Preprocessing Steps**:
   - Remove duplicates
   - Handle missing values
   - Encode categorical features
   - Convert data types
   - Normalize / standardize numerical values
   - Detect and treat outliers
3. **Model Training**:
   - Models: Logistic Regression, Random Forest, Support Vector Machine, K-Nearest Neighbors
   - Evaluation Metrics: Accuracy, ROC AUC Score, Confusion Matrix
4. **Deployment**:
   - Served via Flask/FastAPI API (`/predict`)
   - Accepts JSON input and returns:
     ```json
     {
       "prediction": 1,
       "probability": 0.87,
       "model": "Random Forest",
       "roc_curve": "base64 image",
       "confusion_matrix": "base64 image"
     }
     ```

---

## 👤 User Portal Workflow

- 🔘 User selects "User" on login
- 📝 Fills out medical form (age, sex, blood pressure, cholesterol, etc.)
- 🧠 Data sent to ML API → Model returns prediction & performance
- 📈 Display results, ROC curve, confusion matrix
- 🧾 PDF report generated and available for download
- 📅 If risk is high, a "Book Appointment" button appears:
  - User selects a doctor (filter by name, gender, specialization, experience)
  - Chooses date and time → Appointment booked & saved in DB

---

## Performance Metrices

![all_models_roc](https://github.com/user-attachments/assets/8578a05f-b9ae-4719-9304-240fb044d5f7)
![model_comparison](https://github.com/user-attachments/assets/9d285372-0d19-47ef-bc77-2e0a5b529398) 
![random_forest_cm](https://github.com/user-attachments/assets/e2f3bdbb-986e-4238-b231-2f3f65f47ad7)
![logistic_regression_cm](https://github.com/user-attachments/assets/9791f2be-0589-4f40-94c1-21a415859ab7)
![knn_cm](https://github.com/user-attachments/assets/1164675d-4095-48d8-a6c7-052e85a00949)
![svm_cm](https://github.com/user-attachments/assets/6d63a655-cc3f-4efe-8f0b-ab3a78e72b9f)

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations
npm start
```

### Frontend Setup
```
cd frontend
npm install
# Start development server
npm start
```

### Ml Model Setup
```
cd ml_model

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Train models
python train_models.py
```

### Backend(.env)
```
MONGODB_URI=mongodb://localhost:27017/heartguard
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:3000
```

### Frontend(.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_ANALYTICS_ID=UA-XXXXX-Y
```
---

```
heartguard/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Business logic
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # External services
│   ├── utils/            # Utility functions
│   ├── app.js            # Express app
│   └── server.js         # Server entry point
│
├── frontend/
│   ├── public/           # Static assets
│   └── src/
│       ├── assets/       # Images, fonts
│       ├── components/   # Reusable components
│       ├── context/      # React contexts
│       ├── hooks/        # Custom hooks
│       ├── pages/        # Application pages
│       ├── services/     # API services
│       ├── styles/       # Global styles
│       ├── App.js        # Main component
│       └── index.js      # Entry point
│
└── ml_model/
    ├── data/             # Training datasets
    ├── models/           # Saved models
    ├── notebooks/        # Jupyter notebooks
    ├── visualizations/   # Performance charts
    ├── train_models.py   # Training script
    └── predict.py        # Prediction script
```
---

## Implemented Models

### Logistic Regression
- Accuracy: 85.2%
- Precision: 0.83
- Recall: 0.87

### Random Forest
- Accuracy: 88.7%
- Precision: 0.89
- Recall: 0.88

### Support Vector Machine
- Accuracy: 86.5%
- Precision: 0.85
- Recall: 0.87

### K-Nearest Neighbors
- Accuracy: 83.9%
- Precision: 0.82
- Recall: 0.85

### Ensemble Method
- Weighted voting system
- Primary prediction based on model confidence
- Combined accuracy: 90.1%

Created with ❤️ by Shivansh Tiwari


