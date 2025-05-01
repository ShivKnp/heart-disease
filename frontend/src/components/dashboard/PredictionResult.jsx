import { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement);

const PredictionResult = ({ prediction, onNewPrediction }) => {
  const [showAppointment, setShowAppointment] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [activeTab, setActiveTab] = useState('results');

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "12 years",
      gender: "Female",
      phone: "+1 (555) 123-4567",
      availableDays: ["Monday", "Wednesday", "Friday"]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Cardiovascular Surgeon",
      experience: "8 years",
      gender: "Male",
      phone: "+1 (555) 987-6543",
      availableDays: ["Tuesday", "Thursday"]
    },
    {
      id: 3,
      name: "Dr. Priya Patel",
      specialty: "Preventive Cardiology",
      experience: "5 years",
      gender: "Female",
      phone: "+1 (555) 456-7890",
      availableDays: ["Monday", "Wednesday", "Saturday"]
    }
  ];

  const handleBookAppointment = () => {
    console.log({
      doctor: selectedDoctor,
      date: appointmentDate,
      time: appointmentTime
    });
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setShowAppointment(false);
    }, 3000);
  };

  const modelData = Object.entries(prediction.all_predictions).map(([key, value]) => ({
    name: value.model_name,
    probability: value.probability * 100,
    prediction: value.prediction ? 'High Risk' : 'Low Risk'
  }));

  const chartData = {
    labels: modelData.map(model => model.name),
    datasets: [{
      data: modelData.map(model => model.probability),
      backgroundColor: [
        '#FF6384', // Knn
        '#36A2EB', // Logistic Regression
        '#FFCE56', // Random Forest
        '#4BC0C0'  // SVM
      ],
      borderColor: [
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF'
      ],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(2)}% (${modelData[context.dataIndex].prediction})`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const downloadReport = () => {
    if (prediction.reportUrl) {
      const downloadUrl = `http://localhost:5001${prediction.reportUrl}`;
      window.open(downloadUrl, '_blank');
    }
  };

  const imageBasePath = "http://localhost:5001/visualizations";
  const models = ['logistic_regression', 'random_forest', 'svm', 'knn'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Risk Summary Card */}
      <div className={`mb-8 p-6 rounded-xl shadow-md border-l-8 ${
        prediction.primary_prediction.prediction 
          ? 'border-red-500 bg-red-50' 
          : 'border-green-500 bg-green-50'
      }`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {prediction.primary_prediction.prediction ? 'High Risk Detected' : 'Low Risk Detected'}
        </h2>
        <p className="text-gray-700 mb-4">
          Based on our analysis using {prediction.primary_prediction.model_name}, your risk of cardiovascular disease is:
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-4xl font-bold ${
            prediction.primary_prediction.prediction ? 'text-red-600' : 'text-green-600'
          }`}>
            {(prediction.primary_prediction.probability * 100).toFixed(2)}%
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            prediction.primary_prediction.prediction 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {prediction.primary_prediction.prediction ? 'High Risk' : 'Low Risk'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'results'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'metrics'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('metrics')}
        >
          Performance Metrics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'results' && (
        <div className="space-y-8">
          {/* All Models Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(prediction.all_predictions).map(([key, model]) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{model.model_name}</h3>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    model.prediction ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {model.prediction ? 'High Risk' : 'Low Risk'}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {(model.probability * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Model Predictions Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Model Predictions Comparison</h3>
            <div className="h-64">
              <Bar 
                data={{
                  labels: modelData.map(model => model.name),
                  datasets: [{
                    label: 'Risk Probability (%)',
                    data: modelData.map(model => model.probability),
                    backgroundColor: '#3498db'
                  }]
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

{activeTab === 'metrics' && (
  <div className="space-y-6">
    {/* Model Comparison */}
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Model Performance Comparison</h3>
      <div className="flex justify-center">
        <img
          src={`${imageBasePath}/model_comparison.png`}
          alt="Model performance comparison"
          className="w-full max-w-xl rounded-lg border border-gray-200"
        />
      </div>
    </div>

    {/* Combined ROC Curve */}
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">ROC Curves</h3>
      <div className="flex justify-center">
        <img
          src={`${imageBasePath}/all_models_roc.png`}
          alt="All models ROC curves"
          className="w-full max-w-xl rounded-lg border border-gray-200"
        />
      </div>
    </div>

    {/* Individual Model Metrics - Only Confusion Matrices */}
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Model Confusion Matrices</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {models.map(model => (
          <div key={model} className="space-y-2">
            <h4 className="text-md sm:text-lg font-medium text-gray-700 text-center">
              {/* {model.replace(/_/g, ' ').toUpperCase()} */}
            </h4>
            <div className="flex justify-center">
              <img
                src={`${imageBasePath}/${model}_cm.png`}
                alt={`${model} confusion matrix`}
                className="w-full max-w-xs sm:max-w-none rounded-lg border border-gray-200"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      {/* Doctor Appointment Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Consult a Specialist</h2>
          
          {!showAppointment ? (
            <button
              onClick={() => setShowAppointment(true)}
              className="w-full py-3 px-4 bg-primary hover:bg-secondary rounded-lg text-white font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              Book Appointment with Specialist
            </button>
          ) : (
            <div className="space-y-6">
              {!selectedDoctor ? (
                <>
                  <h3 className="text-lg font-medium text-gray-700">Select a Doctor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {doctors.map(doctor => (
                      <div
                        key={doctor.id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md cursor-pointer transition-all"
                      >
                        <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500 mt-2">{doctor.experience} experience</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">Selected Doctor</h3>
                        <h4 className="text-lg font-medium text-primary">{selectedDoctor.name}</h4>
                        <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                        <p className="text-xs text-gray-500">{selectedDoctor.phone}</p>
                      </div>
                      <button
                        onClick={() => setSelectedDoctor(null)}
                        className="text-sm text-primary hover:text-secondary"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBookAppointment}
                    disabled={!appointmentDate || !appointmentTime}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${
                      (!appointmentDate || !appointmentTime)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-secondary hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    Confirm Appointment
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={downloadReport}
          className="flex-1 py-3 px-4 bg-white border border-primary text-primary rounded-lg font-medium shadow-sm hover:bg-blue-50 transition-colors"
        >
          Download Full Report (PDF)
        </button>
        <button
          onClick={onNewPrediction}
          className="flex-1 py-3 px-4 bg-primary hover:bg-secondary rounded-lg text-white font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
        >
          New Assessment
        </button>
      </div>

      {/* Booking Confirmation Modal */}
      {isBooked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full animate-slide-up">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Appointment Booked!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your appointment with {selectedDoctor.name} is confirmed for {appointmentDate} at {appointmentTime}.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setIsBooked(false)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;