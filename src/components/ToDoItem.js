import React from 'react';

const ToDoItem = ({ task, completed, onToggle }) => {
  return (
    <div className={`p-4 bg-white rounded-md shadow-md ${completed ? 'bg-green-100' : ''}`}>
      <p className={`${completed ? 'line-through' : ''} text-gray-600`}>{task}</p>
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={onToggle}
      >
        {completed ? 'Mark as Incomplete' : 'Mark as Complete'}
      </button>
    </div>
  );
};

export default ToDoItem;
