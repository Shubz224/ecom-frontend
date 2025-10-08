
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">ShopEasy</h3>
            <p className="text-gray-300 text-sm">
              Your one-stop destination for all your shopping needs. 
              Quality products at affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-span-1">
            <h4 className="text-md font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-white text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="text-md font-semibold mb-4">Contact Info</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>📧 support@shopeasy.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 ShopEasy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
