import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../firebase/auth';
import { useDarkMode } from '../DarkModeContext';
import { PROFILE_MENU_ITEMS } from './navConfig';

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const firstItem = dropdownRef.current?.querySelector('a, button');
      firstItem?.focus();
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-200 ${
          isDarkMode 
            ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
        }`}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
            {user.email[0].toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        // ... dropdown menu implementation with keyboard navigation ...
        // ... using PROFILE_MENU_ITEMS ...
      )}
    </div>
  );
};

export default ProfileDropdown;
