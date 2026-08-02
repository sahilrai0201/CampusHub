const mongoose = require('mongoose');
const dns = require('dns');
const User = require('../models/User');
const Department = require('../models/Department');

dns.setDefaultResultOrder('ipv4first');

// Function to configure fallback DNS servers globally
const applyFallbackDNS = () => {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('DNS fallback configured using public servers (8.8.8.8, 1.1.1.1)');
  } catch (e) {
    console.error('DNS override failed:', e.message);
  }
};

// Check if an error is DNS-related
const isDNSError = (err) => {
  const code = err.code || '';
  const message = err.message || '';
  return (
    code === 'ENOTFOUND' ||
    code === 'EAI_AGAIN' ||
    message.includes('querySrv') ||
    message.includes('queryTxt') ||
    message.includes('ECONNREFUSED')
  );
};


// Keep a reference to the memory server instance to prevent garbage collection
let memoryServerInstance = null;

const seedIfEmpty = async () => {
  try {
    // 1. Seed Departments independently
    const departmentsCount = await Department.countDocuments();
    if (departmentsCount === 0) {
      console.log('Database departments are empty. Seeding departments...');
      const departments = [
        { name: 'Computer Science & Engineering' },
        { name: 'Information Technology' },
        { name: 'Electronics & Communication Engineering' },
        { name: 'Mechanical Engineering' }
      ];
      for (const dep of departments) {
        let existingDep = await Department.findOne({ name: dep.name });
        if (!existingDep) {
          await Department.create(dep);
        }
      }
      console.log('Departments seeded successfully!');
    } else {
      console.log('Departments already exist. Skipping department seeding.');
    }

    // 2. Seed Admin Account independently
    const adminEmail = 'admin@campushub.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      console.log('Admin account is missing. Seeding admin account...');
      await User.create({
        name: 'CampusHub System Admin',
        email: adminEmail,
        password: 'adminpassword', // Will be hashed by pre-save hook
        role: 'admin',
      });
      console.log('Admin account seeded successfully!');
      console.log('Default credentials: admin@campushub.com / adminpassword');
    } else {
      console.log('Admin account already exists. Skipping admin seeding.');
    }
  } catch (err) {
    console.error('Failed to auto-seed database:', err.message);
  }
};

const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI || 'mongodb://localhost:27017/campushub';
  const localURI = 'mongodb://127.0.0.1:27017/campushub';
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

  let connected = false;

  // 1. Try primary connection using default system DNS
  try {
    console.log('Connecting to primary MongoDB database...');
    const conn = await mongoose.connect(primaryURI, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected (Primary): ${conn.connection.host}`);
    connected = true;
  } catch (error) {
    console.warn(`Primary MongoDB connection failed: ${error.message}`);
    
    // 2. If failure is DNS-related, try configuring fallback DNS and reconnecting
    if (isDNSError(error)) {
      console.log('Detected DNS-related error. Applying public DNS fallback and retrying...');
      applyFallbackDNS();
      try {
        const conn = await mongoose.connect(primaryURI, { serverSelectionTimeoutMS: 5000 });
        console.log(`MongoDB Connected (Primary - Retry with Fallback DNS): ${conn.connection.host}`);
        connected = true;
      } catch (retryError) {
        console.warn(`Primary MongoDB connection failed after DNS fallback: ${retryError.message}`);
      }
    }
  }

  // 3. Fallback to Local MongoDB if primary failed and we are not in production/Render
  if (!connected) {
    if (primaryURI !== localURI && primaryURI !== 'mongodb://127.0.0.1:27017/campushub') {
      console.log('Attempting fallback to local MongoDB database...');
      try {
        const conn = await mongoose.connect(localURI, { serverSelectionTimeoutMS: 3000 });
        console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
        connected = true;
      } catch (localError) {
        console.warn(`Local MongoDB connection failed: ${localError.message}`);
      }
    }
  }

  // 4. Fallback to In-Memory MongoDB or Fail
  if (connected) {
    await seedIfEmpty();
  } else {
    if (isProduction) {
      console.error('\n==================================================================');
      console.error('CRITICAL ERROR: Failed to connect to MongoDB in production.');
      console.error('In-memory database fallback is disabled in production to prevent data loss.');
      console.error('Please check your MONGO_URI and network/Atlas access settings.');
      console.error('==================================================================\n');
      process.exit(1);
    } else {
      console.warn('\n⚠️ WARNING: Database fell back to IN-MEMORY MongoDB. Any registered accounts or changes will be lost when the server restarts.\n');
      await connectInMemory();
    }
  }
};

const connectInMemory = async () => {
  try {
    console.log('Attempting to start local MongoDB in-memory database server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'campushub'
      }
    });
    const memoryURI = memoryServerInstance.getUri();
    const conn = await mongoose.connect(memoryURI);
    console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    await seedIfEmpty();
  } catch (memError) {
    console.error('\n==================================================================');
    console.error('CRITICAL ERROR: Failed to establish any MongoDB connection (Primary, Local, or In-Memory).');
    console.error(`In-Memory error: ${memError.message}`);
    console.error('==================================================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;
