import React, { useState } from 'react';
import './ToDoPage.css';

const ToDoPage = () => {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      const updatedTasks = [...tasks, { ...newTask, id: Date.now(), timestamp: new Date().toISOString() }];
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setNewTask({ title: '', description: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container">
      <h2 className="title">To-Do List</h2>
      
      <div className="task-grid">
        {tasks.length === 0 ? (
          <div className="empty-state">Nothing Yet. Click + To Add Tasks</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="delete-button"
              >
                &times;
              </button>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-description">{task.description}</p>
              <p className="task-timestamp">{formatDate(task.timestamp)}</p>
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
            <h3 className="modal-title">Add New Task</h3>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
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
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoPage;