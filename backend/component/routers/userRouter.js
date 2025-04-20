const express = require('express');
const route = express.Router();
const User = require('../db/schma/userSchma'); // Import the user model
const multer = require('multer');

// Store in memory or define disk storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

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


// route.post('/', async (req, res) => {

//   console.log('📦 Request Body:', req.body.first_name);

//   // const {
//   //   first_name,
//   //   last_name,
//   //   email,
//   //   department,
//   //   occupation,
//   //   gender,
//   //   type,
//   //   user_name, // corrected from 'user' to 'user_name'
//   //   password,
//   //   image, // Include image data from the frontend
//   // } = req.body;

//   // // Validate the required fields
//   // if (!first_name || !last_name || !email || !user_name || !password) {
//   //   return res.status(400).json({ message: 'All required fields must be provided' });
//   // }

//   // Prepare user data
//   const newUser = new User({
//     first_name:req.body.first_name,
//     last_name:req.body.last_name,
//     email:req.body.email,
//     department:req.body.department,
//     occupation:req.body.occupation,
//     gender:req.body.gender,
//     type:req.body.type,
//     user_name:req.body.user_name,
//     password:req.body.password,
//     image:req.body.image, // Handle image data
//   });
//   const savedUser = await newUser.save();
//   res.json(savedUser);
//   // try {
//   //   // Save user to the database
//   //   const savedUser = await newUser.save();
    
//   //   res.status(201).json(savedUser); // Send response with saved user
//   // } catch (error) {
//   //   console.error('Error saving user:', error);
//   //   res.status(500).json({ message: 'Error creating user!' });
//   // }
// });

route.post('/', async (req, res) => {
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
    image, // Base64 image
  } = req.body;

  console.log('📦 Request Body:', req.body.first_name); // Debugging

  // Validate the required fields
  if (!first_name || !last_name || !email || !user_name || !password) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  // Optionally, validate email format and password strength
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Prepare user data
  const newUser = new User({
    first_name,
    last_name,
    email,
    department,
    occupation,
    gender,
    type,
    user_name,
    password, // Note: Consider hashing the password before saving (for security)
    image, // Image data (Base64)
  });

  try {
    // Save user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // Respond with the saved user

  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error creating user!' });
  }
});

// Update route to use multer middleware
route.put('/update/:id', upload.single('avatar'), async (req, res) => {
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
    } = req.body;

    let imageData = req.body.avatar; // fallback

    // If file is uploaded, convert to base64
    if (req.file) {
      const buffer = req.file.buffer;
      const mimeType = req.file.mimetype;
      const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
      imageData = base64Image;
    }

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
          image: imageData,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error during update' });
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