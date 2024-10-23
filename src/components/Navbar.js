import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navStyle = {
    backgroundColor: '#1E3A8A', // blue-900
    padding: '0.5rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed', // Changed from 'relative' to 'fixed'
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 50, // Ensure navbar stays above other content
  };

  const dropdownButtonStyle = {
    color: 'white',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    right: 0,
    marginTop: '0.5rem',
    width: '12rem',
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 60, // Higher than navbar to ensure dropdown appears above
  };

  const dropdownItemStyle = {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    color: '#374151', // gray-700
    textDecoration: 'none',
    display: 'block',
  };

  const dropdownItemHoverStyle = {
    backgroundColor: '#F3F4F6', // gray-100
  };

  // Add wrapper style to provide spacing below navbar
  const wrapperStyle = {
    paddingTop: '3.5rem', // Adjust based on navbar height
  };

  return (
    <>
      <div style={wrapperStyle}>
        <nav style={navStyle}>
          {/* Placeholder to keep layout balanced */}
          <div style={{ width: '1.5rem' }}></div>

          {/* Home Button */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Link to="/">
              <img
                src={`${process.env.PUBLIC_URL}/home.png`}
                alt="Home"
                style={{ width: '1.5rem', height: '1.5rem', backgroundColor: 'transparent' }}
              />
            </Link>
          </div>

          {/* Dropdown Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleDropdown}
              style={dropdownButtonStyle}
            >
              <img
                src={`${process.env.PUBLIC_URL}/more.png`}
                alt="More"
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </button>

            {isDropdownOpen && (
              <div style={dropdownMenuStyle}>
                <Link to="/faces" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Faces
                </Link>
                <Link to="/facts" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Facts
                </Link>
                <Link to="/todo" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  To-Do
                </Link>
                <Link to="/medications" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Medications
                </Link>
                <Link to="/ai-assistant" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  AI Assistant
                </Link>
                <Link to="/emergency-contact" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Emergency Contact
                </Link>
                <Link to="/practice" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Practice
                </Link>
                <Link to="/practice-reminder" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Practice Reminder
                </Link>
                <Link to="/ai-chat" style={dropdownItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  AI Chat
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;