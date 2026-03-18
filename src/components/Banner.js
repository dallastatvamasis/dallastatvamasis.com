import React from 'react';

const Banner = () => {
  return (
    <header id="home" className="banner relative">
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Swamiye Saranam Ayyappa
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl">
          Welcome to our Ayyappan Community – a spiritual home for devotees dedicated to service, unity, and devotion.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="#calendar" className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all duration-300">
            Community Calendar
          </a>
          <a href="#gallery" className="px-6 py-3 bg-white text-amber-500 rounded-full hover:bg-gray-100 transition-all duration-300">
            Service Photos
          </a>
        </div>
      </div>
    </header>
  );
};

export default Banner;
