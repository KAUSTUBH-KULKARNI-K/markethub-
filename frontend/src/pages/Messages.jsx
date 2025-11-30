import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send, Sun, Moon, RefreshCw } from 'lucide-react';
import axios from 'axios';

// ✅ Add this line - uses environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function MessagesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [product, setProduct] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    
    fetchProductAndMessages();
  }, [productId]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const fetchProductAndMessages = async () => {
    try {
      setLoading(true);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // ✅ Changed this line - uses API_URL variable
      const productRes = await axios.get(`${API_URL}/api/products/${productId}`);
      const productData = productRes.data;
      setProduct(productData);

      // Get other user info from URL params (for seller view)
      const otherUserId = searchParams.get('other_user_id');
      const otherUserName = searchParams.get('other_user_name');

      // Determine who we're chatting with
      const isProductOwner = productData.user_id === user.id;
      
      let chattingWithId, chattingWithName;
      
      if (isProductOwner) {
        // User is the seller
        if (otherUserId && otherUserName) {
          // Seller viewing specific buyer's messages
          chattingWithId = otherUserId;
          chattingWithName = decodeURIComponent(otherUserName);
        } else {
          // Seller clicked message without selecting buyer - redirect to conversations list
          navigate(`/conversations/${productId}`);
          return;
        }
      } else {
        // User is a buyer, chatting with seller
        chattingWithId = productData.user_id;
        chattingWithName = productData.seller_name;
      }
      
      setOtherUser({ id: chattingWithId, name: chattingWithName });

      console.log('Fetching messages between:', user.id, 'and', chattingWithId);

      // ✅ Changed this line - uses API_URL variable
      const messagesRes = await axios.get(
        `${API_URL}/api/messages/${productId}?user_id=${user.id}&other_user_id=${chattingWithId}`
      );
      setMessages(messagesRes.data);
      
      console.log('Messages loaded:', messagesRes.data.length);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    if (!otherUser || !otherUser.id) {
      alert('Cannot send message - recipient not identified');
      return;
    }

    try {
      setSending(true);
      
      if (!currentUser || !currentUser.id) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      console.log('Sending message from', currentUser.id, 'to', otherUser.id);

      // ✅ Changed this line - uses API_URL variable
      await axios.post(`${API_URL}/api/messages`, {
        product_id: productId,
        sender_id: currentUser.id,
        receiver_id: otherUser.id,
        sender_name: currentUser.name,
        receiver_name: otherUser.name,
        message: newMessage
      });

      setNewMessage('');
      fetchProductAndMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + (error.response?.data?.error || error.message));
    } finally {
      setSending(false);
    }
  };

  const isMyMessage = (msg) => {
    return msg.sender_id === currentUser?.id;
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
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-100'
          }`}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex gap-4 items-center">
          <button
            onClick={fetchProductAndMessages}
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
            {darkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-purple-600" size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Product & Chat Info */}
        {product && otherUser && (
          <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-xl text-blue-500 font-bold mb-2">${parseFloat(product.price).toFixed(2)}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              💬 Chatting with: <span className="font-semibold">{otherUser.name}</span>
            </p>
          </div>
        )}

        {/* Messages - WhatsApp Style */}
        <div className={`rounded-2xl p-6 mb-6 ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-lg min-h-[500px] max-h-[500px] overflow-y-auto`}>
          <h3 className="text-xl font-bold mb-4 text-center">
            🔒 Private Conversation
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No messages yet. Start the conversation!
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isMine = isMyMessage(msg);
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl shadow-md ${
                        isMine
                          ? darkMode
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : darkMode
                          ? 'bg-white/10 text-white'
                          : 'bg-gray-200 text-gray-900'
                      } ${isMine ? 'rounded-br-none' : 'rounded-bl-none'}`}
                    >
                      {!isMine && (
                        <div className="font-semibold mb-1 text-sm">
                          {msg.sender_name}
                        </div>
                      )}
                      
                      <p className="break-words">{msg.message}</p>
                      
                      <div className={`text-xs mt-2 ${isMine ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Send Message Form */}
        <form onSubmit={sendMessage} className={`p-6 rounded-2xl ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-lg`}>
          <div className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 px-4 py-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-purple-500 transition`}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
