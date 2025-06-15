import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { Paper, Grid, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Calendar = ({ events, onDayClick, onEventDrop }) => {
  // ... existing state and functions ...

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceDate = result.source.droppableId;
    const destinationDate = result.destination.droppableId;
    const eventId = result.draggableId;
    
    onEventDrop(eventId, sourceDate, destinationDate);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Paper elevation={3} sx={{ p: 2 }}>
        {/* ... existing header and weekday labels ... */}

        <Grid container>
          {daysInMonth.map(day => (
            <Grid 
              item 
              xs={1.7} 
              key={day.toString()}
              onClick={() => onDayClick(day)}
              sx={{
                height: 100,
                border: '1px solid #eee',
                p: 1,
                backgroundColor: isSameDay(day, new Date()) ? '#f0f7ff' : 'white',
                opacity: isSameMonth(day, currentDate) ? 1 : 0.5,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <Typography>{format(day, 'd')}</Typography>
              <Droppable droppableId={format(day, 'yyyy-MM-dd')}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {events
                      .filter(event => isSameDay(new Date(event.date), day))
                      .map((event, index) => (
                        <Draggable
                          key={event.id}
                          draggableId={event.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                backgroundColor: event.color || '#1976d2',
                                color: 'white',
                                padding: '2px 4px',
                                borderRadius: 4,
                                marginBottom: 2,
                                fontSize: '0.8rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                ...provided.draggableProps.style
                              }}
                            >
                              {event.title}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </DragDropContext>
  );
};

export default Calendar;