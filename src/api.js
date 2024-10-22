// src/api.js

const getIframeSrc = (mediaData) => {
    const { type, apiType, seriesId, season, episodeNo, movieId } = mediaData;
    let baseUrl = '';
  
    switch (apiType) {
      case 'multiembed':
        baseUrl = 'https://multiembed.mov/directstream.php';
        return type === 'series'
          ? `${baseUrl}?video_id=${seriesId}&tmdb=1&s=${season}&e=${episodeNo}`
          : `${baseUrl}?video_id=${movieId}&tmdb=1`;
      case 'autoembed':
        baseUrl = 'https://player.autoembed.cc/embed/';
        return type === 'series'
          ? `${baseUrl}tv/${seriesId}/${season}/${episodeNo}`
          : `${baseUrl}movie/${movieId}`;
      case '2embed':
        return type === 'series'
          ? `https://www.2embed.cc/embedtv/${seriesId}&s=${season}&e=${episodeNo}`
          : `https://www.2embed.cc/embed/${movieId}`;
      default:
        return '';
    }
  };
  
  export { getIframeSrc };