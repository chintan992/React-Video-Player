// src/api.js

const getIframeSrc = (mediaData) => {
  const { type, apiType, seriesId, season, episodeNo, movieId } = mediaData;
  let baseUrl = '';

  switch (apiType) {
    case 'multiembed':
      return type === 'series'
        ? `https://multiembed.mov/directstream.php?video_id=${seriesId}&tmdb=1&s=${season}&e=${episodeNo}`
        : `https://multiembed.mov/directstream.php?video_id=${movieId}&tmdb=1`;
    case 'autoembed':
      baseUrl = 'https://player.autoembed.cc/embed/';
      return type === 'series'
        ? `${baseUrl}tv/${seriesId}/${season}/${episodeNo}`
        : `${baseUrl}movie/${movieId}`;
    case '2embed':
      return type === 'series'
        ? `https://www.2embed.cc/embedtv/${seriesId}&s=${season}&e=${episodeNo}`
        : `https://www.2embed.cc/embed/${movieId}`;
    case 'newMultiembed':
      return type === 'series'
        ? `https://multiembed.mov/?video_id=${seriesId}&tmdb=1&s=${season}&e=${episodeNo}`
        : `https://multiembed.mov/?video_id=${movieId}&tmdb=1`;
    case 'new2embed':
      return type === 'series'
        ? `https://2embed.org/embed/tv/${seriesId}/${season}/${episodeNo}`
        : `https://2embed.org/embed/movie/${movieId}`;
    case 'newAutoembed':
      return type === 'series'
        ? `https://autoembed.co/tv/tmdb/${movieId}-${season}-${episodeNo}`
        : `https://autoembed.co/movie/tmdb/${movieId}`;
    case 'vidsrc':
      return type === 'series'
        ? `https://vidsrc.xyz/embed/tv?tmdb=${seriesId}&season=${season}&episodeNo=${episodeNo}`
        : `https://vidsrc.xyz/embed/movie?tmdb=${movieId}/`;
    default:
      return '';
  }
};

export { getIframeSrc };