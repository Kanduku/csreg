const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const JWT_SECRET = 'your_jwt_secret'; // Replace with a strong secret

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://rest:abcd1234@cluster0.u9bglnq.mongodb.net/myDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define user schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  resume: String,
  password: String,
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
  }
});

const User = mongoose.model('User', userSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
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
app.post('/api/signup', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const resumePath = req.file ? req.file.path : '';

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      resume: resumePath,
    });

    await newUser.save();
    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ message: 'There was an error!', error });
  }
});

// API Endpoint for login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'There was an error!', error });
  }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Endpoint to submit personal details
app.post('/api/submit-details', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, birthDate, schoolingDetails, highestStudy, achievements, certifications, hobbies, skills, projects, githubLink, liveDeployLink } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

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
    };

   
    await user.save();
    res.status(200).json({ message: 'Details submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'There was an error!', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
