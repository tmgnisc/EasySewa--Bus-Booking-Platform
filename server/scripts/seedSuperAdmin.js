import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import sequelize from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync User model
    await sequelize.sync({ alter: false });
    console.log('✅ User model synchronized.');

    // Super admin credentials
    const superAdminData = {
      name: 'Super Admin',
      email: 'admin@easysewa.com',
      password: 'admin123', // Change this in production
      phone: '+1234567890',
      role: 'admin',
      isApproved: true,
      isEmailVerified: true
    };

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: superAdminData.email } 
    });

    if (existingAdmin) {
      console.log('ℹ️  Super admin already exists.');
      console.log(`   Email: ${superAdminData.email}`);
      console.log(`   Password: ${superAdminData.password}`);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(superAdminData.password, 10);

    // Create super admin
    const superAdmin = await User.create({
      ...superAdminData,
      password: hashedPassword
    });

    console.log('✅ Super admin created successfully!');
    console.log('\n📋 Super Admin Credentials:');
    console.log(`   Email: ${superAdminData.email}`);
    console.log(`   Password: ${superAdminData.password}`);
    console.log(`   Role: ${superAdmin.role}`);
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();

