const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully');

    const admin = new Admin({
      email: 'snailintegral2@gmail.com',
      password: 'admin123',
      role: 'superadmin'
    });

    await admin.save();

    console.log('Admin user seeded successfully: snailintegral2@gmail.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
