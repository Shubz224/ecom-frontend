import { useState, useEffect } from 'react';
import { productService } from '../../services/products';
import ProductCard from './ProductCard';
import { PageLoader } from '../common/Loader';
import toast from 'react-hot-toast';

const ProductList = ({ 
  category = null, 
  featured = false, 
  limit = null,
  title = null 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [category, featured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let response;
      
      if (featured) {
        response = await productService.getFeaturedProducts();
        setProducts(Array.isArray(response) ? response : []);
      } else {
        const params = {
          ...(category && { category }),
          ...(limit && { limit })
        };
        
        response = await productService.getAllProducts(params);
        setProducts(response.products || []);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalProducts: response.totalProducts,
          hasNextPage: response.hasNextPage,
          hasPrevPage: response.hasPrevPage
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination Info */}
      {pagination.totalProducts > 0 && (
        <div className="mt-8 text-center text-sm text-gray-600">
          Showing {products.length} of {pagination.totalProducts} products
        </div>
      )}
    </div>
  );
};

export default ProductList;
