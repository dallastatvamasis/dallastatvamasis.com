import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="scroll-mt-24 py-14 relative bg-blue-950">
      <div className="max-w-4xl mx-auto px-4 fade-in">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">Contact Us</h2>
        <form onSubmit={handleSubmit} className="bg-black p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <label className="block text-gray-100">Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-black" 
              placeholder="Your Name" 
              required
            />
          </div>
          <div>
            <label className="block text-gray-100">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-black" 
              placeholder="you@example.com" 
              required
            />
          </div>
          <div>
            <label className="block text-gray-100">Message</label>
            <textarea 
              rows="4" 
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-black" 
              placeholder="Your message..."
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-all duration-300"
          >
            Send Message
          </button>
        </form>
        <p className="text-center mt-4 text-white">
          Thank you for reaching out to Ayyappan Community. We will get back to you shortly. Swamiye Saranam Ayyappa.
        </p>
      </div>
    </section>
  );
};

export default Contact;
