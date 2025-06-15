import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, Snackbar, Alert } from '@mui/material';
import Calendar from './Calendar';  // Updated import path
import EventForm from './EventForm';  // Updated import path
import EventSearch from './EventSearch';
import { checkEventConflict, generateRecurringEvents } from './utils/eventUtils';

function App() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEventSubmit = (eventData) => {
    if (eventData.deleted) {
      setEvents(events.filter(e => e.id !== eventData.id));
      return;
    }

    // Check for conflicts
    const hasConflict = events.some(existingEvent => 
      checkEventConflict(eventData, existingEvent)
    );

    if (hasConflict) {
      setError('Event conflicts with an existing event!');
      return;
    }

    if (eventData.recurrence !== 'none') {
      const recurringEvents = generateRecurringEvents(
        eventData,
        new Date(new Date().setMonth(new Date().getMonth() + 3)) // Generate 3 months of events
      );
      setEvents(prev => [...prev, ...recurringEvents]);
    } else {
      if (eventData.id) {
        setEvents(events.map(e => e.id === eventData.id ? eventData : e));
      } else {
        const newEvent = {
          ...eventData,
          id: Date.now().toString(),
        };
        setEvents([...events, newEvent]);
      }
    }
  };

  const handleEventDrop = (eventId, sourceDate, destinationDate) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const newEvent = { ...event, date: destinationDate };
        const hasConflict = events.some(e => 
          e.id !== eventId && checkEventConflict(newEvent, e)
        );

        if (hasConflict) {
          setError('Cannot move event due to conflict!');
          return event;
        }
        return newEvent;
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <EventSearch onSearch={setSearchTerm} />
        <Calendar
          events={filteredEvents}
          onDayClick={handleDayClick}
          onEventDrop={handleEventDrop}
        />
        <EventForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleEventSubmit}
          event={selectedEvent}
          selectedDate={selectedDate}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default App;