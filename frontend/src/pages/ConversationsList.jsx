import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, MessageSquare, RefreshCw } from 'lucide-react';
import axios from 'axios';

export function ConversationsListPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
    fetchBuyersAndProduct();
  }, [productId]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const fetchBuyersAndProduct = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user.id) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Fetch product details
      const productRes = await axios.get(`http://localhost:5000/api/products/${productId}`);
      setProduct(productRes.data);

      // Fetch buyers who messaged
      const buyersRes = await axios.get(`http://localhost:5000/api/product/${productId}/buyers?user_id=${user.id}`);
      setBuyers(buyersRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/my-listings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-100'
          }`}
        >
          <ArrowLeft size={20} />
          Back to Listings
        </button>

        <div className="flex gap-4 items-center">
          <button
            onClick={fetchBuyersAndProduct}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
            } shadow-lg`}
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
            } shadow-lg`}
          >
            {darkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-purple-600" size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Product Info */}
        {product && (
          <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-xl text-blue-500 font-bold">${parseFloat(product.price).toFixed(2)}</p>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6">Messages from Buyers</h1>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
            <p>Loading conversations...</p>
          </div>
        ) : buyers.length === 0 ? (
          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-lg text-center`}>
            <MessageSquare className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-xl">No messages yet</p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Buyers will appear here when they message you
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {buyers.map((buyer) => (
              <button
                key={buyer.id}
                onClick={() => navigate(`/messages/${productId}?other_user_id=${buyer.id}&other_user_name=${encodeURIComponent(buyer.name)}`)}
                className={`w-full p-6 rounded-2xl ${
                  darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-50'
                } shadow-lg transition-all duration-300 text-left`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{buyer.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Last message: {new Date(buyer.last_message_time).toLocaleString()}
                    </p>
                  </div>
                  <MessageSquare size={24} className="text-blue-500" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
