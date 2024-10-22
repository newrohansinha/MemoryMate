import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { AuthContext } from '../App'; // Adjust the path if needed

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Assuming user's name is stored in AuthContext

  const cards = [
    { title: 'People', icon: '/Face.png', route: '/faces' },
    { title: 'To-Do List', icon: '/list.png', route: '/todo' },
    { title: 'Medications', icon: '/medication.png', route: '/medications' },
    { title: <span>Important<br />Facts</span>, icon: '/facts.png', route: '/facts' },
    { title: 'Practice', icon: '/practice.png', route: '/practice' },
    { title: <span>Practice<br />Reminders</span>, icon: '/schedule.png', route: '/practice-reminder' },
    { title: 'AI Chat', icon: '/chat.png', route: '/ai-chat' },
  ];

  return (
    <div className="container">
      <h1 className="title">Hi {user?.name?.split(' ')[0] || 'User'}! </h1>

      <p className="subtitle">Welcome back! Click on of the options bellow to ehance your Memory!</p>

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
