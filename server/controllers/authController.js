import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { uploadImage } from '../services/cloudinaryService.js';
import { sendVerificationEmail } from '../services/emailService.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Handle bus owner image uploads
    let busPhotoUrl = null;
    let busDocumentUrl = null;

    if (role === 'owner') {
      // Check if required files are uploaded
      if (!req.files || !req.files.busPhoto || !req.files.busDocument) {
        return res.status(400).json({ 
          message: 'Bus owners must upload bus photo and bus document' 
        });
      }

      try {
        // Upload bus photo (handle both single file and array)
        const busPhotoFile = Array.isArray(req.files.busPhoto) 
          ? req.files.busPhoto[0] 
          : req.files.busPhoto;
        const busPhotoResult = await uploadImage(busPhotoFile, 'easysewa/bus-photos');
        busPhotoUrl = busPhotoResult.url;

        // Upload bus document (handle both single file and array)
        const busDocumentFile = Array.isArray(req.files.busDocument) 
          ? req.files.busDocument[0] 
          : req.files.busDocument;
        const busDocumentResult = await uploadImage(busDocumentFile, 'easysewa/bus-documents');
        busDocumentUrl = busDocumentResult.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ 
          message: 'Failed to upload images. Please try again.' 
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'user',
      isApproved: role === 'admin' ? true : (role === 'owner' ? false : true),
      isEmailVerified: role === 'admin' ? true : false,
      emailVerificationToken: role === 'admin' ? null : emailVerificationToken,
      busPhoto: busPhotoUrl,
      busDocument: busDocumentUrl
    });

    // Send verification email (except for admin)
    if (role !== 'admin') {
      await sendVerificationEmail(email, emailVerificationToken, name);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isApproved: user.isApproved,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: role === 'owner' 
        ? 'Registration successful! Your account is pending admin approval. Please check your email to verify your account.'
        : 'User registered successfully. Please check your email to verify your account.',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await User.findOne({ 
      where: { emailVerificationToken: token } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    res.json({ 
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isApproved: user.isApproved,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'emailVerificationToken'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

