import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { Paper, Grid, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Calendar = ({ events, onDayClick, onEventDrop }) => {
  const [currentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const blanks = Array(firstDayOfWeek).fill(null);
  const allDays = [...blanks, ...daysInMonth];
  const totalCells = Math.ceil(allDays.length / 7) * 7;
  const paddedDays = [...allDays, ...Array(totalCells - allDays.length).fill(null)];

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const sourceDate = result.source.droppableId;
    const destinationDate = result.destination.droppableId;
    const eventId = result.draggableId;
    onEventDrop(eventId, sourceDate, destinationDate);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Paper elevation={3} sx={{ width: '100%', margin: '20px auto', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        {/* Days Row */}
        <Grid container sx={{ backgroundColor: '#f8f9fa' }}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
            <Grid item xs key={day} sx={{ textAlign: 'center', borderRight: index < 6 ? '1px solid rgba(0,0,0,0.05)' : 'none', p: 1.5 }}>
              <Typography sx={{ color: '#5C7CDB', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>{day}</Typography>
            </Grid>
          ))}
        </Grid>
        {/* Dates Grid */}
        <Grid container sx={{ backgroundColor: '#fff' }}>
          {Array.from({ length: paddedDays.length / 7 }).map((_, weekIndex) => (
            <Grid container item xs={12} key={weekIndex}>
              {paddedDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                <Grid item xs key={dayIndex} sx={{ height: '120px', borderRight: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '12px', position: 'relative', backgroundColor: day && isSameMonth(day, currentDate) ? '#fff' : '#f4f4f4', cursor: day ? 'pointer' : 'default' }} onClick={() => day && onDayClick(day)}>
                  {day && (
                    <>
                      <Typography sx={{ color: isSameMonth(day, currentDate) ? '#2c3e50' : '#a0a0a0', fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>{format(day, 'd')}</Typography>
                      <Droppable droppableId={format(day, 'yyyy-MM-dd')}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} style={{ marginTop: '4px', minHeight: '80px' }}>
                            {events.filter(event => format(new Date(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).map((event, index) => (
                              <Draggable key={event.id} draggableId={event.id} index={index}>
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style, background: 'linear-gradient(135deg, #6B8DE3 0%, #5C7CDB 100%)', color: 'white', padding: '6px 12px', borderRadius: '6px', marginBottom: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.2s ease' }}>{event.title}</div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </>
                  )}
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </DragDropContext>
  );
};

export default Calendar;
