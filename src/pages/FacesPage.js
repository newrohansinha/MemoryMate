import React, { useState } from 'react';
import './FacesPage.css';

const FacesPage = () => {
  const [faces, setFaces] = useState(JSON.parse(localStorage.getItem('faces')) || []);
  const [newFace, setNewFace] = useState({ name: '', description: '', image: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddFace = () => {
    if (newFace.name && newFace.description) {
      const updatedFaces = [...faces, { ...newFace, id: Date.now() }];
      setFaces(updatedFaces);
      localStorage.setItem('faces', JSON.stringify(updatedFaces));
      setNewFace({ name: '', description: '', image: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteFace = (id) => {
    const updatedFaces = faces.filter(face => face.id !== id);
    setFaces(updatedFaces);
    localStorage.setItem('faces', JSON.stringify(updatedFaces));
  };

  return (
    <div className="container">
      <h2 className="title">People to Remember</h2>
      
      <div className="face-grid">
        {faces.length === 0 ? (
          <div className="empty-state">Nothing Yet. Click + To Add Faces</div>
        ) : (
          faces.map((face) => (
            <div key={face.id} className="face-card">
              <button
                onClick={() => handleDeleteFace(face.id)}
                className="delete-button"
              >
                &times;
              </button>
              <img src={face.image || 'https://via.placeholder.com/150'} alt={face.name} className="face-image" />
              <h3 className="face-name">{face.name}</h3>
              <p className="face-description">{face.description}</p>
            </div>
          ))
        )}
      </div>

      {!isAdding && (
        <button
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          +
        </button>
      )}

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add New Face</h3>
            <input
              type="text"
              placeholder="Name"
              value={newFace.name}
              onChange={(e) => setNewFace({ ...newFace, name: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Description"
              value={newFace.description}
              onChange={(e) => setNewFace({ ...newFace, description: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newFace.image}
              onChange={(e) => setNewFace({ ...newFace, image: e.target.value })}
              className="input"
            />
            <div className="button-group">
              <button
                className="button secondary"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                className="button primary"
                onClick={handleAddFace}
              >
                Add Face
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacesPage;