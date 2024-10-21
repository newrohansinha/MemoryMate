import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App'; // Adjust this import path if needed
import emailjs from 'emailjs-com';

emailjs.init("iRjMijc_VqEvklQy3"); // Replace with your actual EmailJS user ID

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MedicationsPage = () => {
  const { user } = useContext(AuthContext);
  const [medications, setMedications] = useState(() => {
    const storedMeds = JSON.parse(localStorage.getItem('medications')) || [];
    return storedMeds.map(med => ({ ...med, taken: false })); // Reset taken status on page load
  });
  const [newMed, setNewMed] = useState({ name: '', dose: '', time: '', days: [], taken: false });
  const [isAdding, setIsAdding] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Reset taken status at midnight
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setMedications(meds => meds.map(med => ({ ...med, taken: false })));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  // Schedule reminders for all medications on component load
  useEffect(() => {
    medications.forEach(med => scheduleReminder(med));
  }, [medications]);

  const handleAddMed = () => {
    if (newMed.name && newMed.dose && newMed.time && newMed.days.length > 0) {
      const updatedMeds = [...medications, { ...newMed, id: Date.now() }];
      setMedications(updatedMeds);
      setNewMed({ name: '', dose: '', time: '', days: [], taken: false });
      setIsAdding(false);
      scheduleReminder(newMed); // Schedule a reminder for the new medication
    } else {
      alert("Please fill out all fields and select at least one day.");
    }
  };

  const handleToggleTaken = (id) => {
    setMedications(medications.map((med) =>
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const handleDeleteMed = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  // Handle selecting days of the week
  const handleDaySelect = (day) => {
    if (newMed.days.includes(day)) {
      setNewMed({ ...newMed, days: newMed.days.filter(d => d !== day) });
    } else {
      setNewMed({ ...newMed, days: [...newMed.days, day] });
    }
  };

  // Handle "Every day" selection
  const handleEveryDaySelect = () => {
    if (newMed.days.includes("Every day")) {
      setNewMed({ ...newMed, days: [] });
    } else {
      setNewMed({ ...newMed, days: ["Every day"] });
    }
  };

  // Function to schedule a reminder for a specific medication
  const scheduleReminder = (med) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }); // Get current day (Mon, Tue, etc.)
    const [hours, minutes] = med.time.split(':');
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    if ((med.days.includes(currentDay) || med.days.includes("Every day")) && timeUntilReminder > 0) {
      // Schedule the reminder for the current day if time is still in the future
      setTimeout(() => sendEmailReminder(med), timeUntilReminder);
      console.log(`Reminder scheduled for ${reminderTime.toLocaleString()} (in ${timeUntilReminder / 60000} minutes)`);
    } else if (timeUntilReminder <= 0 && (med.days.includes(currentDay) || med.days.includes("Every day"))) {
      // If the time has already passed, send the reminder immediately
      console.log(`Time has passed for ${med.name}. Sending reminder immediately.`);
      sendEmailReminder(med);
    } else {
      console.log(`Reminder not scheduled for ${med.name} today.`);
    }
  };

  // Function to send an email reminder
  const sendEmailReminder = (med) => {
    console.log("Sending medication reminder for:", med.name);
    const emailParams = {
      to_name: user.name || user.email.split('@')[0],
      from_name: 'MemoryMate',
      med_name: med.name,
      dosage: med.dose,
      med_time: med.time,
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

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Medications</h2>
      <p className="text-xl mb-4">Current Time: {currentTime.toLocaleTimeString()}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {medications.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            Nothing Yet. Click + To Add Medications
          </div>
        ) : (
          medications.map((med) => (
            <div key={med.id} className="bg-white rounded-lg shadow-md p-4 relative">
              <button
                onClick={() => handleDeleteMed(med.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
              >
                &times;
              </button>
              <h3 className="font-bold text-lg mb-2">{med.name}</h3>
              <p className="text-gray-600 mb-1">Dose: {med.dose}</p>
              <p className="text-gray-600 mb-2">Time: {med.time}</p>
              <p className="text-gray-600 mb-2">Days: {med.days.includes("Every day") ? "Every day" : med.days.join(", ")}</p>
              <button
                className={`w-full py-2 rounded-md ${
                  med.taken ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                onClick={() => handleToggleTaken(med.id)}
              >
                {med.taken ? 'Mark as Not Taken' : 'Mark as Taken'}
              </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">Add New Medication</h3>
            <input
              type="text"
              placeholder="Medication Name"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Dose"
              value={newMed.dose}
              onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="time"
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="mb-4">
              <div className="grid grid-cols-4 gap-2 mb-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    className={`px-2 py-1 rounded-full text-sm w-full h-10 ${newMed.days.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => handleDaySelect(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <button
                className={`px-2 py-1 rounded-full text-sm w-full h-10 ${newMed.days.includes("Every day") ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
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
                onClick={handleAddMed}
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationsPage;