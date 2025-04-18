import React from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

export default function WorkForm() {
  return (
    <Box sx={{ width: '100%', margin: 'auto'}}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add Task
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField label="Title" fullWidth />
            <TextField label="Area" fullWidth />
            <TextField label="description" multiline rows={4} fullWidth />
            <Button variant="contained" color="primary" fullWidth>
              Submit Task
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
