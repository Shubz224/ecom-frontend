import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, Sparkles, Zap, Award } from 'lucide-react';
import { productService } from '../services/products';
import { PageLoader } from '../components/common/Loader';
import ProductCard from '../components/products/ProductCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchHomeData();
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      console.log('Fetching home page data...');
      
      const [categoriesRes, featuredRes] = await Promise.all([
        productService.getCategories(),
        productService.getFeaturedProducts()
      ]);
      
      console.log('Categories:', categoriesRes);
      console.log('Featured products (first 5):', featuredRes);
      
      setCategories(categoriesRes.slice(0, 4));
      setFeaturedProducts(featuredRes);
      
    } catch (error) {
      console.error('Error fetching home data:', error);
      toast.error('Failed to load home page data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="bg-slate-950 overflow-hidden">
      {/* Hero Section with Animated Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        
        {/* Animated Orbs */}
        <div 
          className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            left: `${mousePosition.x / 50}px`,
            top: `${mousePosition.y / 50}px`,
            transition: 'all 0.3s ease-out'
          }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-150"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">New Collection Available</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 text-white leading-tight animate-slide-up">
            Welcome to
            <span className="block bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mt-2">
              ShopEasy
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100">
            Experience the future of online shopping with our curated collection of premium products
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up delay-200">
            <Link
              to="/shop"
              className="group relative bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20 inline-flex items-center justify-center overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </Link>
            
            <Link
              to="/shop"
              className="group relative border-2 border-white/30 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              Explore Categories
              <Zap className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-slide-up delay-300">
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">1000+</div>
              <div className="text-sm text-blue-200">Products</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-4xl font-black text-white mb-2">50K+</div>
              <div className="text-sm text-blue-200">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">4.9★</div>
              <div className="text-sm text-blue-200">Average Rating</div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-2 h-2 bg-white rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Why Choose Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-blue-500/50">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Lightning Fast Delivery</h3>
                <p className="text-slate-400 leading-relaxed">Free express shipping on orders above ₹500. Get your products delivered within 24-48 hours.</p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-green-500/50">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Bank-Level Security</h3>
                <p className="text-slate-400 leading-relaxed">100% secure payments with military-grade encryption. Your data is always protected.</p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-purple-500/50">
                  <Headphones className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">24/7 Premium Support</h3>
                <p className="text-slate-400 leading-relaxed">Dedicated support team ready to help you anytime, anywhere. We're always here for you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Explore Collections
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Discover our handpicked categories tailored just for you
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  to={`/shop?category=${category._id}`}
                  className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 border border-slate-700 hover:border-blue-500/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                  
                  <div className="relative z-10 p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
                      <span className="text-4xl">📦</span>
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30"
              >
                View All Categories
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-24 bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-2 mb-6">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Trending Now</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Latest Drops
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Check out our newest and most popular products
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  View All Products
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Products Yet</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Add some amazing products in the admin panel to showcase them here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/admin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all">
                    Admin Panel
                  </Link>
                  <Link to="/shop" className="border border-slate-600 text-slate-300 px-8 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-all">
                    Browse Shop
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Exclusive Offers</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Subscribe now and get 20% off on your first order. Plus, be the first to know about new arrivals and exclusive deals.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 bg-transparent text-white placeholder-blue-200 focus:outline-none"
              />
              <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              Join 50,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .delay-75 {
          animation-delay: 75ms;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default Home;