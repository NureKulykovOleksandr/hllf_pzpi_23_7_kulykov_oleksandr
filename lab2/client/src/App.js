import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/api/videos')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error("Помилка:", err));
  }, []);

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!videoFile) {
        alert("Будь ласка, оберіть відеофайл з комп'ютера!");
        return;
    }

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('videoFile', videoFile);

    fetch('http://localhost:3001/api/videos', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(addedVideo => {
      setVideos([...videos, addedVideo]);
      setNewTitle('');
      setVideoFile(null);
      document.getElementById('fileInput').value = "";
    });
  };

  const handleAddComment = (videoId) => {
    const text = commentText[videoId];
    if (!text) return;

    fetch(`http://localhost:3001/api/videos/${videoId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    .then(res => res.json())
    .then(updatedVideo => {
      setVideos(videos.map(v => v.id === videoId ? updatedVideo : v));
      setCommentText({ ...commentText, [videoId]: '' });
    });
  };

  const handleDeleteVideo = (videoId) => {
    fetch(`http://localhost:3001/api/videos/${videoId}`, {
      method: 'DELETE',
    })
    .then(() => {
      setVideos(videos.filter(v => v.id !== videoId));
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Крутий Відеохостинг</h1>
      
      <div style={{ background: '#f4f4f4', padding: '15px', marginBottom: '20px' }}>
        <h3>Завантажити відео з комп'ютера</h3>
        <form onSubmit={handleAddVideo}>
          <input type="text" placeholder="Назва відео" value={newTitle} onChange={e => setNewTitle(e.target.value)} required style={{ marginRight: '10px' }} />
          <input type="file" accept="video/mp4,video/webm" id="fileInput" onChange={e => setVideoFile(e.target.files[0])} required style={{ marginRight: '10px' }} />
          <button type="submit">Додати відео</button>
        </form>
      </div>

      <div>
        {videos.map(video => (
          <div key={video.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h2>{video.title}</h2>
            <video src={video.url} controls width="400"></video>
            <br/>
            <button onClick={() => handleDeleteVideo(video.id)} style={{ background: 'red', color: 'white', marginTop: '10px' }}>Видалити відео 🗑️</button>
            
            <h4>Коментарі:</h4>
            <ul>
              {video.comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
            
            <input 
              type="text" 
              placeholder="Написати коментар..." 
              value={commentText[video.id] || ''} 
              onChange={e => setCommentText({ ...commentText, [video.id]: e.target.value })}
            />
            <button onClick={() => handleAddComment(video.id)}>Відправити</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;