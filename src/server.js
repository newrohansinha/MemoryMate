const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cron = require('node-cron');
const cors = require('cors');

// Set your SendGrid API key here
sgMail.setApiKey('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'); // Use your actual API key

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

let tasks = [];

// Function to send email reminder
const sendEmailReminder = (to, task) => {
  const msg = {
    to: to,
    from: 'noreply@yourapp.com', // Replace with a verified sender email from your SendGrid account
    subject: `Reminder: ${task.title}`,
    text: `This is a reminder to complete your task: ${task.title}\n\nDetails: ${task.description}\nTime: ${task.time}`,
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Email sent to', to);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};

// Schedule email reminders using cron
const scheduleEmailReminder = (email, task) => {
  const taskTime = new Date(task.timestamp);
  const hours = taskTime.getHours();
  const minutes = taskTime.getMinutes();

  // Schedule the reminder for the exact time
  const cronExpression = `${minutes} ${hours} * * *`;

  cron.schedule(cronExpression, () => {
    sendEmailReminder(email, task);
  });
};

// Route to get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Route to add a new task and schedule an email reminder
app.post('/api/tasks', (req, res) => {
  const { title, description, time, email } = req.body;

  if (!title || !description || !time || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const task = { id: Date.now(), title, description, time, timestamp: new Date().toISOString() };
  tasks.push(task);

  // Schedule email reminder
  scheduleEmailReminder(email, task);

  res.status(201).json(task);
});

// Route to delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== taskId);
  res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
