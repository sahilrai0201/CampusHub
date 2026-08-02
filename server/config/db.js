const mongoose = require('mongoose');
const dns = require('dns');
const User = require('../models/User');
const Department = require('../models/Department');

dns.setDefaultResultOrder('ipv4first');

const configureDNS = async () => {
  const primaryURI = process.env.MONGO_URI || '';
  if (primaryURI.startsWith('mongodb+srv://')) {
    try {
      const hostPart = primaryURI.split('@')[1]?.split('/')[0]?.split('?')[0];
      if (hostPart) {
        await dns.promises.resolveTxt(`_mongodb._tcp.${hostPart}`);
        console.log('DNS resolution succeeded with default system DNS.');
        return;
      }
    } catch (err) {
      console.warn(`Default system DNS failed to resolve host: ${err.message}. Applying fallback public DNS servers...`);
    }
  }
  
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('DNS fallback configured using public servers (8.8.8.8, 1.1.1.1)');
  } catch (e) {
    console.error('DNS override failed:', e.message);
  }
};


// Keep a reference to the memory server instance to prevent garbage collection
let memoryServerInstance = null;

const seedIfEmpty = async () => {
  try {
    const adminEmail = 'admin@campushub.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      console.log('Database is empty. Automatically seeding departments and admin account...');
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
      await User.create({
        name: 'CampusHub System Admin',
        email: adminEmail,
        password: 'adminpassword', // Will be hashed by pre-save hook
        role: 'admin',
      });
      console.log('Database seeded successfully!');
      console.log('Default credentials: admin@campushub.com / adminpassword');
    }
  } catch (err) {
    console.error('Failed to auto-seed database:', err.message);
  }
};

const connectDB = async () => {
  await configureDNS();
  const primaryURI = process.env.MONGO_URI || 'mongodb://localhost:27017/campushub';
  const localURI = 'mongodb://127.0.0.1:27017/campushub';

  try {
    console.log('Connecting to primary MongoDB database...');
    const conn = await mongoose.connect(primaryURI, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected (Primary): ${conn.connection.host}`);
    await seedIfEmpty();
  } catch (error) {
    console.warn(`Primary MongoDB connection failed: ${error.message}`);
    
    // Only attempt fallback if the primary URI is different from local URI
    if (primaryURI !== localURI && primaryURI !== 'mongodb://127.0.0.1:27017/campushub') {
      console.log('Attempting fallback to local MongoDB database...');
      try {
        const conn = await mongoose.connect(localURI, { serverSelectionTimeoutMS: 3000 });
        console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
        await seedIfEmpty();
      } catch (localError) {
        console.warn(`Local MongoDB connection failed: ${localError.message}`);
        console.warn('\n⚠️ WARNING: Database fell back to IN-MEMORY MongoDB. Any registered accounts or changes will be lost when the server restarts.\n');
        await connectInMemory();
      }
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
