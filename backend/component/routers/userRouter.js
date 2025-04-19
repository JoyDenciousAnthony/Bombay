const express = require('express');
const route = express.Router();
const User = require('../db/schma/userSchma'); // Import the user model

// GET: Find user by ID
route.get('/find/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Get all users
route.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


route.post('/', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      department,
      occupation,
      gender,
      type,
      user_name,
      password,
      image,
      attan
    } = req.body;

    if (!first_name || !last_name || !email || !user_name || !password) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const formattedImage = image && image.data && image.content
      ? {
          data: Buffer.from(image.data, 'base64'),
          content: image.content
        }
      : undefined;

    const newUser = new User({
      first_name,
      last_name,
      email,
      department,
      occupation,
      gender,
      type,
      user_name,
      password,
      image: formattedImage,
      attan: attan || []
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('❌ Error saving user:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: `Duplicate value for: ${Object.keys(error.keyValue).join(', ')}`
      });
    }

    res.status(500).json({ message: error.message });
  }
});


// PUT: Update a user by ID
route.put('/update/:id', async (req, res) => {
  const { first_name, last_name, email, department, occupation, gender, type, user_name, password, image, attan } = req.body;
  
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          first_name,
          last_name,
          email,
          department,
          occupation,
          gender,
          type,
          user_name,
          password,
          image: image || { data: null, content: null },
          attan: attan || []
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// DELETE: Delete a user by ID
route.delete('/delete/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = route;
