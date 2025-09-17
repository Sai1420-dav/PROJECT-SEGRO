import React, { useState } from 'react';
import { Menu, X, Home, LogIn, HelpCircle, User, Coins } from 'lucide-react';

interface HeaderProps {
  currentPoints: number;
  isLoggedIn: boolean;
  onLoginToggle: () => void;
}

export default function Header({ currentPoints, isLoggedIn, onLoginToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: LogIn, label: isLoggedIn ? 'Logout' : 'Login', href: '#login', onClick: onLoginToggle },
    { icon: HelpCircle, label: 'Support', href: '#support' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        {/* Update the logo reference to the correct image */}
            {/* Use the newly provided JPG for the logo and keep SVG as ultimate fallback */}
            <img
              src="/segro-logo-new.JPG"
              alt="Segro Logo"
              className="h-10"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
                (e.currentTarget as HTMLImageElement).src = '/logo.svg';
              }}
            />
        {/* Logo */}
        

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Points Display */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">{currentPoints} Points</span>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                item.onClick?.();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-md cursor-pointer"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </a>
          ))}
          {isLoggedIn && (
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-md mt-4">
              <Coins className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">{currentPoints} Points</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}