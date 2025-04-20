import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  TextField,
  Avatar,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [newUserData, setNewUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
    avatarFile: null, // To store the selected file
    department: '',
    occupation: '',
    gender: '',
    type: '',
    user_name: '',
    password: '',
    attan: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch users from the backend
  useEffect(() => {
    axios
      .get('http://localhost:9000/user/all')
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleAvatarChange = (e) => {
    setNewUserData((prev) => ({
      ...prev,
      avatarFile: e.target.files[0], // Store the file object
    }));
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setViewingUserId(null);
    setNewUserData({ ...user, avatarFile: null }); // Clear avatar file when editing
  };

  const handleSaveEdit = () => {
    const formData = new FormData();
    Object.keys(newUserData).forEach((key) => {
      if (key !== 'avatarFile') {
        formData.append(key, newUserData[key]);
      }
    });
    if (newUserData.avatarFile) {
      formData.append('avatar', newUserData.avatarFile);
    }
 
    axios
      .put(`http://localhost:9000/user/update/${editingUserId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        fetchUsers();
        setEditingUserId(null);
        setNewUserData({
          first_name: '',
          last_name: '',
          email: '',
          avatar: '',
          avatarFile: null, // Reset avatar file
          department: '',
          occupation: '',
          gender: '',
          type: '',
          user_name: '',
          password: '',
          attan: [],
        });
      })
      .catch((err) => console.error('Error saving user:', err));
  };

  const handleDeleteUser = () => {
    axios
      .delete(`http://localhost:9000/user/delete/${deletingUserId}`)
      .then(() => {
        fetchUsers();
        setDeletingUserId(null);
      })
      .catch((err) => console.error('Error deleting user:', err));
  };

  const handleViewUser = (id) => {
    axios
      .get(`http://localhost:9000/user/find/${id}`)
      .then((res) => {
        setNewUserData(res.data);
        setViewingUserId(id);
      })
      .catch((err) => console.error('Error viewing user:', err));
  };

  const fetchUsers = () => {
    axios
      .get('http://localhost:9000/user/all')
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    switch (searchField) {
      case 'id':
        return user._id.toLowerCase().includes(term);
      case 'first_name':
        return user.first_name?.toLowerCase().includes(term);
      case 'last_name':
        return user.last_name?.toLowerCase().includes(term);
      case 'email':
        return user.email?.toLowerCase().includes(term);
      default:
        return (
          user._id.toLowerCase().includes(term) ||
          user.first_name?.toLowerCase().includes(term) ||
          user.last_name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term)
        );
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <Box sx={{ width: '100%', mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" align="center" mb={2}>
            User Table
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="search-field-label">Search By</InputLabel>
              <Select
                labelId="search-field-label"
                value={searchField}
                label="Search By"
                onChange={(e) => setSearchField(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="first_name">First Name</MenuItem>
                <MenuItem value="last_name">Last Name</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: '50%' }}
            />
          </Box>

          {loading ? (
            <Typography align="center">Loading users...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                      <TableCell>{user._id}</TableCell>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Avatar src={user.avatar || '/default-avatar.png'} />
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEditUser(user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="info" onClick={() => handleViewUser(user._id)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => setDeletingUserId(user._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && filteredUsers.length > usersPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={Math.ceil(filteredUsers.length / usersPerPage)}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewingUserId} onClose={() => setViewingUserId(null)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          <Typography><strong>First Name:</strong> {newUserData.first_name}</Typography>
          <Typography><strong>Last Name:</strong> {newUserData.last_name}</Typography>
          <Typography><strong>Email:</strong> {newUserData.email}</Typography>
          <Avatar src={newUserData.avatar} sx={{ mt: 2, width: 60, height: 60 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingUserId(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
<Dialog open={!!editingUserId} onClose={() => setEditingUserId(null)}>
  <DialogTitle>Edit User</DialogTitle>
  <DialogContent>
    <TextField
      margin="dense"
      label="First Name"
      name="first_name"
      value={newUserData.first_name}
      onChange={handleInputChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Last Name"
      name="last_name"
      value={newUserData.last_name}
      onChange={handleInputChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Email"
      name="email"
      value={newUserData.email}
      onChange={handleInputChange}
      fullWidth
    />

    {/* Avatar upload input */}
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" gutterBottom>Change Avatar:</Typography>
      <input type="file" accept="image/*" onChange={handleAvatarChange} />
      {/* Show preview if file is selected */}
      {newUserData.avatarFile && (
        <Avatar
          src={URL.createObjectURL(newUserData.avatarFile)}
          sx={{ mt: 1, width: 60, height: 60 }}
        />
      )}
      {/* Show existing avatar if no new file */}
      {!newUserData.avatarFile && newUserData.avatar && (
        <Avatar
          src={newUserData.avatar}
          sx={{ mt: 1, width: 60, height: 60 }}
        />
      )}
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditingUserId(null)}>Cancel</Button>
    <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
  </DialogActions>
</Dialog>


      {/* Delete Confirmation */}
      <Dialog open={!!deletingUserId} onClose={() => setDeletingUserId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingUserId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteUser}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}