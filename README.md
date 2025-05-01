# HeartGuard - Cardiovascular Risk Assessment System

![HeartGuard Logo](https://via.placeholder.com/150/e74c3c/ffffff?text=HG) 
*(Replace with your actual logo)*

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-green.svg)](https://nodejs.org/)

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

## Screenshots

| Login Screen | Dashboard | Report |
|-------------|-----------|--------|
| ![Login](https://via.placeholder.com/300x200/e74c3c/ffffff?text=Login) | ![Dashboard](https://via.placeholder.com/300x200/2ecc71/ffffff?text=Dashboard) | ![Report](https://via.placeholder.com/300x200/3498db/ffffff?text=Report) |

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
