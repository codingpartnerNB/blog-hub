import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiBook, FiHome, FiLogIn, FiUserPlus } from 'react-icons/fi';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const activeClass = "text-white bg-gradient-to-r from-blue-600 to-purple-600";
  const linkClass = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center";
  const mobileLinkClass = "px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-xl' : 'bg-white/90 backdrop-blur-sm shadow-md'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center group"
            onClick={closeMenu}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              BlogHub
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* <NavLink 
              to="/" 
              className={({ isActive }) => 
                `${linkClass} ${isActive ? activeClass : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <FiHome className="mr-2" />
              Home
            </NavLink> */}
            
            <NavLink 
              to="/blogs" 
              className={({ isActive }) => 
                `${linkClass} ${isActive ? activeClass : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <FiBook className="mr-2" />
              Blogs
            </NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `${linkClass} ${isActive ? activeClass : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  Dashboard
                </NavLink>
                
                <div className="relative group ml-2">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    {user?.profileImage ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img 
                          src={`${import.meta.env.VITE_BACKEND_PATH}${user.profileImage}` }
                          alt={user.name} 
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                <span class="text-xl font-semibold text-blue-600">
                                  ${user.name?.charAt(0)?.toUpperCase() || ''}
                                </span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-md">
                        <FiUser className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                    >
                      <FiLogOut className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-3 ml-4">
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `btn ${isActive ? 'btn-primary' : 'btn-outline hover:bg-gray-100'} flex items-center p-2 rounded-lg`
                  }
                >
                  <FiLogIn className="mr-2" />
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className={({ isActive }) => 
                    `btn ${isActive ? 'btn-primary' : 'btn-gradient hover:opacity-90'} flex items-center p-2 rounded-lg`
                  }
                >
                  <FiUserPlus className="mr-2" />
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {/* <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${mobileLinkClass} ${isActive ? activeClass : 'text-gray-700 hover:bg-gray-100'}`
            }
            onClick={closeMenu}
          >
            <FiHome className="mr-3" />
            Home
          </NavLink> */}
          
          <NavLink 
            to="/blogs" 
            className={({ isActive }) => 
              `${mobileLinkClass} ${isActive ? activeClass : 'text-gray-700 hover:bg-gray-100'}`
            }
            onClick={closeMenu}
          >
            <FiBook className="mr-3" />
            Blogs
          </NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `${mobileLinkClass} ${isActive ? activeClass : 'text-gray-700 hover:bg-gray-100'}`
                }
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              
              <div className="pt-4 border-t border-gray-200 mt-3">
                <div className="flex items-center px-4 py-3">
                  {user?.profileImage ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-md mr-3">
                      <img 
                        src={`${import.meta.env.VITE_BACKEND_PATH}${user.profileImage}` } 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                              <span class="text-xl font-semibold text-blue-600">
                                ${user.name?.charAt(0)?.toUpperCase() || ''}
                              </span>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-md mr-3">
                      <FiUser className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-2"
                >
                  <FiLogOut className="mr-3" />
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-gray-200 mt-3 space-y-2">
              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  `btn ${isActive ? 'btn-primary' : 'btn-outline hover:bg-gray-100'} w-full flex items-center justify-center p-2 rounded-lg`
                }
                onClick={closeMenu}
              >
                <FiLogIn className="mr-2" />
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className={({ isActive }) => 
                  `btn ${isActive ? 'btn-primary' : 'btn-gradient hover:opacity-90'} w-full flex items-center justify-center p-2 rounded-lg`
                }
                onClick={closeMenu}
              >
                <FiUserPlus className="mr-2" />
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;