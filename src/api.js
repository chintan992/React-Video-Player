// src/api.js

const VIDEO_SOURCES = {
  multiembed: {
    name: 'Vidlink',
    quality: 'HD',
  },
  autoembed: {
    name: 'AutoEmbed',
    quality: 'HD',
  },
  '2embed': {
    name: '2Embed',
    quality: 'HD',
  },
  newMultiembed: {
    name: 'MultiEmbed',
    quality: 'Full HD',
  },
  new2embed: {
    name: '2Embed.org',
    quality: 'HD',
  },
  newAutoembed: {
    name: 'AutoEmbed.co',
    quality: 'Full HD',
  },
  vidsrc: {
    name: 'VidSrc',
    quality: 'HD',
  },
  moviesClub: {
    name: 'MoviesAPI',
    quality: 'Full HD',
  },
  notonGo: {
    name: 'NontonGo',
    quality: 'HD',
  },
};

const getIframeSrc = (mediaData) => {
  const { type, apiType, seriesId, season, episodeNo, movieId } = mediaData;
  let baseUrl = '';
  
  // Anti-popup parameters for different providers
  const antiPopupParams = {
    multiembed: '&popups=0&block_popups=1',
    autoembed: '?block_popups=1',
    '2embed': '?popups=0',
    vidsrc: '&block_popups=1'
  };

  switch (apiType) {
    case 'multiembed':
      return type === 'series'
        ? `https://vidlink.pro/tv/${seriesId}/${season}/${episodeNo}?autoplay=true&title=true`
        : `https://vidlink.pro/movie/${movieId}?autoplay=true&title=true`;
    case 'autoembed':
      baseUrl = 'https://player.autoembed.cc/embed/';
      return type === 'series'
        ? `${baseUrl}tv/${seriesId}/${season}/${episodeNo}${antiPopupParams.autoembed}?autoplay=true`
        : `${baseUrl}movie/${movieId}${antiPopupParams.autoembed}?autoplay=true`;
    case '2embed':
      return type === 'series'
        ? `https://www.2embed.cc/embed/tv/${seriesId}&s=${season}&e=${episodeNo}${antiPopupParams['2embed']}`
        : `https://www.2embed.cc/embed/${movieId}${antiPopupParams['2embed']}`;
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
        ? `https://vidsrc.xyz/embed/tv?tmdb=${seriesId}&season=${season}&episodeNo=${episodeNo}&ds_lang=en`
        : `https://vidsrc.xyz/embed/movie?tmdb=${movieId}&ds_lang=en`;
    case 'moviesClub':
      return type === 'series'
        ? `https://moviesapi.club/tv/${seriesId}-${season}-${episodeNo}`
        : `https://moviesapi.club/movie/${movieId}`;
    case 'notonGo':
      return type === 'series'
        ? `https://www.NontonGo.win/embed/tv/${seriesId}/${season}/${episodeNo}`
        : `https://www.NontonGo.win/embed/movie/${movieId}`;
    default:
      return '';
  }
};

export { getIframeSrc, VIDEO_SOURCES };