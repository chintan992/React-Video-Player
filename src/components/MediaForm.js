// src/components/MediaForm.js
import React from 'react';
import './MediaForm.css';

const MediaForm = React.memo(({ mediaData, setMediaData, handleSubmit }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMediaData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="media-form">
      <div className="form-group">
        <label className="form-label">Type</label>
        <div className="toggle-switch">
          <input 
            type="radio" 
            id="series" 
            name="type" 
            value="series" 
            checked={mediaData.type === 'series'} 
            onChange={handleInputChange}
          />
          <label htmlFor="series">Series</label>
          <input 
            type="radio" 
            id="movie" 
            name="type" 
            value="movie" 
            checked={mediaData.type === 'movie'} 
            onChange={handleInputChange}
          />
          <label htmlFor="movie">Movie</label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">API</label>
        <div className="toggle-switch api-toggle">
          <input 
            type="radio" 
            id="multiembed" 
            name="apiType" 
            value="multiembed" 
            checked={mediaData.apiType === 'multiembed'} 
            onChange={handleInputChange}
          />
          <label htmlFor="multiembed">Multiembed</label>
          <input 
            type="radio" 
            id="autoembed" 
            name="apiType" 
            value="autoembed" 
            checked={mediaData.apiType === 'autoembed'} 
            onChange={handleInputChange}
          />
          <label htmlFor="autoembed">Autoembed</label>
          <input 
            type="radio" 
            id="2embed" 
            name="apiType" 
            value="2embed" 
            checked={mediaData.apiType === '2embed'} 
            onChange={handleInputChange}
          />
          <label htmlFor="2embed">2embed</label>
        </div>
      </div>

      {mediaData.type === 'series' ? (
        <>
          <div className="form-group">
            <input
              type="text"
              name="seriesId"
              value={mediaData.seriesId}
              onChange={handleInputChange}
              placeholder="Series ID"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group half-width">
              <input
                type="number"
                name="season"
                value={mediaData.season}
                onChange={handleInputChange}
                placeholder="Season"
                required
              />
            </div>
            <div className="form-group half-width">
              <input
                type="number"
                name="episodeNo"
                value={mediaData.episodeNo}
                onChange={handleInputChange}
                placeholder="Episode"
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div className="form-group">
          <input
            type="text"
            name="movieId"
            value={mediaData.movieId}
            onChange={handleInputChange}
            placeholder="Movie ID"
            required
          />
        </div>
      )}

      <button type="submit" className="submit-button">Stream Now</button>
    </form>
  );
});

export default MediaForm;