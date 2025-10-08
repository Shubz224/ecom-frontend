import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, ArrowRight } from 'lucide-react';
import { orderService } from '../services/order';
import { PageLoader } from '../components/common/Loader';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders with filter:', filter);
      
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await orderService.getUserOrders(params);
      
      console.log('Orders response:', response);
      setOrders(response.orders || []);
      
      if (!response.orders || response.orders.length === 0) {
        console.log('No orders found');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
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
      day: 'numeric'
    });
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        
        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't placed any orders yet." 
              : `No ${filter} orders found.`
            }
          </p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn-secondary flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="px-6 py-4">
                <div className="flex items-center space-x-4 overflow-x-auto">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex-shrink-0 flex items-center space-x-3">
                      <img
                        src={item.product?.images?.[0]?.url || '/api/placeholder/48/48'}
                        alt={item.product?.name || 'Product'}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 3 && (
                    <div className="flex-shrink-0 text-sm text-gray-600">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                  
                  <Link
                    to={`/orders/${order._id}`}
                    className="flex-shrink-0 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    View Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Payment: {order.paymentDetails.method.toUpperCase()} 
                    {order.paymentDetails.status === 'completed' ? ' ✓' : ' (Pending)'}
                  </div>
                  
                  <div className="flex space-x-3">
                    {order.status === 'pending' && (
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Cancel Order
                      </button>
                    )}
                    
                    {(order.status === 'shipped' || order.status === 'delivered') && (
                      <Link
                        to={`/track/${order.orderNumber}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Track Order
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
