import Bus from '../models/Bus.js';
import User from '../models/User.js';
import Schedule from '../models/Schedule.js';
import { uploadMultipleImages } from '../services/cloudinaryService.js';

// Helper function to ensure images are always an array
const normalizeImages = (images) => {
  if (!images) return [];
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(images) ? images : [];
};

// Get all buses
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.findAll({
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Normalize images for each bus
    const normalizedBuses = buses.map(bus => ({
      ...bus.toJSON(),
      images: normalizeImages(bus.images),
      amenities: typeof bus.amenities === 'string' 
        ? JSON.parse(bus.amenities) 
        : (bus.amenities || [])
    }));

    res.json({ buses: normalizedBuses });
  } catch (error) {
    console.error('Get all buses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get buses by owner
export const getBusesByOwner = async (req, res) => {
  try {
    const ownerId = req.user.role === 'admin' ? req.query.ownerId : req.user.id;

    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }

    const buses = await Bus.findAll({
      where: { ownerId },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Normalize images for each bus
    const normalizedBuses = buses.map(bus => ({
      ...bus.toJSON(),
      images: normalizeImages(bus.images),
      amenities: typeof bus.amenities === 'string' 
        ? JSON.parse(bus.amenities) 
        : (bus.amenities || [])
    }));

    res.json({ buses: normalizedBuses });
  } catch (error) {
    console.error('Get buses by owner error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single bus
export const getBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Schedule,
          as: 'schedules',
          limit: 10,
          order: [['date', 'ASC']]
        }
      ]
    });

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Normalize images and amenities
    const normalizedBus = {
      ...bus.toJSON(),
      images: normalizeImages(bus.images),
      amenities: typeof bus.amenities === 'string' 
        ? JSON.parse(bus.amenities) 
        : (bus.amenities || [])
    };

    res.json({ bus: normalizedBus });
  } catch (error) {
    console.error('Get bus error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create bus
export const createBus = async (req, res) => {
  try {
    // Check if user is owner or admin
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only bus owners can create buses' });
    }

    // Check if owner is approved
    if (req.user.role === 'owner' && !req.user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    const { busNumber, busName, busType, totalSeats, amenities } = req.body;
    const ownerId = req.user.role === 'admin' ? req.body.ownerId : req.user.id;

    // Validate required fields
    if (!busNumber || !busName || !busType || !totalSeats) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if bus number already exists
    const existingBus = await Bus.findOne({ where: { busNumber } });
    if (existingBus) {
      return res.status(400).json({ message: 'Bus number already exists' });
    }

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        // Convert multer files to format expected by cloudinary
        const files = Array.isArray(req.files) ? req.files : [req.files];
        imageUrls = await uploadMultipleImages(files, 'easysewa/buses');
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload images' });
      }
    }

    // Parse amenities if string
    const amenitiesArray = typeof amenities === 'string' 
      ? JSON.parse(amenities) 
      : (amenities || []);

    // Create bus
    const bus = await Bus.create({
      ownerId,
      busNumber,
      busName,
      busType,
      totalSeats: parseInt(totalSeats),
      amenities: amenitiesArray,
      images: imageUrls,
      rating: 0
    });

    res.status(201).json({
      message: 'Bus created successfully',
      bus
    });
  } catch (error) {
    console.error('Create bus error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update bus
export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { busName, busType, totalSeats, amenities } = req.body;

    const bus = await Bus.findByPk(id);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && bus.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    if (busName) bus.busName = busName;
    if (busType) bus.busType = busType;
    if (totalSeats) bus.totalSeats = parseInt(totalSeats);
    if (amenities) {
      bus.amenities = typeof amenities === 'string' 
        ? JSON.parse(amenities) 
        : amenities;
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      try {
        const files = Array.isArray(req.files) ? req.files : [req.files];
        const imageUrls = await uploadMultipleImages(files, 'easysewa/buses');
        bus.images = [...(bus.images || []), ...imageUrls];
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    await bus.save();

    res.json({
      message: 'Bus updated successfully',
      bus
    });
  } catch (error) {
    console.error('Update bus error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete bus
export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findByPk(id);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && bus.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await bus.destroy();

    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Delete bus error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

