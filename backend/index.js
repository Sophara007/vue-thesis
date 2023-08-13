const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const middleware = require('./middleware');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://sophara:iamkhmer1@cluster0.rnx6lwi.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});


app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
});

app.get('/protected-route', middleware, (req, res) => {
  // This route is protected and can only be accessed with a valid JWT token
  res.json({ message: 'Protected route accessed successfully' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
