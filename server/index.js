const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
const JWT_SECRET = 'your_jwt_secret'; // Replace with a strong secret

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb+srv://rest:abcd1234@cluster0.u9bglnq.mongodb.net/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  details: {
    firstName: String,
    lastName: String,
    birthDate: Date,
    schoolingDetails: String,
    highestStudy: String,
    achievements: String,
    certifications: String,
    hobbies: String,
    skills: String,
    projects: String,
    githubLink: String,
    liveDeployLink: String,
    resume: String, // Move resume here
  }
});

const User = mongoose.model('User', userSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// API Endpoint for signup
app.post('/api/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed. Please try again.', error });
  }
});

// API Endpoint for login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.', error });
  }
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Endpoint to submit personal details, including resume
app.post('/api/submit-details', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { firstName, lastName, birthDate, schoolingDetails, highestStudy, achievements, certifications, hobbies, skills, projects, githubLink, liveDeployLink } = req.body;

    user.details = {
      firstName,
      lastName,
      birthDate,
      schoolingDetails,
      highestStudy,
      achievements,
      certifications,
      hobbies,
      skills,
      projects,
      githubLink,
      liveDeployLink,
      resume: req.file ? req.file.path : user.details.resume,
    };

    await user.save();
    res.status(200).json({ message: 'Details submitted successfully' });
  } catch (error) {
    console.error('Submit details error:', error);
    res.status(500).json({ message: 'Failed to submit details. Please try again.', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
