import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowLeft, Plus, Minus } from 'lucide-react';
import { productService } from '../services/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PageLoader } from '../components/common/Loader';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    await addToCart(product._id, quantity);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
      </div>
    );
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const finalPrice = product.discountPrice || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images?.[selectedImage]?.url || '/api/placeholder/500/500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Brand */}
          <p className="text-sm text-gray-500 mb-4">Brand: {product.brand}</p>

          {/* Rating */}
          {product.ratings?.average > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.ratings.average)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{finalPrice.toLocaleString()}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <div>
                <span className="text-green-600 font-medium">In Stock</span>
                {product.stock <= 10 && (
                  <span className="text-orange-600 ml-2">
                    (Only {product.stock} left)
                  </span>
                )}
              </div>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementQuantity}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium px-4">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
