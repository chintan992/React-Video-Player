import React, { useEffect, useState, useCallback } from 'react';
import { getIframeSrc } from '../api';

const VideoSection = React.forwardRef(({ mediaData, isVideoReady, onSubmit, iframeRef, allowFullscreen }, ref) => {
  const iframeSrc = getIframeSrc(mediaData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blockedPopups, setBlockedPopups] = useState(0);

  // Function to create a proxy window object
  const createWindowProxy = useCallback(() => {
    return new Proxy({}, {
      get: (target, prop) => {
        // Allow only essential properties and methods
        const allowedProps = ['postMessage', 'addEventListener', 'removeEventListener'];
        if (allowedProps.includes(prop)) {
          return window[prop].bind(window);
        }
        // Block and count popup attempts
        if (['open', 'alert', 'confirm', 'prompt'].includes(prop)) {
          setBlockedPopups(prev => prev + 1);
          return () => null;
        }
        // Return empty function for other window methods
        if (typeof window[prop] === 'function') {
          return () => null;
        }
        // Return null for other properties
        return null;
      },
      set: () => false // Prevent setting any properties
    });
  }, []);

  useEffect(() => {
    const currentIframe = iframeRef?.current;
    let cleanupFunctions = [];
    let popupInterval;

    const setupPopupBlocking = () => {
      try {
        if (currentIframe && currentIframe.contentWindow) {
          // Create proxied window object
          const windowProxy = createWindowProxy();

          // Override contentWindow properties
          Object.defineProperty(currentIframe, 'contentWindow', {
            get: () => windowProxy
          });

          // Block navigation attempts
          const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setBlockedPopups(prev => prev + 1);
            return event.returnValue = "Changes you made may not be saved.";
          };

          // Inject popup blocking script into iframe
          const injectBlocker = () => {
            try {
              const frame = currentIframe.contentWindow;
              if (frame) {
                const script = `
                  (function() {
                    // Block window.open and popup-related functions
                    window.open = function() { return null; };
                    window.alert = function() { return null; };
                    window.confirm = function() { return null; };
                    window.prompt = function() { return null; };
                    
                    // Block popup-like behaviors
                    window.moveTo = function() { return null; };
                    window.moveBy = function() { return null; };
                    window.resizeTo = function() { return null; };
                    window.resizeBy = function() { return null; };
                    window.focus = function() { return null; };
                    window.blur = function() { return null; };
                    
                    // Block common popup triggers
                    window.showModalDialog = function() { return null; };
                    window.showModelessDialog = function() { return null; };
                    window.print = function() { return null; };
                    
                    // Prevent creating new windows/tabs
                    Object.defineProperty(window, 'open', {
                      configurable: false,
                      writable: false,
                      value: function() { return null; }
                    });
                    
                    // Block popup-related events
                    window.addEventListener('click', function(e) {
                      if (e.target.tagName === 'A' && e.target.target === '_blank') {
                        e.preventDefault();
                      }
                    }, true);
                    
                    // Disable right-click context menu
                    window.addEventListener('contextmenu', function(e) {
                      e.preventDefault();
                    }, true);
                  })();
                `;

                const blocker = document.createElement('script');
                blocker.textContent = script;
                if (frame.document) {
                  frame.document.documentElement.appendChild(blocker);
                }
              }
            } catch (error) {
              console.debug("Error injecting popup blocker:", error);
            }
          };

          // Add event listeners
          window.addEventListener('beforeunload', handleBeforeUnload);
          currentIframe.addEventListener('load', injectBlocker);

          // Periodically reinject blocker
          popupInterval = setInterval(injectBlocker, 1000);

          // Store cleanup functions
          cleanupFunctions.push(() => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            currentIframe.removeEventListener('load', injectBlocker);
            clearInterval(popupInterval);
          });
        }
      } catch (error) {
        console.debug("Error in popup blocking setup:", error);
      }
    };

    setupPopupBlocking();

    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [iframeSrc, createWindowProxy, iframeRef]);

  const handleOverlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
      {isVideoReady && (
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          className="w-full h-full"
          title={`Video player for ${mediaData.type === 'movie' ? 'movie' : 'episode'}`}
          allow="fullscreen"
          allowFullScreen={allowFullscreen}
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        />
      )}
      {iframeSrc && (
        <>
          {!isPlaying && (
            <div 
              className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center cursor-pointer z-10 transition-opacity duration-300 hover:bg-opacity-50"
              onClick={handleOverlayClick}
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white bg-opacity-90 rounded-full transition-transform duration-300 hover:scale-110">
                <div className="w-0 h-0 border-l-[18px] border-l-black border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
              </div>
            </div>
          )}
        </>
      )}
      {blockedPopups > 0 && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {blockedPopups} popup{blockedPopups !== 1 ? 's' : ''} blocked
        </div>
      )}
    </div>
  );
});

VideoSection.displayName = 'VideoSection';

export default VideoSection;
