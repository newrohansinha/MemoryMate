import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './FactsPage.css';

const OptionsMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="options-menu">
      <button
        className="options-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        ...
      </button>
      {isOpen && (
        <div className="options-dropdown">
          <button className="option-item" onClick={() => { onEdit(); setIsOpen(false); }}>
            <img src="/pencil.png" alt="Edit" className="option-icon" />
            Edit
          </button>
          <button className="option-item" onClick={() => { onDelete(); setIsOpen(false); }}>
            <img src="/delete.png" alt="Delete" className="option-icon" />
            <span className="delete-text">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

const FactsPage = () => {
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('factCategories')) || []);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('factCategories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const updatedCategories = [...categories, { id: Date.now(), name: newCategory, facts: [] }];
      setCategories(updatedCategories);
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const handleEditCategory = (id, newName) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, name: newName } : category
    );
    setCategories(updatedCategories);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
  };

  return (
    <div className="container">
      <h2 className="title">Fact Categories</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="card-header">
              <OptionsMenu
                onEdit={() => setEditingCategory(category)}
                onDelete={() => handleDeleteCategory(category.id)}
              />
            </div>
            {editingCategory && editingCategory.id === category.id ? (
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                onBlur={() => handleEditCategory(category.id, editingCategory.name)}
                className="edit-input"
                autoFocus
              />
            ) : (
              <h3 className="category-name">{category.name}</h3>
            )}
            <p className="fact-count">{category.facts.length} facts</p>
            <button
              className="view-facts-button"
              onClick={() => navigate(`/category/${category.id}`)}
            >
              View Facts
            </button>
          </div>
        ))}
      </div>

      {!isAddingCategory && (
        <button
          className="add-button"
          onClick={() => setIsAddingCategory(true)}
        >
          +
        </button>
      )}

      {isAddingCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add New Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button
                className="modal-button cancel"
                onClick={() => setIsAddingCategory(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button add"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('factCategories')) || []);
  const [newFact, setNewFact] = useState({ text: '', imageUrl: '' });
  const [isAddingFact, setIsAddingFact] = useState(false);
  const [editingFact, setEditingFact] = useState(null);
  const navigate = useNavigate();

  const category = categories.find(c => c.id === parseInt(categoryId));

  useEffect(() => {
    localStorage.setItem('factCategories', JSON.stringify(categories));
  }, [categories]);

  const handleAddFact = () => {
    if (newFact.text.trim()) {
      const updatedCategories = categories.map(c => {
        if (c.id === parseInt(categoryId)) {
          return { ...c, facts: [...c.facts, { id: Date.now(), ...newFact }] };
        }
        return c;
      });
      setCategories(updatedCategories);
      setNewFact({ text: '', imageUrl: '' });
      setIsAddingFact(false);
    }
  };

  const handleEditFact = (factId, updatedFact) => {
    const updatedCategories = categories.map(c => {
      if (c.id === parseInt(categoryId)) {
        return {
          ...c,
          facts: c.facts.map(f => f.id === factId ? { ...f, ...updatedFact } : f)
        };
      }
      return c;
    });
    setCategories(updatedCategories);
    setEditingFact(null);
  };

  const handleDeleteFact = (factId) => {
    const updatedCategories = categories.map(c => {
      if (c.id === parseInt(categoryId)) {
        return {
          ...c,
          facts: c.facts.filter(f => f.id !== factId)
        };
      }
      return c;
    });
    setCategories(updatedCategories);
  };

  if (!category) {
    return (
      <div className="container">
        <button
          className="back-button"
          onClick={() => navigate('/facts')}
        >
          ← Back to Categories
        </button>
        <h2 className="title error">Category not found</h2>
        <p className="error-message">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <button
        className="back-button"
        onClick={() => navigate('/facts')}
      >
        ← Back to Categories
      </button>
      <h2 className="title">{category.name}</h2>
      <div className="fact-grid">
        {category.facts.map((fact) => (
          <div key={fact.id} className="fact-card">
            <div className="card-header">
              <OptionsMenu
                onEdit={() => setEditingFact(fact)}
                onDelete={() => handleDeleteFact(fact.id)}
              />
            </div>
            {editingFact && editingFact.id === fact.id ? (
              <div className="edit-fact">
                <input
                  type="text"
                  value={editingFact.text}
                  onChange={(e) => setEditingFact({ ...editingFact, text: e.target.value })}
                  className="edit-input"
                  autoFocus
                />
                <input
                  type="text"
                  value={editingFact.imageUrl}
                  onChange={(e) => setEditingFact({ ...editingFact, imageUrl: e.target.value })}
                  className="edit-input"
                  placeholder="Image URL (optional)"
                />
                <button
                  className="save-button"
                  onClick={() => handleEditFact(fact.id, editingFact)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                {fact.imageUrl && (
                  <img src={fact.imageUrl} alt="Fact" className="fact-image" />
                )}
                <p className="fact-text">{fact.text}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {!isAddingFact && (
        <button
          className="add-button"
          onClick={() => setIsAddingFact(true)}
        >
          +
        </button>
      )}

      {isAddingFact && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add New Fact</h3>
            <input
              type="text"
              placeholder="Fact"
              value={newFact.text}
              onChange={(e) => setNewFact({ ...newFact, text: e.target.value })}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newFact.imageUrl}
              onChange={(e) => setNewFact({ ...newFact, imageUrl: e.target.value })}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button
                className="modal-button cancel"
                onClick={() => setIsAddingFact(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button add"
                onClick={handleAddFact}
              >
                Add Fact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { FactsPage, CategoryPage };
export default FactsPage;