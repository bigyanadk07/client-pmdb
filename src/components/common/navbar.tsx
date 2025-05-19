import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Home, Search, Plus, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-[#342E37] text-gray-200 py-3 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl mr-6 text-white">PMDB</Link>
          
          <div className="hidden md:flex space-x-1">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center"
            >
              <Home size={16} className="mr-1" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/explore" 
              className="px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center"
            >
              <Search size={16} className="mr-1" />
              <span>Explore</span>
            </Link>
            
            <Link 
              to="/entry" 
              className="px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              <span>Entry</span>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center rounded-full bg-gray-800 px-3 py-1">
                <User size={16} className="mr-2 text-gray-400" />
                <span className="text-sm font-medium">{user.username}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
              >
                <LogOut size={16} className="mr-1" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/signin" 
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 py-2 px-6 flex justify-between border-t border-gray-800">
        <Link to="/" className="flex flex-col items-center text-xs font-medium">
          <Home size={20} className="mb-1" />
          <span>Home</span>
        </Link>
        
        <Link to="/explore" className="flex flex-col items-center text-xs font-medium">
          <Search size={20} className="mb-1" />
          <span>Explore</span>
        </Link>
        
        <Link to="/entry" className="flex flex-col items-center text-xs font-medium">
          <Plus size={20} className="mb-1" />
          <span>Entry</span>
        </Link>
        
        {user && (
          <button onClick={handleLogout} className="flex flex-col items-center text-xs font-medium text-red-400">
            <LogOut size={20} className="mb-1" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;