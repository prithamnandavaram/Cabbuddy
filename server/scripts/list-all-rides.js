import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ride from '../models/Ride.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Function to list all rides
async function listAllRides() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MongoDB URI not found in environment variables');
      return;
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Count all rides
    const rideCount = await Ride.countDocuments();
    console.log(`Total rides in database: ${rideCount}`);
    
    if (rideCount > 0) {
      // Get a sample of rides (up to 10)
      const rides = await Ride.find().limit(10).lean();
      
      console.log('\nSample Rides:');
      rides.forEach((ride, index) => {
        console.log(`\nRide ${index + 1}:`);
        console.log(`From: ${ride.origin.place}`);
        console.log(`To: ${ride.destination.place}`);
        console.log(`Start Time: ${new Date(ride.startTime).toLocaleString()}`);
        console.log(`Available Seats: ${ride.availableSeats}`);
        console.log(`Price: ${ride.price}`);
      });
      
      // List unique origin-destination pairs
      console.log('\nUnique Routes:');
      const routes = await Ride.aggregate([
        { 
          $group: { 
            _id: { origin: "$origin.place", destination: "$destination.place" },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      routes.forEach((route, index) => {
        console.log(`${index + 1}. ${route._id.origin} → ${route._id.destination} (${route.count} rides)`);
      });
    } else {
      console.log('The database does not contain any rides yet.');
      console.log('Be the first to create a ride using the "Publish a ride" feature!');
    }
  } catch (error) {
    console.error('Error listing rides:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Execute the function
listAllRides();
