import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider, useDarkMode } from './components/DarkModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext'; // Import SearchProvider
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import UserFeatures from './components/UserFeatures';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import useInstallPrompt from './hooks/useInstallPrompt';
import ShareTargetHandler from './components/ShareTargetHandler';
import Footer from './components/Footer'; // Import Footer

// Lazy load components
const Discover = React.lazy(() => import('./components/Discover'));
const AboutUs = React.lazy(() => import('./components/AboutUs'));
const Support = React.lazy(() => import('./components/Support'));
const Search = React.lazy(() => import('./components/Search'));
const WatchPage = React.lazy(() => import('./components/WatchPage'));

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
    // Handle dark mode
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }    
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="min-h-screen pt-16">
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/support" element={<Support />} />

              {/* Default Route */}
              <Route path="/" element={<Discover />} />

              {/* Protected Routes */}
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
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserFeatures />
                </ProtectedRoute>
              } />
              <Route path="/share-target" element={<ShareTargetHandler />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { isInstallable, handleInstallClick } = useInstallPrompt();

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <DarkModeProvider> 
        <ErrorBoundary>
          <AuthProvider>
            <SearchProvider> {/* Wrap AppContent with SearchProvider */}
              <div className="min-h-screen flex flex-col">
                <div className="flex-grow">
                  <div className="app">
                    {isInstallable && (
                      <button 
                        onClick={handleInstallClick}
                        className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2 z-40"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Install App</span>
                      </button>
                    )}
                    <AppContent />
                  </div>
                </div>
                <Footer />
              </div>
            </SearchProvider>
          </AuthProvider>
        </ErrorBoundary>
      </DarkModeProvider>
    </>
  );
}

export default App;