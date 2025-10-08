
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) return;
    
    await updateCartItem(item.product._id, newQuantity);
  };

  const handleRemove = async () => {
    await removeFromCart(item.product._id);
  };

  const totalPrice = item.product.price * item.quantity;

  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24">
        <Link to={`/product/${item.product._id}`}>
          <img
            src={item.product.images?.[0]?.url || '/api/placeholder/96/96'}
            alt={item.product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-1 ml-6">
        <div className="flex justify-between">
          <div className="flex-1">
            <Link 
              to={`/product/${item.product._id}`}
              className="text-lg font-medium text-gray-900 hover:text-blue-600"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-gray-600 mt-1">{item.product.brand}</p>
            
            {/* Stock Warning */}
            {item.product.stock <= 10 && (
              <p className="text-xs text-orange-600 mt-1">
                Only {item.product.stock} left in stock
              </p>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              ₹{totalPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              ₹{item.product.price.toLocaleString()} each
            </p>
          </div>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Quantity:</span>
            
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="px-4 py-2 text-center min-w-[3rem]">
                {item.quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.product.stock}
                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="flex items-center text-red-600 hover:text-red-700 text-sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
