import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import connectDB from '../config/db.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    
    await connectDB();
    
    
    const existingSuperAdmin = await User.findOne({ 
      $or: [
        { role: "superadmin" },
        { role: "Super Admin" }
      ]
    });
    
    if (existingSuperAdmin) {
      console.log('\n❌ Super Admin already exists!');
      console.log(`📧 Email: ${existingSuperAdmin.email}`);
      console.log(`👤 Name: ${existingSuperAdmin.firstName} ${existingSuperAdmin.lastName}`);
      console.log('\n💡 If you forgot your password, you can reset it or create a new account.\n');
      process.exit(0);
    }

    
    const args = process.argv.slice(2);
    const email = args[0] || 'gideondadey@gmail.com';
    const password = args[1] || 'Admin123!@#';
    const firstName = args[2] || 'Super';
    const lastName = args[3] || 'Admin';

    console.log('\n🚀 Creating Super Admin Account...\n');

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const superAdmin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "superadmin",
      isVerified: true,
      forcePasswordChange: false
    });

    console.log('✅ Super Admin created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', `${firstName} ${lastName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('⚠️  Please change your password after first login!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating Super Admin:', error.message);
    if (error.code === 11000) {
      console.error('💡 Email already exists. Try a different email.\n');
    }
    process.exit(1);
  }
};

createSuperAdmin();
