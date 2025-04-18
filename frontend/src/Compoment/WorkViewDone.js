import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Input,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function WorkViewDone() {
  const [users, setUsers] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', avatar: '' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', avatar: '' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com', avatar: '' },
    { id: 4, firstName: 'Sara', lastName: 'Williams', email: 'sara.williams@example.com', avatar: '' },
    { id: 5, firstName: 'Tom', lastName: 'Brown', email: 'tom.brown@example.com', avatar: '' },
    { id: 6, firstName: 'Emma', lastName: 'Davis', email: 'emma.davis@example.com', avatar: '' },
    { id: 7, firstName: 'Lucas', lastName: 'Miller', email: 'lucas.miller@example.com', avatar: '' },
    { id: 8, firstName: 'Olivia', lastName: 'Wilson', email: 'olivia.wilson@example.com', avatar: '' },
    { id: 9, firstName: 'Liam', lastName: 'Taylor', email: 'liam.taylor@example.com', avatar: '' },
    { id: 10, firstName: 'Sophia', lastName: 'Anderson', email: 'sophia.anderson@example.com', avatar: '' },
    { id: 11, firstName: 'Noah', lastName: 'Thomas', email: 'noah.thomas@example.com', avatar: '' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // New states for dialogs and the user to delete/view/edit
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewingUserData, setViewingUserData] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUserData, setEditingUserData] = useState(null);

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

  // Delete User Logic
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setOpenDeleteDialog(false); // Close dialog after deletion
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingUserData({ ...editingUserData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    handleDeleteUser(userToDelete);
  };

  // View User Logic
  const handleViewClick = (user) => {
    setViewingUserData(user);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewingUserData(null);
  };

  // Edit User Logic
  const handleEditClick = (user) => {
    setEditingUserData({ ...user });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingUserData(null);
  };

  const handleEditUser = () => {
    setUsers(users.map(user =>
      user.id === editingUserData.id ? editingUserData : user
    ));
    setOpenEditDialog(false);
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto' }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Typography variant="h5">User Table</Typography>
          </Box>

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
                  <TableRow key={user.id}>
                    <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Avatar src={user.avatar || '/default-avatar.png'} />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditClick(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="info" onClick={() => handleViewClick(user)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeleteClick(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={Math.ceil(filteredUsers.length / usersPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />

          {/* Delete Confirmation Dialog */}
          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this user?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={handleConfirmDelete}>Confirm</Button>
            </DialogActions>
          </Dialog>

          {/* View User Dialog */}
          <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
            <DialogTitle>View User</DialogTitle>
            <DialogContent sx={{ mt: 1 }}>
              {viewingUserData ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography><strong>ID:</strong> {viewingUserData.id}</Typography>
                  <Typography><strong>First Name:</strong> {viewingUserData.firstName}</Typography>
                  <Typography><strong>Last Name:</strong> {viewingUserData.lastName}</Typography>
                  <Typography><strong>Email:</strong> {viewingUserData.email}</Typography>
                  <Avatar src={viewingUserData.avatar || '/default-avatar.png'} sx={{ width: 56, height: 56 }} />
                </Box>
              ) : (
                <Typography>User not found.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog} variant="contained">Close</Button>
            </DialogActions>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

              <Avatar
                  alt="Avatar"
                  src={editingUserData?.avatar || '/default-avatar.png'}
                  sx={{ width: 100, height: 100 }}
                />
                <Input type="file" accept="image/*" onChange={handleAvatarChange} />
{/*                 
                <Avatar
                  alt="Avatar"
                  src={editingUserData?.avatar || '/default-avatar.png'}
                  sx={{ width: 100, height: 100 }}
                /> */}
                <TextField
                  label="First Name"
                  value={editingUserData?.firstName || ''}
                  onChange={(e) => setEditingUserData({ ...editingUserData, firstName: e.target.value })}
                />
                <TextField
                  label="Last Name"
                  value={editingUserData?.lastName || ''}
                  onChange={(e) => setEditingUserData({ ...editingUserData, lastName: e.target.value })}
                />
                <TextField
                  label="Email"
                  value={editingUserData?.email || ''}
                  onChange={(e) => setEditingUserData({ ...editingUserData, email: e.target.value })}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button onClick={handleEditUser}>Save</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}
