import React, { useState } from 'react';
import './App.css';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTranscript(null);

    try {
      const response = await fetch('http://localhost:3001/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setTranscript(data.transcript);
      } else {
        setError(data.error || 'Failed to fetch transcript');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Transcript Fetcher</h1>
        
        <form onSubmit={handleSubmit} className="transcript-form">
          <div className="input-group">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL or ID"
              className="url-input"
              required
            />
            <button 
              type="submit" 
              disabled={loading || !videoUrl || !isValidYouTubeUrl(videoUrl)}
              className="fetch-button"
            >
              {loading ? 'Fetching...' : 'Get Transcript'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {loading && (
          <div className="loading">
            <p>Fetching transcript...</p>
          </div>
        )}

        {transcript && (
          <div className="transcript-container">
            <h2>Transcript</h2>
            <div className="transcript-text">
              {transcript.map((item, index) => (
                <div key={index} className="transcript-item">
                  <span className="timestamp">
                    {Math.floor(item.start / 60)}:{String(Math.floor(item.start % 60)).padStart(2, '0')}
                  </span>
                  <span className="text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;