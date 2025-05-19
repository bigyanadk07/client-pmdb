import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/home';
import Entry from './pages/entry/entry';
import Explore from './pages/explore/explore';
import SignIn from './pages/auth/signin';
import Navbar from './components/common/navbar';
import ProtectedRoute from './pages/auth/protectedRoute';
import { AuthProvider } from './context/authContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            
            {/* Protected Routes - they will automatically redirect to signin if not authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                </>
              } />
              <Route path="/explore" element={
                <>
                  <Navbar />
                  <Explore />
                </>
              } />
              <Route path="/entry" element={
                <>
                  <Navbar />
                  <Entry />
                </>
              } />
            </Route>
            
            {/* Catch all - redirect to signin */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;