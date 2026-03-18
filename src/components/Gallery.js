import React from 'react';

const Gallery = () => {
  const galleryImages = [
    {
      src: '/images/image1.jpg',
      alt: 'Devotion'
    },
    {
      src: '/images/Image4.png',
      alt: 'Pilgrimage'
    },
    {
      src: '/images/image2.jpg',
      alt: 'Seva'
    },
    {
      src: '/images/Image3.png',
      alt: 'Bhajan'
    }
  ];

  return (
    <section id="gallery" className="scroll-mt-24 py-16 bg-black section-transition">
      <div className="max-w-6xl mx-auto px-4 fade-in">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <img 
              key={index}
              src={image.src} 
              alt={image.alt} 
              className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300" 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
