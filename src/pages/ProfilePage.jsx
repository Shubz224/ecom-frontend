import { useState, useEffect } from 'react';
import { User, MapPin, Package, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile');
      const userData = response.data;
      
      setProfile({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || ''
      });
      setAddresses(userData.addresses || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await api.put('/users/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await api.post('/users/addresses', newAddress);
      setAddresses(response.data.addresses);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false
      });
      setShowAddressForm(false);
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await api.delete(`/users/addresses/${addressId}`);
      setAddresses(response.data.addresses);
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={logout}
                className="w-full text-left text-red-600 hover:text-red-700 px-3 py-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="input-field bg-gray-50"
                        value={profile.email}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center"
                    >
                      {loading ? <Loader size="small" /> : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="btn-primary"
                  >
                    Add New Address
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                    
                    <form onSubmit={handleAddAddress}>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          placeholder="Street Address *"
                          className="input-field"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                          required
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="City *"
                            className="input-field"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            required
                          />
                          <input
                            type="text"
                            placeholder="State *"
                            className="input-field"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="ZIP Code *"
                            className="input-field"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Country"
                            className="input-field"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={newAddress.isDefault}
                            onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                            className="mr-2"
                          />
                          <label htmlFor="isDefault" className="text-sm text-gray-700">
                            Set as default address
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-4">
                        <button type="submit" className="btn-primary">
                          Add Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Address List */}
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No addresses added yet. Add your first address to continue.
                    </p>
                  ) : (
                    addresses.map((address, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{address.street}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-gray-600">{address.country}</p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">View your order history</p>
                  <a href="/orders" className="btn-primary">
                    View All Orders
                  </a>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Privacy & Security</h3>
                    <p className="text-gray-600 mb-4">Manage your account security settings</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Change Password
                    </button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Notifications</h3>
                    <p className="text-gray-600 mb-4">Manage email and push notifications</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
