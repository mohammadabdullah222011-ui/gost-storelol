const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost:27017/punisherstore', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  verified: Boolean,
  verificationCode: String
});

const User = mongoose.model('User', userSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

// Routes
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const user = new User({ name, email, password: hashedPassword, verified: false, verificationCode });
  await user.save();

  // Send verification email
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Verify Your Account',
    text: `Your verification code is: ${verificationCode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.json({ message: 'User registered, check email for verification code' });
});

app.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (user && user.verificationCode === code) {
    user.verified = true;
    await user.save();
    res.json({ message: 'Account verified' });
  } else {
    res.status(400).json({ message: 'Invalid code' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password) && user.verified) {
    const token = jwt.sign({ id: user._id }, 'secret-key');
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});