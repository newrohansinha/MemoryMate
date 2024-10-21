import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-blue-500 py-2 px-4 flex justify-between items-center">
      <div className="w-6"> {/* Placeholder to balance the layout */}
      </div>
      <Link to="/" className="text-white flex items-center justify-center">
        <img src={`${process.env.PUBLIC_URL}/home.png`} alt="Home" className="w-5 h-5" />
      </Link>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="text-white focus:outline-none"
        >
          <img src={`${process.env.PUBLIC_URL}/more.png`} alt="More" className="w-5 h-5" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <Link to="/faces" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Faces</Link>
            <Link to="/facts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Facts</Link>
            <Link to="/todo" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">To-Do</Link>
            <Link to="/medications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Medications</Link>
            <Link to="/ai-assistant" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">AI Assistant</Link>
            <Link to="/emergency-contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Emergency Contact</Link>
            <Link to="/practice" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Practice</Link> {/* Practice Page */}
            <Link to="/practice-reminder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Practice Reminder</Link> {/* Practice Reminder Page */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
