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

// Search parameters
const searchParams = {
  origin: 'Bengaluru',
  destination: 'Yelahanka',
  date: '2025-09-09'
};

// Function to search for rides
async function searchRides() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MongoDB URI not found in environment variables');
      return;
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Parse the search date
    const searchDate = new Date(searchParams.date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(searchDate.getTime() + 24 * 60 * 60 * 1000);
    
    // Build the search query
    const filter = {
      'origin.place': new RegExp(searchParams.origin, 'i'),
      'destination.place': new RegExp(searchParams.destination, 'i'),
      'startTime': { $gte: searchDate.toISOString(), $lt: nextDay.toISOString() }
    };
    
    console.log('Search filter:', filter);
    
    // Execute the search
    const rides = await Ride.find(filter)
      .populate('creator', 'name profilePicture stars')
      .lean();
    
    console.log(`Found ${rides.length} rides matching search criteria`);
    
    if (rides.length > 0) {
      rides.forEach((ride, index) => {
        console.log(`\nRide ${index + 1}:`);
        console.log(`From: ${ride.origin.place}`);
        console.log(`To: ${ride.destination.place}`);
        console.log(`Start Time: ${new Date(ride.startTime).toLocaleString()}`);
        console.log(`End Time: ${new Date(ride.endTime).toLocaleString()}`);
        console.log(`Available Seats: ${ride.availableSeats}`);
        console.log(`Price: ${ride.price}`);
        console.log(`Creator: ${ride.creator ? ride.creator.name : 'Unknown'}`);
      });
    } else {
      console.log('No rides found matching the search criteria.');
      
      // Suggest creating a new ride
      console.log('\nWould you like to create a new ride for this route?');
      console.log(`Use the "Publish a ride" feature on the app to create a ride from ${searchParams.origin} to ${searchParams.destination} on ${searchParams.date}.`);
    }
  } catch (error) {
    console.error('Error searching for rides:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Execute the search
searchRides();
