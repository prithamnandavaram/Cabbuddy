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

// Define the schemas
const userSchema = new mongoose.Schema({
  name: String,
  profilePicture: String,
  stars: Number
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
  status: String,
  price: Number
});

// Function to find similar routes
async function findSimilarRoutes() {
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
    
    // Search for routes with similar names (case-insensitive)
    const originPattern = /(bengaluru|bangalore)/i;
    const destPattern = /(yelahanka|yelhanka)/i;
    
    const rides = await Ride.find({
      $or: [
        // Direct match
        {
          'origin.place': { $regex: originPattern },
          'destination.place': { $regex: destPattern }
        },
        // Match with swapped origin/destination
        {
          'origin.place': { $regex: destPattern },
          'destination.place': { $regex: originPattern }
        }
      ]
    }).lean();
    
    console.log(`Found ${rides.length} rides with similar routes`);
    
    if (rides.length > 0) {
      rides.forEach((ride, index) => {
        console.log(`\nRide ${index + 1}:`);
        console.log(`From: ${ride.origin.place}`);
        console.log(`To: ${ride.destination.place}`);
        console.log(`Start Time: ${new Date(ride.startTime).toLocaleString()}`);
        console.log(`End Time: ${ride.endTime ? new Date(ride.endTime).toLocaleString() : 'Not specified'}`);
        console.log(`Available Seats: ${ride.availableSeats}`);
        console.log(`Price: ${ride.price}`);
        console.log(`Status: ${ride.status || 'pending'}`);
        console.log(`ID: ${ride._id}`);
      });
    } else {
      console.log('No rides found with similar routes.');
    }
    
    // Also check for any rides containing Bengaluru or Yelahanka
    console.log('\nChecking for any rides containing Bengaluru or Yelahanka:');
    
    const anyRoutes = await Ride.find({
      $or: [
        { 'origin.place': { $regex: originPattern } },
        { 'destination.place': { $regex: originPattern } },
        { 'origin.place': { $regex: destPattern } },
        { 'destination.place': { $regex: destPattern } }
      ]
    }).lean();
    
    if (anyRoutes.length > 0) {
      console.log(`Found ${anyRoutes.length} rides involving Bengaluru or Yelahanka`);
      anyRoutes.forEach((ride, index) => {
        console.log(`\nRide ${index + 1}:`);
        console.log(`From: ${ride.origin.place}`);
        console.log(`To: ${ride.destination.place}`);
        console.log(`Start Time: ${new Date(ride.startTime).toLocaleString()}`);
      });
    } else {
      console.log('No rides found involving Bengaluru or Yelahanka.');
    }
    
  } catch (error) {
    console.error('Error searching for rides:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Execute the function
findSimilarRoutes();
