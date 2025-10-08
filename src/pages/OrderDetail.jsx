import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package,MapPin, CreditCard, Calendar } from 'lucide-react';
import { orderService } from '../services/order';
import { PageLoader } from '../components/common/Loader';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      setOrder(response);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderProgress = (status) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    return statuses.map((s, index) => ({
      status: s,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!order) {
    return null;
  }

  const progress = getOrderProgress(order.status);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Progress */}
          {order.status !== 'cancelled' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Progress</h2>
              
              <div className="relative">
                <div className="flex items-center justify-between">
                  {progress.map((step, index) => (
                    <div key={step.status} className="flex flex-col items-center relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : step.current
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <p className={`mt-2 text-xs font-medium ${
                        step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </p>
                      
                      {index < progress.length - 1 && (
                        <div className={`absolute top-4 left-8 w-16 h-0.5 ${
                          progress[index + 1].completed ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </h2>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={item.product.images?.[0]?.url || '/api/placeholder/80/80'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600 mt-1">{item.product.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                      <span className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Address
            </h2>
            
            <div className="text-gray-700">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Details
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-medium">{order.paymentDetails.method.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${
                  order.paymentDetails.status === 'completed' 
                    ? 'text-green-600' 
                    : 'text-yellow-600'
                }`}>
                  {order.paymentDetails.status.charAt(0).toUpperCase() + order.paymentDetails.status.slice(1)}
                </span>
              </div>
              {order.paymentDetails.razorpayPaymentId && (
                <div className="text-xs text-gray-500 mt-2">
                  Payment ID: {order.paymentDetails.razorpayPaymentId}
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Order Timeline
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Placed</span>
                <span className="text-sm">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm">{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
