import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';
import { useAuth } from '../../context/AuthContext';
import { MENU_ITEMS } from './navConfig';
import SearchModal from './SearchModal';
import ProfileDropdown from './ProfileDropdown';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { isDarkMode } = useDarkMode();
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-200 ${
      isDarkMode ? 'bg-dark-bg/90 border-dark-border' : 'bg-white/90 border-gray-200'
    } border-b`}
    role="navigation"
    aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />
          
          {/* Desktop Navigation */}
          <DesktopNav items={MENU_ITEMS} />
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <SearchModal />
            <ThemeToggle />
            {isLoading ? (
              <NavbarSkeleton />
            ) : (
              currentUser ? (
                <ProfileDropdown user={currentUser} />
              ) : (
                <LoginButton />
              )
            )}
            <MobileMenuButton />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav items={MENU_ITEMS} />
    </nav>
  );
};

export default Navbar;
