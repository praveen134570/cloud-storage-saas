import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files/');
      setFiles(response.data);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setError('');

    try {
      await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedFile(null);
      fetchFiles(); // Refresh file list instantly
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Cloud Storage Dashboard</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>

      <p>Welcome back, <strong>{user?.username || user?.email || 'User'}</strong>!</p>

      {/* Upload Section */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
        <h3>Upload a New File</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
          <input 
            type="file" 
            onChange={(e) => setSelectedFile(e.target.files[0])} 
          />
          <button 
            type="submit" 
            disabled={uploading || !selectedFile}
            style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>

      {/* File List Section */}
      <div>
        <h3>Your Uploaded Files</h3>
        {files.length === 0 ? (
          <p style={{ color: '#6c757d' }}>No files uploaded yet. Try uploading one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {files.map((file) => (
              <li key={file.id} style={{ background: '#fff', padding: '12px', marginBottom: '8px', border: '1px solid #dee2e6', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>📁 <strong>{file.name}</strong></span>
                <span style={{ color: '#6c757d', fontSize: '14px' }}>{Math.round(file.size / 1024)} KB</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}