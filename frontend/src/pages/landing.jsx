import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Star,
  Search,
  ChevronRight,
  Check,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function MarketplaceLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
   const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      title: 'Lightning Fast',
      description: 'Browse thousands of products with instant search and seamless navigation',
    },
    {
      icon: <Shield className="text-green-400" size={32} />,
      title: 'Secure Payments',
      description: 'Bank-level encryption and fraud protection for every transaction',
    },
    {
      icon: <Users className="text-blue-400" size={32} />,
      title: 'Trusted Sellers',
      description: 'Verified vendors with ratings and reviews from real customers',
    },
    {
      icon: <TrendingUp className="text-purple-400" size={32} />,
      title: 'Best Deals',
      description: 'Competitive prices and exclusive offers updated daily',
    },
  ];

  const categories = [
    { name: 'Electronics', count: '2.5k+', gradient: 'from-blue-500 to-cyan-500', icon: '💻' },
    { name: 'Fashion', count: '5k+', gradient: 'from-pink-500 to-rose-500', icon: '👗' },
    { name: 'Home & Living', count: '3k+', gradient: 'from-green-500 to-emerald-500', icon: '🏠' },
    { name: 'Sports', count: '1.8k+', gradient: 'from-orange-500 to-red-500', icon: '⚽' },
    { name: 'Books', count: '4k+', gradient: 'from-purple-500 to-indigo-500', icon: '📚' },
    { name: 'Beauty', count: '2k+', gradient: 'from-pink-400 to-purple-400', icon: '💄' },
  ];

  const stats = [
    { number: '50k+', label: 'Active Users' },
    { number: '100k+', label: 'Products Listed' },
    { number: '25k+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Uptime' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Verified Buyer',
      rating: 5,
      text: 'Amazing experience! Found exactly what I needed at the best price. Fast delivery and excellent customer service.',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Power Seller',
      rating: 5,
      text: 'As a seller, this platform has transformed my business. Easy to use, great support, and consistent sales.',
      avatar: 'MC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Regular Customer',
      rating: 5,
      text: "I've been shopping here for months. The variety is incredible and the secure payment system gives me peace of mind.",
      avatar: 'ER',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      features: ['List up to 10 products', 'Basic analytics', 'Standard support', '5% transaction fee'],
      popular: false,
    },
    {
      name: 'Pro',
      price: '29',
      features: [
        'Unlimited listings',
        'Advanced analytics',
        'Priority support',
        '2% transaction fee',
        'Featured placement',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '99',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        '0% transaction fee',
        'White-label option',
      ],
      popular: false,
    },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thanks for subscribing with ${email}!`);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/50 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <ShoppingBag className="text-cyan-400 group-hover:rotate-12 transition-transform duration-300" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                MarketHub
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-cyan-400 transition relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#categories" className="hover:text-cyan-400 transition relative group">
                Categories
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#pricing" className="hover:text-cyan-400 transition relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="hover:text-cyan-400 transition relative group">
                Reviews
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>

              <button 
                  onClick={() => navigate('/login')}
                  className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                 Login
              </button>



              <button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 animate-fadeIn">
              <a href="#features" className="block hover:text-cyan-400 transition" onClick={() => setIsMenuOpen(false)}>
                Features
              </a>
              <a href="#categories" className="block hover:text-cyan-400 transition" onClick={() => setIsMenuOpen(false)}>
                Categories
              </a>
              <a href="#pricing" className="block hover:text-cyan-400 transition" onClick={() => setIsMenuOpen(false)}>
                Pricing
              </a>
              <a href="#testimonials" className="block hover:text-cyan-400 transition" onClick={() => setIsMenuOpen(false)}>
                Reviews
              </a>

              <button 
  onClick={() => navigate('/login')}  // ADD THIS
  className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
>
  Login
</button>


              <button className="w-full text-center bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-2 rounded-full font-semibold">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6 animate-fadeIn">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm font-semibold text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300 cursor-pointer">
              <Sparkles size={16} className="animate-pulse" />
              Trusted by 50,000+ users worldwide
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Your Ultimate
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Shopping Destination
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Discover millions of products from trusted sellers. Buy, sell, and explore with confidence on the
            marketplace built for everyone.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-cyan-400 transition" size={20} />
              <input
                type="text"
                placeholder="Search for products, brands, or categories..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <button className="group bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/50">
              Start Shopping
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="border-2 border-purple-400 hover:bg-purple-400/20 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105">
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">MarketHub</span>
            </h2>
            <p className="text-gray-400 text-lg">Everything you need for a seamless shopping experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <div className="mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-gray-400 text-lg">Find what you're looking for in our diverse marketplace</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`group relative p-8 bg-gradient-to-br ${category.gradient} rounded-2xl cursor-pointer overflow-hidden transition-all duration-500 ${
                  activeCategory === index ? 'scale-105 shadow-2xl ring-2 ring-white/50' : 'hover:scale-105'
                }`}
                onMouseEnter={() => setActiveCategory(index)}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">{category.count} products</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Users Say</span>
            </h2>
            <p className="text-gray-400 text-lg">Join thousands of satisfied customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-gray-400 text-lg">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border-purple-400 shadow-xl shadow-purple-500/20'
                    : 'bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-cyan-400/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/50'
                      : 'border-2 border-purple-400 hover:bg-purple-400/20'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-purple-400/50 text-center hover:border-purple-400 transition-all duration-300">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users and start your journey today
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-cyan-400" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                MarketHub
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-cyan-400 transition">About</a>
              <a href="#" className="hover:text-cyan-400 transition">Contact</a>
              <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
              <a href="#" className="hover:text-cyan-400 transition">Terms</a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-8">
            © 2024 MarketHub. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
