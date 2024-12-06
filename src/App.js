import React, { useEffect, Suspense } from 'react';
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
    const requestNotificationPermission = async () => {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Subscribe to push notifications
          try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                process.env.REACT_APP_VAPID_PUBLIC_KEY 
              )
            });
            console.log('Push notification subscribed:', subscription);
            // Send subscription to your server
          } catch (error) {
            console.error('Error subscribing to push notifications:', error);
          }
        } else {
          console.log('Notification permission denied.');
          // Show a message to the user or handle the denial
        }
      }
    };

    const urlBase64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };

    requestNotificationPermission();

    // Add to home screen prompt
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault(); 
      // Store the event for later use
      window.deferredPrompt = event;
      // Show your custom add-to-home-screen prompt
      // ... (trigger a button or modal to prompt the user)
    });


    // ... (other effects if needed)

  }, []); 


  useEffect(() => {
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
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <DarkModeProvider> 
      <ErrorBoundary>
        <AuthProvider>
          <SearchProvider> {/* Wrap AppContent with SearchProvider */}
            <AppContent />
          </SearchProvider>
        </AuthProvider>
      </ErrorBoundary>
    </DarkModeProvider>
  );
}

export default App;