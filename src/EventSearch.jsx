import React from 'react';
import { TextField, Box } from '@mui/material';

const EventSearch = ({ onSearch }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label="Search events"
        variant="outlined"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by title or description..."
      />
    </Box>
  );
};

export default EventSearch;