const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.error('DNS override failed:', e.message);
}

const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Department = require('../models/Department');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedData = async () => {
  const primaryURI = process.env.MONGO_URI || 'mongodb://localhost:27017/campushub';
  const localURI = 'mongodb://127.0.0.1:27017/campushub';

  try {
    // Connect to database
    try {
      console.log('Connecting to primary MongoDB database for seeding...');
      await mongoose.connect(primaryURI, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB connected (Primary) for seeding...');
    } catch (error) {
      console.warn(`Primary connection failed: ${error.message}`);
      if (primaryURI !== localURI && primaryURI !== 'mongodb://127.0.0.1:27017/campushub') {
        console.log('Attempting fallback to local MongoDB database for seeding...');
        await mongoose.connect(localURI, { serverSelectionTimeoutMS: 3000 });
        console.log('MongoDB connected (Local Fallback) for seeding...');
      } else {
        throw error;
      }
    }

    // Clear existing data (optional, but keep admins & departments clean for seeding)
    // For safety, let's just make sure we don't duplicate.
    
    // Seed Departments
    const departments = [
      { name: 'Computer Science & Engineering' },
      { name: 'Information Technology' },
      { name: 'Electronics & Communication Engineering' },
      { name: 'Mechanical Engineering' }
    ];

    console.log('Seeding departments...');
    const seededDeps = [];
    for (const dep of departments) {
      let existingDep = await Department.findOne({ name: dep.name });
      if (!existingDep) {
        existingDep = await Department.create(dep);
        console.log(`Created department: ${dep.name}`);
      } else {
        console.log(`Department already exists: ${dep.name}`);
      }
      seededDeps.push(existingDep);
    }

    // Seed Admin User
    const adminEmail = 'admin@campushub.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const admin = await User.create({
        name: 'CampusHub System Admin',
        email: adminEmail,
        password: 'adminpassword', // bcrypt pre-save hook will hash this
        role: 'admin',
      });
      console.log(`Admin account created!`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: adminpassword`);
    } else {
      console.log('Admin account already exists.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
