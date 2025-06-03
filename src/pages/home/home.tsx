import React from 'react';
import { Play, Film, Search, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home:React.FC = () => {
  return (
    <div className="bg-[#342E37] text-gray-200 min-h-screen">
      <main className="py-12 px-4">
        {/* Welcome Hero Section */}
        <section className="container mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6"> PMDB</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Your personal collection of favorite videos all in one place
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-colors">
              <Play size={18} className="mr-2" />
              <Link to="/explore">Browse Videos</Link>
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-colors">
              <Film size={18} className="mr-2" />
              <Link to="/entry">Add Videos</Link>
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-8">
          <h2 className="text-2xl font-bold text-white mb-10 text-center">Everything You Need</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-xl p-6 text-center transition-transform hover:scale-105">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Search & Discover</h3>
              <p className="text-gray-300">
                Easily find videos with our powerful search and filtering system
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-xl p-6 text-center transition-transform hover:scale-105">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Rate & Favorite</h3>
              <p className="text-gray-300">
                Save your favorites and rate videos to build your perfect collection
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-xl p-6 text-center transition-transform hover:scale-105">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Film size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Organize Collections</h3>
              <p className="text-gray-300">
                Create custom collections to organize your videos by genre, mood, or any category
              </p>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
};

export default Home;