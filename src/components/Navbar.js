import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-amber-500 shadow-lg fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo + Title */}
          <a href="#home" className="flex items-center space-x-2">
            {/* Larger logo */}
            <img 
              src="/images/logo.jpg" 
              alt="Logo" 
              className="flex-shrink-0 h-14 w-14 md:h-16 md:w-16 object-cover rounded-full" 
            />
            {/* Responsive text */}
            <span 
              className="flex-shrink text-2xl md:text-4xl font-bold text-white transition-colors duration-300 hover:text-indigo-600 whitespace-nowrap truncate"
            >
              Dallas Tatvamasi's Sangam
            </span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-6 items-center">
            <a href="#home" className="text-white hover:text-gray-500 transition">Home</a>
            <a href="#calendar" className="text-white hover:text-gray-500 transition">Calendar</a>
            <a href="#services" className="text-white hover:text-gray-500 transition">Service</a>
            <a href="#gallery" className="text-white hover:text-gray-500 transition">Gallery</a>
            <a href="#contact" className="text-white hover:text-gray-500 transition">Contact</a>
          </div>
          
          {/* Mobile Toggle */}
          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-black`}>
        <a href="#home" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black">Home</a>
        <a href="#calendar" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black">Calendar</a>
        <a href="#services" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black">Service</a>
        <a href="#gallery" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black">Gallery</a>
        <a href="#contact" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
