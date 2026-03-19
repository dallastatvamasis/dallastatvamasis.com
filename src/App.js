import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';
import './output.css';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Calendar from './components/Calendar';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Join from './components/Join';
import Footer from './components/Footer';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load events from CSV file
    Papa.parse('/data/events.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setEvents(results.data);
        setLoading(false);
      },
      error: (error) => {
        console.error('Error loading events:', error);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="App bg-black text-gray-100">
      <Navbar />
      <Banner />
      <Calendar events={events} loading={loading} />
      <Services />
      <Gallery />
      <Contact />
      <Join />
      <Footer />
    </div>
  );
}

export default App;
