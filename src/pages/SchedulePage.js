import React, { useState } from 'react';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState(JSON.parse(localStorage.getItem('schedule')) || []);
  const [newTask, setNewTask] = useState({ task: '', time: '' });

  const handleAddTask = () => {
    const updatedSchedule = [...schedule, newTask];
    setSchedule(updatedSchedule);
    localStorage.setItem('schedule', JSON.stringify(updatedSchedule));
    setNewTask({ task: '', time: '' });
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Schedule</h2>
      <div className="grid grid-cols-1 gap-4">
        {schedule.map((item, index) => (
          <div key={index} className="p-4 rounded-md shadow-md bg-white">
            <p><strong>{item.task}</strong> at {item.time}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Task"
          value={newTask.task}
          onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
          className="p-2 border rounded-md w-full mb-2"
        />
        <input
          type="text"
          placeholder="Time"
          value={newTask.time}
          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
          className="p-2 border rounded-md w-full mb-4"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
    </div>
  );
};

export default SchedulePage;
