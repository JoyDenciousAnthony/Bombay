import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  InputAdornment,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AddUserForm() {
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto'}}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile Information
          </Typography>

          {/* Avatar Upload */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={avatar}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <label htmlFor="avatar-upload">
              <input
                accept="image/*"
                id="avatar-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              <IconButton color="primary" component="span" aria-label="upload avatar">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          {/* Form Fields */}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField label="First Name" fullWidth />
            <TextField label="Last Name" fullWidth />
            <TextField label="Email" type="email" fullWidth placeholder="example@mail.com" />
            <TextField label="Department" fullWidth />
            <TextField label="Occupation" fullWidth />

            
            {/* Gender Dropdown */}
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                label="Gender"
                onChange={handleGenderChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>


            <FormControl fullWidth>
              <InputLabel id="gender-label">User Type</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                label="Gender"
                onChange={handleGenderChange}
              >
                <MenuItem value="user01">user 01</MenuItem>
                <MenuItem value="user02">user 02</MenuItem>
                <MenuItem value="user03">user 03</MenuItem>
              </Select>
            </FormControl>

            <TextField label="User Name" fullWidth />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button variant="contained" color="primary" fullWidth>
              Save Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}