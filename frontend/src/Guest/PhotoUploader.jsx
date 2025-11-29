import React, { useState } from 'react';
import axios from 'axios';

const PhotoUploader = ({ invitationId }) => {
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!photo) {
      setMessage('Please select a photo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('invitationId', invitationId);

    try {
      const response = await axios.post(`http://localhost:5000/api/guests/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Upload successful!');
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Photo</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PhotoUploader;
