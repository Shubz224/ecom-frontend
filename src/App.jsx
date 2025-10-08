
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetail from "./pages/OrderDetail";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <div>Admin Panel Coming Soon...</div>
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        404
                      </h1>
                      <p className="text-gray-600">Page not found</p>
                    </div>
                  }
                />
              </Routes>
            </Layout>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#4ade80",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
