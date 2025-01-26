const fetchEpisodes = async (type, id, mediaData, setMediaData, setEpisodes, setIsVideoReady, BASE_URL, API_KEY) => {
  if (type === 'tv' && id && mediaData.season) {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/${id}/season/${mediaData.season}?api_key=${API_KEY}`
      );
      const data = await response.json();
      setEpisodes(data.episodes || []);
      
      if (data.episodes?.length > 0 && !mediaData.episodeNo) {
        setMediaData(prevData => {
          if (!prevData.episodeNo) {
            setIsVideoReady(false);
            setTimeout(() => setIsVideoReady(true), 100);
            return { 
              ...prevData, 
              episodeNo: '1' 
            };
          }
          return prevData;
        });
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  }
};

export default fetchEpisodes;
