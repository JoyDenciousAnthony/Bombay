import React, { useState } from 'react';
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
  Button,
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
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function WorkView() {
  const [users, setUsers] = useState([
    { id: 1, Title: 'John', Aria: 'Doe', Description: 'john.doe@example.com', avatar: '' },
    { id: 2, Title: 'Jane', Aria: 'Smith', Description: 'jane.smith@example.com', avatar: '' },
    { id: 3, Title: 'Mike', Aria: 'Johnson', Description: 'mike.johnson@example.com', avatar: '' },
    { id: 4, Title: 'Sara', Aria: 'Williams', Description: 'sara.williams@example.com', avatar: '' },
    { id: 5, Title: 'Tom', Aria: 'Brown', Description: 'tom.brown@example.com', avatar: '' },
    { id: 6, Title: 'Emma', Aria: 'Davis', Description: 'emma.davis@example.com', avatar: '' },
    { id: 7, Title: 'Lucas', Aria: 'Miller', Description: 'lucas.miller@example.com', avatar: '' },
    { id: 8, Title: 'Olivia', Aria: 'Wilson', Description: 'olivia.wilson@example.com', avatar: '' },
    { id: 9, Title: 'Liam', Aria: 'Taylor', Description: 'liam.taylor@example.com', avatar: '' },
    { id: 10, Title: 'Sophia', Aria: 'Anderson', Description: 'sophia.anderson@example.com', avatar: '' },
    { id: 11, Title: 'Noah', Aria: 'Thomas', Description: 'noah.thomas@example.com', avatar: '' },
  ]);

  const [editingUserId, setEditingUserId] = useState(null);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [newUserData, setNewUserData] = useState({ firstName: '', lastName: '', email: '', avatar: '' });
  const [deletingUserId, setDeletingUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    switch (searchField) {
      case 'id':
        return user.id.toString().includes(term);
      case 'firstName':
        return user.firstName.toLowerCase().includes(term);
      case 'lastName':
        return user.lastName.toLowerCase().includes(term);
      case 'email':
        return user.email.toLowerCase().includes(term);
      default:
        return (
          user.id.toString().includes(term) ||
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
        );
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUserData({ ...newUserData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditUser = (user) => {
    setViewingUserId(null);
    setEditingUserId(user.id);
    setNewUserData({ Title: user.Title, Aria: user.Aria, Description: user.Description, avatar: user.avatar });
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map((user) => (user.id === editingUserId ? { ...user, ...newUserData } : user));
    setUsers(updatedUsers);
    setEditingUserId(null);
    setNewUserData({ Title: '', Aria: '', Description: '', avatar: '' });
  };

  const handleViewUser = (user) => {
    setEditingUserId(null);
    setViewingUserId(user.id);
  };

  const handleCloseView = () => setViewingUserId(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== deletingUserId));
    setDeletingUserId(null);
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto' }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Typography variant="h5">Task Table</Typography>
          </Box>

          {/* Search */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="search-field-label">Search By</InputLabel>
              <Select
                labelId="search-field-label"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="Title">First Name</MenuItem>
                <MenuItem value="Area">Last Name</MenuItem>
                <MenuItem value="Description">Email</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: '50%' }}
            />
          </Box>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Aria</TableCell>
                  {/* <TableCell>Description</TableCell> */}
                  <TableCell>Avatar</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.Title}</TableCell>
                    <TableCell>{user.Aria}</TableCell>
                    {/* <TableCell>{user.Description}</TableCell> */}
                    <TableCell><Avatar src={user.avatar || '/default-avatar.png'} /></TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="info" onClick={() => handleViewUser(user)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeletingUserId(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={Math.ceil(filteredUsers.length / usersPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingUserId)} onClose={() => setEditingUserId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Avatar
              alt="Avatar"
              src={newUserData.avatar || '/default-avatar.png'}
              sx={{ width: 100, height: 100, alignSelf: 'center' }}
            />
            {/* <Input type="file" accept="image/*" onChange={handleAvatarChange} /> */}
            <TextField label="Title" name="Title" value={newUserData.Title} onChange={handleInputChange} />
            <TextField label="Aria" name="Aria" value={newUserData.Aria} onChange={handleInputChange} />
            <TextField label="Description" name="Description" multiline rows={4} value={newUserData.Description} onChange={handleInputChange} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUserId(null)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={Boolean(viewingUserId)} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>View User</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {(() => {
            const user = users.find((u) => u.id === viewingUserId);
            return user ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>ID:</strong> {user.id}</Typography>
                <Typography><strong>Title:</strong> {user.Title}</Typography>
                <Typography><strong>Aria:</strong> {user.Aria}</Typography>
                <Typography><strong>Description:</strong> {user.Description}</Typography>
                <Avatar src={user.avatar || '/default-avatar.png'} sx={{ width: 56, height: 56 }} />
              </Box>
            ) : (
              <Typography>User not found.</Typography>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deletingUserId)} onClose={() => setDeletingUserId(null)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingUserId(null)} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
