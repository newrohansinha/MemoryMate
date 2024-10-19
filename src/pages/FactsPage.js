import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const OptionsMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
  <button
  className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none bg-transparent"
  onClick={() => setIsOpen(!isOpen)}
>
  ...
</button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-100 rounded-md shadow-lg z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center"
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
          >
            <img src="/edit.png" alt="Edit" className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
          >
            <img src="/delete.png" alt="Delete" className="w-4 h-4 mr-2" />
            <span className="text-red-500">Delete</span>
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
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Fact Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative"
          >
            <div className="absolute top-2 right-2">
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
                className="w-full p-2 border rounded mb-2"
                autoFocus
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
            )}
            <p className="text-gray-600">{category.facts.length} facts</p>
            <button
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => navigate(`/category/${category.id}`)}
            >
              View Facts
            </button>
          </div>
        ))}
      </div>

      {!isAddingCategory && (
        <button
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-500 text-white rounded-full text-3xl shadow-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => setIsAddingCategory(true)}
        >
          +
        </button>
      )}

      {isAddingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Add New Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400"
                onClick={() => setIsAddingCategory(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
      <div className="container mx-auto py-8 px-4">
        <button
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          onClick={() => navigate('/facts')}
        >
          ← Back to Categories
        </button>
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center">Category not found</h2>
        <p className="text-center">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        onClick={() => navigate('/facts')}
      >
        ← Back to Categories
      </button>
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">{category.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {category.facts.map((fact) => (
          <div key={fact.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
            <div className="absolute top-2 right-2">
              <OptionsMenu
                onEdit={() => setEditingFact(fact)}
                onDelete={() => handleDeleteFact(fact.id)}
              />
            </div>
            {editingFact && editingFact.id === fact.id ? (
              <div>
                <input
                  type="text"
                  value={editingFact.text}
                  onChange={(e) => setEditingFact({ ...editingFact, text: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                  autoFocus
                />
                <input
                  type="text"
                  value={editingFact.imageUrl}
                  onChange={(e) => setEditingFact({ ...editingFact, imageUrl: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Image URL (optional)"
                />
                <button
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => handleEditFact(fact.id, editingFact)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                {fact.imageUrl && (
                  <img src={fact.imageUrl} alt="Fact" className="w-full h-48 object-cover mb-4 rounded" />
                )}
                <p className="text-gray-800">{fact.text}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {!isAddingFact && (
        <button
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-500 text-white rounded-full text-3xl shadow-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => setIsAddingFact(true)}
        >
          +
        </button>
      )}

      {isAddingFact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Add New Fact</h3>
            <input
              type="text"
              placeholder="Fact"
              value={newFact.text}
              onChange={(e) => setNewFact({ ...newFact, text: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newFact.imageUrl}
              onChange={(e) => setNewFact({ ...newFact, imageUrl: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400"
                onClick={() => setIsAddingFact(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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