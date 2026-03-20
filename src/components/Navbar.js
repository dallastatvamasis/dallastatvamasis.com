import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsLiveOpen(false);
  };

  return (
    <nav className="bg-amber-500 shadow-lg fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* Logo + Title */}
          <a href="#home" className="flex items-center space-x-2">
            <img
              src="/images/logo.jpg"
              alt="Logo"
              className="flex-shrink-0 h-14 w-14 md:h-16 md:w-16 object-cover rounded-full"
            />
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

            {/* Live Dropdown */}
            <div className="relative" onMouseEnter={() => setIsLiveOpen(true)} onMouseLeave={() => setIsLiveOpen(false)}>
              <button className="flex items-center gap-1 text-white hover:text-gray-500 transition">
                🔴 Live
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLiveOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                  <a
                    href="/dts_bhajan_overlay.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-t-lg transition text-sm font-medium"
                  >
                    🎵 Bhajan Queue Overlay
                  </a>
                  <a
                    href="/scrolling-overlay.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-b-lg transition text-sm font-medium"
                  >
                    📜 Scrolling Ticker Overlay
                  </a>
                </div>
              )}
            </div>
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
        <div className="border-t border-gray-700">
          <p className="px-4 py-2 text-amber-400 text-xs uppercase tracking-widest font-semibold">🔴 Live Overlays</p>
          <a href="/dts_bhajan_overlay.html" target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black">🎵 Bhajan Queue Overlay</a>
          <a href="/scrolling-overlay.html" target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black">📜 Scrolling Ticker Overlay</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
