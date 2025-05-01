import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PredictionForm from './PredictionForm';
import PredictionResult from './PredictionResult';
import Header from '../common/Header';

const Dashboard = () => {
  const [prediction, setPrediction] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePredictionComplete = (result) => {
    if (result && result.predictions) {
      setPrediction(result.predictions);
    } else {
      console.error('Invalid prediction response:', result);
      setPrediction(null);
      alert('Received invalid prediction data. Please try again.');
    }
  };

  useEffect(() => {
    console.log('Current prediction data:', prediction);
  }, [prediction]);

  const handleNewPrediction = () => {
    setPrediction(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-fade-in">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
          {/* Dashboard Header */}
          <div className="bg-primary p-6">
            <h1 className="text-2xl font-bold text-white">Heart Disease Risk Assessment</h1>
            <p className="text-blue-100">
              Welcome back, <span className="font-medium">{user?.name}</span>
            </p>
          </div>

          {/* Prediction Area */}
          <div className="p-6">
            {prediction ? (
              <PredictionResult 
                prediction={prediction} 
                onNewPrediction={handleNewPrediction} 
              />
            ) : (
              <PredictionForm onPredictionComplete={handlePredictionComplete} />
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={handleNewPrediction}
              className="px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-blue-50 transition-colors"
            >
              New Assessment
            </button>
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;