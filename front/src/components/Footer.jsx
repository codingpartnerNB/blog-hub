import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { useEffect, useState } from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <footer className={`bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-blue-500 bg-clip-text text-transparent inline-block"
            >
              BlogHub
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Share your thoughts with the world. Join our community of writers and readers today.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FiGithub className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@bloghub.com" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                <FiMail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Explore Blogs
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Popular Authors
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block py-1">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} BlogHub. All rights reserved.
          </p>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm flex items-center">
              Made with <FiHeart className="mx-1.5 text-red-500 animate-pulse" /> around the world
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;