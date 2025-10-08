import { useState, useEffect } from 'react';
import { Package2, Users, ShoppingCart, TrendingUp, Plus, X, Edit, Trash2, Tag } from 'lucide-react';
import { productService } from '../services/products';
import { PageLoader } from '../components/common/Loader';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    images: [{ url: '', alt: '' }],
    specifications: {},
    tags: '',
    featured: false
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts({ limit: 50 }),
        productService.getCategories()
      ]);
      
      console.log('Products Response:', productsRes);
      console.log('Categories Response:', categoriesRes);
      
      setProducts(productsRes.products || []);
      setCategories(categoriesRes || []);
      setStats({
        totalProducts: productsRes.totalProducts || 0,
        totalUsers: 145, // Mock data
        totalOrders: 89,  // Mock data
        totalSales: 125000 // Mock data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        console.log('Deleting product:', productId);
        await productService.deleteProduct(productId);
        toast.success('Product deleted successfully!');
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleToggleProductStatus = async (productId, currentStatus) => {
    try {
      console.log('Toggling product status:', productId, currentStatus);
      await productService.updateProduct(productId, { isActive: !currentStatus });
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);
      
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: newProduct.images[0].url ? newProduct.images : []
      };

      console.log('Creating product:', productData);
      await productService.createProduct(productData);
      toast.success('Product created successfully!');
      
      // Reset form and close modal
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        images: [{ url: '', alt: '' }],
        specifications: {},
        tags: '',
        featured: false
      });
      setShowProductForm(false);
      
      // Refresh products list
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name) {
      toast.error('Please enter category name');
      return;
    }

    try {
      setFormLoading(true);
      
      console.log('Creating category:', newCategory);
      await productService.createCategory(newCategory);
      toast.success('Category created successfully!');
      
      // Reset form and close modal
      setNewCategory({
        name: '',
        description: ''
      });
      setShowCategoryForm(false);
      
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package2}
              color="bg-blue-500"
            />
            <StatCard
              title="Total Categories"
              value={categories.length}
              icon={Tag}
              color="bg-purple-500"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              color="bg-yellow-500"
            />
            <StatCard
              title="Total Sales"
              value={`₹${stats.totalSales.toLocaleString()}`}
              icon={TrendingUp}
              color="bg-red-500"
            />
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
            </div>
            <div className="p-6">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products found</p>
              ) : (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images?.[0]?.url || '/api/placeholder/48/48'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            </div>
            <div className="p-6">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No categories found</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <div key={category._id} className="text-center p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Products Header */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Manage Products ({products.length})
              </h2>
              <button 
                onClick={() => setShowProductForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
            
            {/* Products List */}
            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No products found</p>
                  <button 
                    onClick={() => setShowProductForm(true)}
                    className="btn-primary"
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images?.[0]?.url || '/api/placeholder/64/64'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                          {product.featured && (
                            <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                          <p className={`text-xs ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleToggleProductStatus(product._id, product.isActive)}
                            className={`${product.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                            title={product.isActive ? 'Deactivate Product' : 'Activate Product'}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Categories Header */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Manage Categories ({categories.length})
              </h2>
              <button 
                onClick={() => setShowCategoryForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
            
            {/* Categories List */}
            <div className="p-6">
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No categories found</p>
                  <button 
                    onClick={() => setShowCategoryForm(true)}
                    className="btn-primary"
                  >
                    Add Your First Category
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category._id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                          {category.description && (
                            <p className="text-gray-600 mt-2 text-sm">{category.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-3">
                            Created: {new Date(category.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button className="text-blue-600 hover:text-blue-700" title="Edit Category">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700" title="Delete Category">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowProductForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="input-field"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      className="input-field"
                      value={newProduct.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    className="input-field"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      className="input-field"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      className="input-field"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      className="input-field"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newProduct.images[0]?.url || ''}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      images: [{ url: e.target.value, alt: prev.name }]
                    }))}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    className="input-field"
                    value={newProduct.tags}
                    onChange={handleInputChange}
                    placeholder="smartphone, apple, iphone"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={newProduct.featured}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Mark as featured product
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary flex items-center"
                >
                  {formLoading ? <Loader size="small" /> : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
              <button
                onClick={() => setShowCategoryForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    value={newCategory.name}
                    onChange={handleCategoryInputChange}
                    placeholder="e.g., Electronics, Clothing"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    className="input-field"
                    value={newCategory.description}
                    onChange={handleCategoryInputChange}
                    placeholder="Brief description of the category"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary flex items-center"
                >
                  {formLoading ? <Loader size="small" /> : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
