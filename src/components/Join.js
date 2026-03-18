import React from 'react';

const Join = () => {
  return (
    <section id="join" className="scroll-mt-24 py-16 bg-black">
      <div className="max-w-3xl mx-auto px-4 text-center fade-in">
        <h2 className="text-3xl font-semibold text-white mb-4">Join Our Community</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Become a part of Dallas Tatvamasi Sangam and celebrate the spirit of devotion together.
          All Ayyappa devotees and families are welcome.
        </p>
        <a
          href="mailto:dallastatvamasis@gmail.com?subject=Join%20Dallas%20Tatvamasi%20Sangam"
          className="inline-block px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-all duration-300"
        >
          Contact Us to Join
        </a>
      </div>
    </section>
  );
};

export default Join;
