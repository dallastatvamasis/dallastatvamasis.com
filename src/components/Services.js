import React from 'react';

const Services = () => {
  const services = [
    {
      title: "Food Donation",
      description: "Providing meals to the needy during Mandala Pooja season."
    },
    {
      title: "Annadhanam",
      description: "Organizing free food distribution at the community hall."
    },
    {
      title: "Pilgrim Support",
      description: "Assisting devotees with travel and accommodation."
    }
  ];

  return (
    <section id="services" className="scroll-mt-24 py-16 bg-blue-950">
      <div className="max-w-6xl mx-auto px-4 fade-in">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">Community Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="service-card bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
              <h3 className="text-xl text-gray-700 font-semibold mb-2 service-card-title">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

