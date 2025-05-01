import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Hero Section */}
        <div className="text-center">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Heart Disease Risk Prediction
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12"
          >
            Our advanced machine learning models help you assess your cardiovascular health risk with high accuracy.
          </motion.p>

          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto"
          >
            {[
              { value: '87%', label: 'Accuracy' },
              { value: '4', label: 'ML Models' },
              { value: 'Instant', label: 'Results' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={containerVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-secondary transition-colors"
            >
              Get Started
            </motion.button>
            
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-primary font-medium rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            >
              Create Account
            </motion.button>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          variants={containerVariants}
          className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              icon: '🧠',
              title: 'AI-Powered Analysis',
              description: 'Our system uses multiple machine learning models to provide the most accurate risk assessment.'
            },
            {
              icon: '📊',
              title: 'Detailed Reports',
              description: 'Receive comprehensive reports with visualizations and explanations of your results.'
            },
            {
              icon: '🔒',
              title: 'Secure & Private',
              description: 'Your health data is encrypted and never shared with third parties.'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial Section */}
        <motion.div 
          variants={containerVariants}
          className="mt-24 bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">JD</div>
              <div className="ml-4">
                <h4 className="font-semibold">Majnu Singh</h4>
                <p className="text-gray-600">Cardiology Patient</p>
              </div>
            </motion.div>
            <motion.p variants={itemVariants} className="text-lg italic text-gray-700">
              "This tool helped me identify potential heart issues early. The detailed report gave me actionable insights that I discussed with my doctor."
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;