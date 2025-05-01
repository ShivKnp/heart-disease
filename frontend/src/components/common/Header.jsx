const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">HeartGuard</h1>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white">Hi, {user.name}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white text-primary rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;