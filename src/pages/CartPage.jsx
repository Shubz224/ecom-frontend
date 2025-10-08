
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import { PageLoader } from '../components/common/Loader';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const { cart, cartSummary, loading, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sign in to view your cart
        </h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to access your shopping cart.
        </p>
        <Link to="/login" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return <PageLoader />;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({cartSummary.totalItems} items)
          </h1>
        </div>
        
        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Cart Items
            </h2>
            
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({cartSummary.totalItems})</span>
                <span className="font-medium">
                  ₹{cartSummary.totalAmount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{cartSummary.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary mt-6"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/shop"
              className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-4"
            >
              Continue Shopping
            </Link>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t">
              <div className="text-xs text-gray-500 space-y-2">
                <p>✓ Free shipping on all orders</p>
                <p>✓ 30-day return policy</p>
                <p>✓ Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
