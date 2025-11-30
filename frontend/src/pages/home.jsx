import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, Store, LogOut, Package } from 'lucide-react';
import { supabase } from '../utils/supabase'; // Import supabase

export function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check for Google auth session and load theme
  useEffect(() => {
    // Check for Google auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User logged in via Google
        const googleUser = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
          email: session.user.email
        };
        localStorage.setItem('user', JSON.stringify(googleUser));
      }
    });

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    // Sign out from Supabase (for Google users)
    await supabase.auth.signOut();
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    navigate('/login');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          MarketHub
        </h1>
        
        <div className="flex gap-4 items-center">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-100'
            } shadow-lg`}
          >
            {darkMode ? (
              <Sun className="text-yellow-400" size={24} />
            ) : (
              <Moon className="text-purple-600" size={24} />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              darkMode
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-red-500 hover:bg-red-600'
            } text-white font-semibold`}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome Back!
          </h2>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            What would you like to do today?
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Buy Card */}
          <button
            onClick={() => navigate('/buyer')}
            className={`group p-8 rounded-3xl transition-all duration-300 transform hover:scale-105 ${
              darkMode
                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
            } shadow-2xl hover:shadow-3xl`}
          >
            <div className="flex flex-col items-center text-white">
              <div className="p-6 bg-white/20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart size={64} />
              </div>
              <h3 className="text-3xl font-bold mb-3">Buy Products</h3>
              <p className="text-lg opacity-90">
                Browse and purchase from thousands of products
              </p>
            </div>
          </button>

          {/* Sell Card */}
          <button
            onClick={() => navigate('/sell')}
            className={`group p-8 rounded-3xl transition-all duration-300 transform hover:scale-105 ${
              darkMode
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            } shadow-2xl hover:shadow-3xl`}
          >
            <div className="flex flex-col items-center text-white">
              <div className="p-6 bg-white/20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Store size={64} />
              </div>
              <h3 className="text-3xl font-bold mb-3">Sell Products</h3>
              <p className="text-lg opacity-90">
                List your products and reach millions of buyers
              </p>
            </div>
          </button>
        </div>

        {/* My Listings Button */}
        <button
          onClick={() => navigate('/my-listings')}
          className={`mt-8 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
            darkMode
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-white hover:bg-gray-100'
          } shadow-lg hover:scale-105`}
        >
          <Package size={24} />
          View My Listings
        </button>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-4xl w-full">
          <div className={`text-center p-6 rounded-2xl ${
            darkMode ? 'bg-white/10' : 'bg-white/50'
          } backdrop-blur-sm`}>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              50k+
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Active Users
            </div>
          </div>
          <div className={`text-center p-6 rounded-2xl ${
            darkMode ? 'bg-white/10' : 'bg-white/50'
          } backdrop-blur-sm`}>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              100k+
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Products
            </div>
          </div>
          <div className={`text-center p-6 rounded-2xl ${
            darkMode ? 'bg-white/10' : 'bg-white/50'
          } backdrop-blur-sm`}>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              25k+
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Happy Customers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
