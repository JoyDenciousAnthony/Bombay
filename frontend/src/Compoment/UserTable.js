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
  const [imageDialogUrl, setImageDialogUrl] = useState(null); // Full-size image viewer

  const [newUserData, setNewUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    image: '',
    avatarFile: null,
    department: '',
    occupation: '',
    gender: '',
    type: '',
    user_name: '',
    password: '',
    id_number: '',
    attan: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    setNewUserData((prev) => ({
      ...prev,
      avatarFile: e.target.files[0],
    }));
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setViewingUserId(null);
    setNewUserData({ ...user, avatarFile: null });
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
          image: '',
          avatarFile: null,
          department: '',
          occupation: '',
          gender: '',
          type: '',
          user_name: '',
          password: '',
          id_number: '',
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

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    switch (searchField) {
      case 'id_number':
        return user.id_number?.toLowerCase().includes(term);
      case 'first_name':
        return user.first_name?.toLowerCase().includes(term);
      case 'last_name':
        return user.last_name?.toLowerCase().includes(term);
      case 'email':
        return user.email?.toLowerCase().includes(term);
      default:
        return (
          user.id_number?.toLowerCase().includes(term) ||
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
                <MenuItem value="id_number">ID</MenuItem>
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
                    <TableCell>Image</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                      <TableCell>{user.id_number}</TableCell>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Avatar
                          src={user.image || '/default-avatar.png'}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => setImageDialogUrl(user.image || '/default-avatar.png')}
                        />
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
          <Avatar
            src={newUserData.image || '/default-avatar.png'}
            sx={{ mt: 2, width: 60, height: 60, cursor: 'pointer' }}
            onClick={() => setImageDialogUrl(newUserData.image || '/default-avatar.png')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingUserId(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingUserId} onClose={() => setEditingUserId(null)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="First Name" name="first_name" value={newUserData.first_name} onChange={handleInputChange} fullWidth />
          <TextField margin="dense" label="Last Name" name="last_name" value={newUserData.last_name} onChange={handleInputChange} fullWidth />
          <TextField margin="dense" label="Email" name="email" value={newUserData.email} onChange={handleInputChange} fullWidth />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>Change Avatar:</Typography>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            {newUserData.avatarFile && (
              <Avatar src={URL.createObjectURL(newUserData.avatarFile)} sx={{ mt: 1, width: 60, height: 60 }} />
            )}
            {!newUserData.avatarFile && newUserData.image && (
              <Avatar src={newUserData.image} sx={{ mt: 1, width: 60, height: 60 }} />
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
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeletingUserId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteUser}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Full-size Image Dialog */}
      <Dialog open={!!imageDialogUrl} onClose={() => setImageDialogUrl(null)} maxWidth="md">
        <DialogTitle>Full Size Image</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={imageDialogUrl}
              alt="Full Size"
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 10 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogUrl(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
