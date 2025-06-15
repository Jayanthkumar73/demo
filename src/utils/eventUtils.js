import { addDays, addWeeks, addMonths, isSameDay, parseISO } from 'date-fns';

export const checkEventConflict = (event1, event2) => {
  if (!isSameDay(parseISO(event1.date), parseISO(event2.date))) {
    return false;
  }
  
  const time1 = event1.time.split(':').map(Number);
  const time2 = event2.time.split(':').map(Number);
  
  const start1 = time1[0] * 60 + time1[1];
  const start2 = time2[0] * 60 + time2[1];
  
  // Assuming each event is 1 hour long
  return Math.abs(start1 - start2) < 60;
};

export const generateRecurringEvents = (event, until) => {
  const events = [];
  const startDate = parseISO(event.date);
  let currentDate = startDate;

  while (currentDate <= until) {
    events.push({
      ...event,
      id: `${event.id}-${currentDate.getTime()}`,
      date: currentDate.toISOString().split('T')[0],
      isRecurring: true,
      parentEventId: event.id
    });

    switch (event.recurrence) {
      case 'daily':
        currentDate = addDays(currentDate, 1);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, 1);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, 1);
        break;
      default:
        currentDate = addDays(currentDate, 1);
    }
  }

  return events;
};