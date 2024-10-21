import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App'; // Adjust this import path if needed
import emailjs from 'emailjs-com';
import './ToDoPage.css'; // Make sure this CSS file exists and is in the correct location

// Initialize EmailJS with your user ID
emailjs.init("iRjMijc_VqEvklQy3"); // Replace with your actual EmailJS user ID

const ToDoPage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', time: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTasks();
    scheduleReminders();
  }, []);

  // Fetch tasks either from localStorage or the server
  const fetchTasks = async () => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks)); // Load tasks from localStorage
      } else {
        // Fetch tasks from the server (or initialize with an empty array)
        const response = await fetch('/api/tasks', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          localStorage.setItem('tasks', JSON.stringify(data)); // Save fetched tasks to localStorage
        } else {
          console.error('Failed to fetch tasks from server');
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Handle adding a new task
  const handleAddTask = async () => {
    if (newTask.title && newTask.description && newTask.time) {
      const taskWithEmail = { ...newTask, email: user.email, id: Date.now() };
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(taskWithEmail),
        });
        if (response.ok) {
          const addedTask = await response.json();
          const updatedTasks = [...tasks, addedTask];
          setTasks(updatedTasks);
          localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save tasks to localStorage
          scheduleReminder(addedTask);
        } else {
          console.error('Failed to add task to server, adding locally');
          const updatedTasks = [...tasks, taskWithEmail];
          setTasks(updatedTasks);
          localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save tasks to localStorage
          scheduleReminder(taskWithEmail);
        }
      } catch (error) {
        console.error('Error adding task to server, adding locally:', error);
        const updatedTasks = [...tasks, taskWithEmail];
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save tasks to localStorage
        scheduleReminder(taskWithEmail);
      }

      setNewTask({ title: '', description: '', time: '' });
      setIsAdding(false);
    } else {
      alert('Please fill in all the fields before adding the task.');
    }
  };

  // Schedule reminders for tasks
  const scheduleReminder = (task) => {
    const now = new Date();
    const [hours, minutes] = task.time.split(':');
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // Calculate the time difference between the current time and the task's reminder time
    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    if (timeUntilReminder > 0) {
      // Schedule the reminder for the current day if time is still in the future
      setTimeout(() => sendEmailReminder(task), timeUntilReminder);
      console.log(`Reminder scheduled for ${reminderTime.toLocaleString()} (in ${timeUntilReminder / 60000} minutes)`);
    } else {
      // If the time has passed, send the reminder immediately
      sendEmailReminder(task);
      console.log(`Reminder time has passed. Sending reminder immediately for task: ${task.title}`);
    }
  };

  const scheduleReminders = () => {
    tasks.forEach(task => scheduleReminder(task));
  };

  // Send email reminder using EmailJS
  const sendEmailReminder = (task) => {
    console.log("Sending email reminder to:", user.email);
    const emailParams = {
      to_name: user.name || user.email.split('@')[0],
      from_name: 'MemoryMate',
      task_title: task.title,
      task_description: task.description,
      task_time: task.time,
      to_email: user.email,
    };
  
    emailjs.send('service_qqglm7d', 'template_bfoc4oh', emailParams)
      .then(response => {
        console.log('Email sent successfully:', response.status, response.text);
      })
      .catch(err => {
        console.error('Failed to send email:', err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle deleting a task and updating localStorage
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
      } else {
        console.error('Failed to delete task from server, deleting locally');
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
      }
    } catch (error) {
      console.error('Error deleting task from server, deleting locally:', error);
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
    }
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
              <p className="task-time">Time: {task.time}</p>
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
              name="title"
              placeholder="Title"
              value={newTask.title}
              onChange={handleInputChange}
              className="input"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newTask.description}
              onChange={handleInputChange}
              className="input"
            />
            <input
              type="time"
              name="time"
              value={newTask.time}
              onChange={handleInputChange}
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
