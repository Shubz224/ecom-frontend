import { useState, useEffect } from 'react';
import { productService } from '../services/products';
import ProductCard from '../components/products/ProductCard';
import { PageLoader } from '../components/common/Loader';
import { Search} from 'lucide-react';
import toast from 'react-hot-toast';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await productService.getAllProducts(params);
      setProducts(response.products || []);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalProducts: response.totalProducts,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Category */}
          <select
            className="input-field"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              className="input-field"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="input-field"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            className="input-field"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, sortBy, sortOrder }));
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Clear All Filters
        </button>
      </div>

      {/* Results Count */}
      {pagination.totalProducts > 0 && (
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {pagination.totalProducts} products
            {filters.search && (
              <span> for "{filters.search}"</span>
            )}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <PageLoader />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <button
            onClick={clearFilters}
            className="mt-4 btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
