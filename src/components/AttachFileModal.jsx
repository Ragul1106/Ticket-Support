import React, { useState } from 'react';
import './AttachFileModal.css';

const AttachFileModal = ({ onClose, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      await onUpload(files);
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="attach-file-modal">
        <h3>Attach Files</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="file-preview">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span>{file.name}</span>
                <span>{(file.size / 1024).toFixed(2)} KB</span>
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttachFileModal;