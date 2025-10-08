import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/order';
import { paymentService } from '../services/payment';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, cartSummary } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    // Check if Razorpay script is loaded
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // If cart is empty, redirect to cart page
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    // Auto-select default address if available
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      setSelectedAddress(defaultAddress || user.addresses[0]);
    } else {
      setShowAddressForm(true); // Show form if no addresses
    }
  }, [cart, user, navigate]);

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!selectedAddress && !showAddressForm) {
      toast.error('Please select or add a delivery address');
      return;
    }

    if (showAddressForm) {
      if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
        toast.error('Please fill in all address fields');
        return;
      }
    }

    try {
      setLoading(true);
      
      const orderData = {
        shippingAddress: showAddressForm ? newAddress : selectedAddress,
        paymentMethod
      };

      console.log('Creating order with data:', orderData);

      // Create order
      const orderResponse = await orderService.createOrder(orderData);
      const order = orderResponse.order;

      console.log('Order created:', order);
      toast.success('Order placed successfully!');

      // Handle payment based on method
      if (paymentMethod === 'cod') {
        // COD - order is complete, redirect to order detail
        setTimeout(() => {
          navigate(`/orders/${order._id}`);
        }, 1000);
      } else if (paymentMethod === 'razorpay') {
        // Razorpay - initiate payment
        await handleRazorpayPayment(order._id);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (orderId) => {
    try {
      console.log('Initiating Razorpay payment for order:', orderId);
      
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error('Payment system not loaded. Please refresh and try again.');
        return;
      }

      // Create Razorpay order
      const razorpayResponse = await paymentService.createRazorpayOrder(orderId);
      console.log('Razorpay order created:', razorpayResponse);
      
      const options = {
        key: razorpayResponse.key,
        amount: razorpayResponse.amount,
        currency: razorpayResponse.currency,
        name: 'ShopEasy',
        description: `Order #${razorpayResponse.order.orderNumber}`,
        order_id: razorpayResponse.orderId,
        handler: async function (response) {
          console.log('Payment successful:', response);
          try {
            // Verify payment
            const verifyResponse = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });
            
            console.log('Payment verified:', verifyResponse);
            toast.success('Payment successful!');
            navigate(`/orders/${orderId}`);
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            toast.error('Payment cancelled');
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#2563eb'
        }
      };

      console.log('Opening Razorpay with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to initiate payment';
      toast.error(errorMessage);
    }
  };

  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Delivery Address
            </h2>

            {/* Existing Addresses */}
            {user?.addresses?.length > 0 && !showAddressForm && (
              <div className="space-y-3 mb-4">
                {user.addresses.map((address, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress === address
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-gray-600">{address.country}</p>
                      </div>
                      <input
                        type="radio"
                        checked={selectedAddress === address}
                        onChange={() => setSelectedAddress(address)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Address Button */}
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add New Address
              </button>
            )}

            {/* New Address Form */}
            {showAddressForm && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address *"
                    className="input-field"
                    value={newAddress.street}
                    onChange={handleAddressChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      className="input-field"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State *"
                      className="input-field"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code *"
                      className="input-field"
                      value={newAddress.zipCode}
                      onChange={handleAddressChange}
                      required
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      className="input-field"
                      value={newAddress.country}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                {user?.addresses?.length > 0 && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Method
            </h2>

            <div className="space-y-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'razorpay'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('razorpay')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-gray-600">Pay with Razorpay (Cards, UPI, Wallets)</p>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  />
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                  <img
                    src={item.product.images?.[0]?.url || '/api/placeholder/48/48'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{cartSummary.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{cartSummary.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || (!selectedAddress && !showAddressForm)}
              className="w-full btn-primary mt-6 flex items-center justify-center"
            >
              {loading ? (
                <Loader size="small" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Place Order
                </>
              )}
            </button>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600 text-center">
              🔒 Your payment information is secure and encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
