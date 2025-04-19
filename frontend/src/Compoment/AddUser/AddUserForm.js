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
  CircularProgress,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AddUserForm() {
  const [gender, setGender] = useState('');
  const [userType, setUserType] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [occupation, setOccupation] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [errorMessage, setErrorMessage] = useState(''); // To handle error messages

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !userName || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      department: department,
      occupation: occupation,
      gender: gender,
      type: userType,
      user_name: userName,
      password: password,
      image: avatar, // Base64 image string
    };

    setIsLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:9000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User created:', data);
        setErrorMessage(''); // Clear any previous error message
      } else {
        setErrorMessage(data.message || 'Error creating user');
      }
    } catch (error) {
      setErrorMessage('Error creating user: ' + error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto' }}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile Information
          </Typography>

          {/* Avatar Upload */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={avatar} sx={{ width: 64, height: 64, mr: 2 }} />
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
            onSubmit={handleSubmit} // Form submission handler
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="First Name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
            <TextField
              label="Department"
              fullWidth
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <TextField
              label="Occupation"
              fullWidth
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />

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

            {/* User Type Dropdown */}
            <FormControl fullWidth>
              <InputLabel id="user-type-label">User Type</InputLabel>
              <Select
                labelId="user-type-label"
                value={userType}
                label="User Type"
                onChange={handleUserTypeChange}
              >
                <MenuItem value="user01">User 01</MenuItem>
                <MenuItem value="user02">User 02</MenuItem>
                <MenuItem value="user03">User 03</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="User Name"
              fullWidth
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            {/* Error Message */}
            {errorMessage && (
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            )}

            {/* Submit Button */}
            <Button variant="contained" color="primary" fullWidth type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Save Profile'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
