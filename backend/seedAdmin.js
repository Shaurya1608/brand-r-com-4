const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    await Admin.deleteMany(); // Clear existing admins for a fresh start

    const admin = new Admin({
      email: 'admin@brandrcomm.com',
      password: 'password123',
      role: 'superadmin'
    });

    await admin.save();

    console.log('Admin user seeded successfully: admin@brandrcomm.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
