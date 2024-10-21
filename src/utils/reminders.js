// reminders.js
export const scheduleReminder = (task, time, onReminder) => {
    const currentTime = new Date();
    const reminderTime = new Date(time);
  
    if (reminderTime > currentTime) {
      const timeDifference = reminderTime.getTime() - currentTime.getTime();
      
      setTimeout(() => {
        onReminder(task);
      }, timeDifference);
    }
  };
  
  export const formatReminderTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  