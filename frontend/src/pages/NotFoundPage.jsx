import { useNavigate } from 'react-router-dom';
import '../styles/notfound.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default NotFoundPage;