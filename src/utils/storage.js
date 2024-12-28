const STORAGE_KEYS = {
  VIDEO_SOURCE: 'preferred_video_source',
  VIDEO_SOURCE_TIMESTAMP: 'video_source_timestamp',
};

const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const getStoredVideoSource = () => {
  const source = localStorage.getItem(STORAGE_KEYS.VIDEO_SOURCE);
  const timestamp = localStorage.getItem(STORAGE_KEYS.VIDEO_SOURCE_TIMESTAMP);
  
  if (!source || !timestamp) return null;
  
  // Check if the stored preference is older than a day
  if (Date.now() - Number(timestamp) > ONE_DAY) {
    localStorage.removeItem(STORAGE_KEYS.VIDEO_SOURCE);
    localStorage.removeItem(STORAGE_KEYS.VIDEO_SOURCE_TIMESTAMP);
    return null;
  }
  
  return source;
};

export const setStoredVideoSource = (source) => {
  localStorage.setItem(STORAGE_KEYS.VIDEO_SOURCE, source);
  localStorage.setItem(STORAGE_KEYS.VIDEO_SOURCE_TIMESTAMP, Date.now().toString());
};

const TV_PROGRESS_KEY = 'tv_show_progress';
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

export const saveTVProgress = (showId, season, episode) => {
  try {
    const progress = JSON.parse(localStorage.getItem(TV_PROGRESS_KEY) || '{}');
    progress[showId] = {
      season,
      episode,
      timestamp: Date.now()
    };
    localStorage.setItem(TV_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving TV progress:', error);
  }
};

export const getTVProgress = (showId) => {
  try {
    const progress = JSON.parse(localStorage.getItem(TV_PROGRESS_KEY) || '{}');
    const showProgress = progress[showId];
    
    if (!showProgress) return null;
    
    // Check if the stored progress is older than a week
    if (Date.now() - showProgress.timestamp > ONE_WEEK) {
      delete progress[showId];
      localStorage.setItem(TV_PROGRESS_KEY, JSON.stringify(progress));
      return null;
    }
    
    return {
      season: showProgress.season,
      episode: showProgress.episode
    };
  } catch (error) {
    console.error('Error getting TV progress:', error);
    return null;
  }
};
