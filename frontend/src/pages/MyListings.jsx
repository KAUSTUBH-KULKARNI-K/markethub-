import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Trash2, Edit, MessageSquare } from 'lucide-react';
import axios from 'axios';

export function MyListingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
    fetchMyProducts();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/products?user_id=${user.id}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      alert('Product deleted successfully!');
      fetchMyProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
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
          onClick={() => navigate('/home')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-100'
          }`}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full transition-all duration-300 ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
          } shadow-lg`}
        >
          {darkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-purple-600" size={24} />}
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center">My Listings</h1>
        <p className={`text-center mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage your products
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading your listings...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">You haven't listed any products yet</p>
            <button
              onClick={() => navigate('/sell')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              List Your First Product
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`rounded-2xl overflow-hidden ${
                  darkMode ? 'bg-white/10' : 'bg-white'
                } shadow-lg`}
              >
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '<div class="text-6xl">📦</div>';
                      }}
                    />
                  ) : (
                    <div className="text-6xl">📦</div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold flex-1">{product.name}</h3>
                    {product.category && (
                      <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full ml-2">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {product.description.substring(0, 80)}...
                    </p>
                  )}

                  <div className="text-3xl font-bold text-blue-500 mb-4">
                    ${parseFloat(product.price).toFixed(2)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
  onClick={() => navigate(`/conversations/${product.id}`)}
  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
>
  <MessageSquare size={18} />
  Messages
</button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
