import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App'; // Adjust this import path if needed
import emailjs from 'emailjs-com';
import './PracticeReminderPage.css'; // CSS file to manage styling for responsiveness

emailjs.init("ug_UtcV6i-Y0OXlRU"); // Replace with your actual EmailJS user ID

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PracticeReminderPage = () => {
  const { user } = useContext(AuthContext);
  const [reminders, setReminders] = useState(() => {
    const storedReminders = JSON.parse(localStorage.getItem('practiceReminders')) || [];
    return storedReminders;
  });
  const [newReminder, setNewReminder] = useState({ time: '', days: [] });
  const [isAdding, setIsAdding] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('practiceReminders', JSON.stringify(reminders));
  }, [reminders]);

  // Schedule reminders for all
  useEffect(() => {
    reminders.forEach(reminder => scheduleReminder(reminder));
  }, [reminders]);

  const handleAddReminder = () => {
    if (newReminder.time && newReminder.days.length > 0) {
      const updatedReminders = [...reminders, { ...newReminder, id: Date.now() }];
      setReminders(updatedReminders);
      setNewReminder({ time: '', days: [] });
      setIsAdding(false);
      scheduleReminder(newReminder); // Schedule a reminder for the new one
    } else {
      alert("Please select time and at least one day.");
    }
  };

  // Function to schedule reminders based on day and time
  const scheduleReminder = (reminder) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }); // Get current day (Mon, Tue, etc.)
    const [hours, minutes] = reminder.time.split(':');
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    if ((reminder.days.includes(currentDay) || reminder.days.includes("Every day")) && timeUntilReminder > 0) {
      setTimeout(() => sendEmailReminder(reminder), timeUntilReminder);
      console.log(`Reminder scheduled for ${reminderTime.toLocaleString()} (in ${timeUntilReminder / 60000} minutes)`);
    } else if (timeUntilReminder <= 0 && (reminder.days.includes(currentDay) || reminder.days.includes("Every day"))) {
      // If the time has already passed, send the reminder immediately
      console.log(`Time has passed for reminder. Sending immediately.`);
      sendEmailReminder(reminder);
    } else {
      console.log(`Reminder not scheduled for today.`);
    }
  };

  // Function to send email reminders
  const sendEmailReminder = (reminder) => {
    const emailParams = {
      to_name: user.name || user.email.split('@')[0],
      from_name: 'MemoryMate',
      practice_time: reminder.time,
      to_email: user.email,
    };

    emailjs.send('service_82rdlgk', 'template_yl577ff', emailParams)
      .then(response => {
        console.log('Email sent successfully:', response.status, response.text);
      })
      .catch(err => {
        console.error('Failed to send email:', err);
      });
  };

  // Handle selecting days of the week
  const handleDaySelect = (day) => {
    if (newReminder.days.includes(day)) {
      setNewReminder({ ...newReminder, days: newReminder.days.filter(d => d !== day) });
    } else {
      setNewReminder({ ...newReminder, days: [...newReminder.days, day] });
    }
  };

  // Handle "Every day" selection
  const handleEveryDaySelect = () => {
    if (newReminder.days.includes("Every day")) {
      setNewReminder({ ...newReminder, days: [] });
    } else {
      setNewReminder({ ...newReminder, days: ["Every day"] });
    }
  };

  const handleDeleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Practice Reminders</h2>
      <p className="text-xl mb-4">Current Time: {currentTime.toLocaleTimeString()}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {reminders.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No reminders set yet. Click + to add a reminder.
          </div>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="bg-white rounded-lg shadow-md p-4 relative">
              <button
                onClick={() => handleDeleteReminder(reminder.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
              >
                &times;
              </button>
              <p className="text-gray-600 mb-2">Time: {reminder.time}</p>
              <p className="text-gray-600 mb-2">Days: {reminder.days.includes("Every day") ? "Every day" : reminder.days.join(", ")}</p>
            </div>
          ))
        )}
      </div>

      {!isAdding && (
        <button
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-500 text-white rounded-full text-3xl shadow-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => setIsAdding(true)}
        >
          +
        </button>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Add New Reminder</h3>
            <input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  className={`px-4 py-2 flex-1 text-center rounded-md ${
                    newReminder.days.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-300'
                  }`}
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                </button>
              ))}
              <button
                className={`px-4 py-2 flex-1 text-center rounded-md ${
                  newReminder.days.includes("Every day") ? 'bg-blue-500 text-white' : 'bg-gray-300'
                }`}
                onClick={handleEveryDaySelect}
              >
                Every day
              </button>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAddReminder}
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeReminderPage;
