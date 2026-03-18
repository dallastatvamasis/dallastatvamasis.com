import React from 'react';

const Calendar = ({ events, loading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="calendar" className="scroll-mt-24 py-16 bg-black section-transition">
      <div className="max-w-6xl mx-auto px-4 fade-in">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">Community Calendar</h2>
        
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="event-card p-6 rounded-lg">
                <div className="text-amber-400 font-semibold text-lg mb-2">
                  {event.Event}
                </div>
                <div className="text-gray-300 text-sm mb-2">
                  📅 {formatDate(event.Date)} at {event.Time}
                </div>
                <div className="text-gray-300 text-sm mb-2">
                  📍 {event.Location}
                </div>
                <div className="text-gray-400 text-sm">
                  {event.Description}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Google Calendar Embed */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-center text-white mb-6">Live Calendar</h3>
          <div className="w-full">
            <iframe 
              src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=Asia%2FKolkata" 
              className="w-full h-96 border-0 rounded-lg shadow-lg" 
              allowFullScreen
              title="Community Calendar"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calendar;
