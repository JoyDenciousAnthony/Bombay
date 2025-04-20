const express = require('express');
const cors = require('cors');
const app = express();

require('./component/db/connection');
const userRoute = require('./component/routers/userRouter');




// CORS Fix 👇
app.use(cors({
    origin: 'http://localhost:3000', // Your React app
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json()); // Required to parse JSON body

// Routes
app.use('/user', userRoute);

// Start server
app.listen(9000, () => {
    console.log('Server running on http://localhost:9000');
});