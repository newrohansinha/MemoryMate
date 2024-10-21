import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const cards = [
    { title: 'People', icon: '/Face.png', route: '/faces' },
    { title: 'To-Do List', icon: '/list.png', route: '/todo' },
    { title: 'Medications', icon: '/medication.png', route: '/medications' },

    { title: <span>Important<br />Facts</span>, icon: '/facts.png', route: '/facts' },

    { title: 'Practice', icon: '/practice.png', route: '/practice' },
    { title: <span>Practice<br />Reminders</span>, icon: '/schedule.png', route: '/practice-reminder' },
  ];

  return (
    <div className="container">
      <h1 className="title">Your Daily Companion</h1>
      <p className="subtitle">Welcome back! What would you like to do today?</p>

      <div className="card-grid">
        {cards.map((card, index) => (
          <button
            key={index}
            className="card"
            onClick={() => navigate(card.route)}
          >
            <img src={card.icon} alt={card.title} className="icon" />
            <span className="card-title">{card.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;