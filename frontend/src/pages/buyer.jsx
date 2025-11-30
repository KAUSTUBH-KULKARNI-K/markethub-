import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sun, Moon, Phone, Mail, MapPin, RefreshCw, MessageSquare } from 'lucide-react';
import axios from 'axios';

// ✅ Add this line - uses environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function BuyerPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
    fetchProducts();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // ✅ Changed this line - uses API_URL variable
      let url = `${API_URL}/api/products`;
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const categories = ['all', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Furniture', 'Others'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 text-gray-900'
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

        <div className="flex gap-4 items-center">
          <button
            onClick={fetchProducts}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
            } shadow-lg`}
            title="Refresh"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
            } shadow-lg`}
          >
            {darkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-blue-600" size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Browse Products</h1>
        <p className={`text-center mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Find the perfect product for you
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-lg`}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className={`w-full pl-12 pr-4 py-4 rounded-full ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white scale-105'
                  : darkMode
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading products...</p>
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No products found. Be the first to list one!
            </p>
            <button
              onClick={() => navigate('/sell')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              List a Product
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`rounded-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                  darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:shadow-xl'
                } backdrop-blur-sm`}
              >
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden relative">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '<div class="text-6xl flex items-center justify-center w-full h-full">📦</div>';
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
                      <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full ml-2 flex-shrink-0">
                        {product.category}
                      </span>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {product.description.length > 100 
                        ? product.description.substring(0, 100) + '...' 
                        : product.description}
                    </p>
                  )}

                  <div className="text-3xl font-bold text-blue-500 mb-4">
                    ${parseFloat(product.price).toFixed(2)}
                  </div>

                  {/* Seller Info */}
                  <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 space-y-2`}>
                    <p className="font-semibold">Seller: {product.seller_name}</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} />
                      <a 
                        href={`tel:${product.contact}`} 
                        className={`hover:text-blue-500 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {product.contact}
                      </a>
                    </div>

                    {product.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={16} />
                        <a 
                          href={`mailto:${product.email}`} 
                          className={`hover:text-blue-500 break-all ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          {product.email}
                        </a>
                      </div>
                    )}

                    {product.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={16} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {product.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => navigate(`/messages/${product.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition font-semibold"
                    >
                      <MessageSquare size={18} />
                      Message
                    </button>
                    <a 
                      href={`tel:${product.contact}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition flex items-center justify-center"
                    >
                      <Phone size={20} />
                    </a>
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
