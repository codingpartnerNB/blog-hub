import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { FiLock } from 'react-icons/fi';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setAuthChecked(true);
        setShowContent(true);
      }, 300); // Small delay for smooth transition
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || !authChecked) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative mb-6">
          {/* Animated gradient circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-ping"></div>
          {/* Lock icon */}
          <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-white shadow-lg border-2 border-gray-200">
            <FiLock className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">Checking Authentication</h3>
        <p className="text-gray-500 max-w-md text-center px-4">
          Please wait while we verify your access...
        </p>
      </div>
    );
  }

  return showContent ? (
    <div className="animate-fadeIn">
      {isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />}
    </div>
  ) : null;
}

export default ProtectedRoute;