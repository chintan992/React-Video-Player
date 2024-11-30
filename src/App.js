import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDarkMode } from './components/DarkModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import UserFeatures from './components/UserFeatures';

// Lazy load components
const Discover = React.lazy(() => import('./components/Discover'));
const AboutUs = React.lazy(() => import('./components/AboutUs'));
const Support = React.lazy(() => import('./components/Support'));
const Search = React.lazy(() => import('./components/Search'));
const WatchPage = React.lazy(() => import('./components/WatchPage'));
const ExpandedView = React.lazy(() => import('./components/ExpandedView'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="min-h-screen pt-16">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/support" element={<Support />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              <Route path="/watch/:type/:id" element={
                <ProtectedRoute>
                  <WatchPage />
                </ProtectedRoute>
              } />
              <Route path="/expanded-view" element={
                <ProtectedRoute>
                  <ExpandedView />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserFeatures />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
