import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define schemas
const userSchema = new mongoose.Schema({
  name: String,
  profilePicture: String,
  stars: Number,
  ridesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }]
});

const rideSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  passengers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  availableSeats: Number,
  origin: {
    place: String,
    coordinates: [Number]
  },
  destination: {
    place: String,
    coordinates: [Number]
  },
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'canceled'],
    default: 'pending',
  },
  price: Number
});

async function createRide() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MongoDB URI not found in environment variables');
      return;
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Register models
    const User = mongoose.model('User', userSchema);
    const Ride = mongoose.model('Ride', rideSchema);
    
    // Find the first admin user to set as creator
    const admin = await User.findOne().lean();
    
    if (!admin) {
      console.log('No users found in the database. Please create a user first.');
      return;
    }
    
    console.log(`Found user: ${admin._id}`);
    
    // Create a new ride for September 9th
    const startTime = new Date('2025-09-09T09:00:00');
    const endTime = new Date('2025-09-09T10:00:00');
    
    const newRide = new Ride({
      creator: admin._id,
      availableSeats: 2,
      origin: {
        place: 'Bengaluru',
        coordinates: []
      },
      destination: {
        place: 'Yelahanka',
        coordinates: []
      },
      startTime: startTime,
      endTime: endTime,
      status: 'pending',
      price: 150
    });
    
    await newRide.save();
    console.log('New ride created:', newRide);
    
    // Update user's ridesCreated array
    await User.findByIdAndUpdate(admin._id, { $push: { ridesCreated: newRide._id } });
    console.log('User updated with new ride');
    
    console.log('\nRide details:');
    console.log(`From: ${newRide.origin.place}`);
    console.log(`To: ${newRide.destination.place}`);
    console.log(`Date: September 9th, 2025`);
    console.log(`Time: ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`);
    console.log(`Price: ₹${newRide.price}`);
    console.log(`Available seats: ${newRide.availableSeats}`);
    
  } catch (error) {
    console.error('Error creating ride:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Execute the function
createRide();
