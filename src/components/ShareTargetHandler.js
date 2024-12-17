import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShareTargetHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSharedData = async () => {
      try {
        // Get the shared data from the URL parameters
        const params = new URLSearchParams(window.location.search);
        const title = params.get('title') || '';
        const text = params.get('text') || '';
        const url = params.get('url') || '';

        // Handle shared video files
        if (window.location.pathname === '/share-target' && navigator.serviceWorker) {
          const formData = await new Response(window.location.search).formData();
          const file = formData.get('video');
          
          if (file) {
            // Create a local URL for the shared video
            const videoUrl = URL.createObjectURL(file);
            
            // Store video information in localStorage
            const sharedVideos = JSON.parse(localStorage.getItem('sharedVideos') || '[]');
            sharedVideos.push({
              id: Date.now().toString(),
              title: title || file.name,
              url: videoUrl,
              timestamp: new Date().toISOString(),
              type: 'local'
            });
            localStorage.setItem('sharedVideos', JSON.stringify(sharedVideos));
          }
        }

        // Redirect to the home page or video player
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error handling shared content:', error);
        navigate('/', { replace: true });
      }
    };

    handleSharedData();
  }, [navigate]);

  return (
    <div className="share-target-handler">
      Processing shared content...
    </div>
  );
};

export default ShareTargetHandler;
