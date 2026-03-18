import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-950 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} Dallas Tatvamasi Sangam. All rights reserved.
        </p>
        <p className="text-amber-400 text-sm mt-1">
          Swamiye Saranam Ayyappa
        </p>
      </div>
    </footer>
  );
};

export default Footer;
