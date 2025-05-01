import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { predictHeartDisease } from '../../services/predictionService';

const PredictionForm = ({ onPredictionComplete }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    age: '',
    sex: '1',
    cp: '0',
    trestbps: '',
    chol: '',
    fbs: '0',
    restecg: '0',
    thalach: '',
    exang: '0',
    oldpeak: '',
    slope: '0',
    ca: '0',
    thal: '2'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const numericalData = {
        ...formData,
        age: parseInt(formData.age),
        trestbps: parseInt(formData.trestbps),
        chol: parseInt(formData.chol),
        thalach: parseInt(formData.thalach),
        oldpeak: parseFloat(formData.oldpeak),
        ca: parseInt(formData.ca),
        thal: parseInt(formData.thal)
      };

      const response = await predictHeartDisease(numericalData, user.token);
    
      if (response && response.predictions) {
        onPredictionComplete(response);
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err) {
      setError(err.message || 'Prediction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 animate-fade-in max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        Heart Disease Risk Assessment
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Age */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
            max="120"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Sex */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Sex
          </label>
          <select 
            name="sex" 
            value={formData.sex} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>

        {/* Chest Pain Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Chest Pain Type
          </label>
          <select 
            name="cp" 
            value={formData.cp} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="0">Typical Angina</option>
            <option value="1">Atypical Angina</option>
            <option value="2">Non-anginal Pain</option>
            <option value="3">Asymptomatic</option>
          </select>
        </div>

        {/* Resting Blood Pressure */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Resting BP (mm Hg)
          </label>
          <input
            type="number"
            name="trestbps"
            value={formData.trestbps}
            onChange={handleChange}
            required
            min="80"
            max="200"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Serum Cholesterol */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Cholesterol (mg/dl)
          </label>
          <input
            type="number"
            name="chol"
            value={formData.chol}
            onChange={handleChange}
            required
            min="100"
            max="600"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Fasting Blood Sugar */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Fasting Blood Sugar &gt; 120 mg/dl
          </label>
          <select 
            name="fbs" 
            value={formData.fbs} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Resting ECG Results */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Resting ECG
          </label>
          <select 
            name="restecg" 
            value={formData.restecg} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="0">Normal</option>
            <option value="1">ST-T Wave Abnormality</option>
            <option value="2">Left Ventricular Hypertrophy</option>
          </select>
        </div>

        {/* Max Heart Rate Achieved */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Max Heart Rate
          </label>
          <input
            type="number"
            name="thalach"
            value={formData.thalach}
            onChange={handleChange}
            required
            min="60"
            max="220"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Exercise Induced Angina */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Exercise Induced Angina
          </label>
          <select 
            name="exang" 
            value={formData.exang} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* ST Depression */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            ST Depression
          </label>
          <input
            type="number"
            step="0.1"
            name="oldpeak"
            value={formData.oldpeak}
            onChange={handleChange}
            required
            min="0"
            max="6.2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Slope of Peak Exercise */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Slope of Peak Exercise
          </label>
          <select 
            name="slope" 
            value={formData.slope} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="0">Upsloping</option>
            <option value="1">Flat</option>
            <option value="2">Downsloping</option>
          </select>
        </div>

        {/* Number of Major Vessels */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Number of Major Vessels (0-3)
          </label>
          <select 
            name="ca" 
            value={formData.ca} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        {/* Thalassemia */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-primary">
            Thalassemia
          </label>
          <select 
            name="thal" 
            value={formData.thal} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="1">Normal</option>
            <option value="2">Fixed Defect</option>
            <option value="3">Reversible Defect</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Assess Risk'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;