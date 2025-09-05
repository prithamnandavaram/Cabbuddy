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
const rideSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
  price: Number,
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'canceled'],
    default: 'pending',
  }
});

async function testSearch() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MongoDB URI not found in environment variables');
      return;
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Register model
    const Ride = mongoose.model('Ride', rideSchema);
    
    // Test data
    const searchData = [
      { 
        date: '2025-09-09', 
        from: 'bengaluru', 
        to: 'yelhanka', 
        seat: 1 
      },
      { 
        date: '2025-09-10', 
        from: 'bengaluru', 
        to: 'yelhanka', 
        seat: 1 
      },
      // Test with different case
      { 
        date: '2025-09-09', 
        from: 'Bengaluru', 
        to: 'Yelahanka', 
        seat: 1 
      }
    ];
    
    for (const query of searchData) {
      console.log(`\n\nTesting search with params:`, query);
      
      const searchDate = new Date(query.date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate.getTime() + 24 * 60 * 60 * 1000);
      
      const filter = {
        'origin.place': { $regex: query.from, $options: 'i' },
        'destination.place': { $regex: query.to, $options: 'i' },
        'availableSeats': { $gte: Number(query.seat) },
        'startTime': { $gte: searchDate.toISOString(), $lt: nextDay.toISOString() }
      };
      
      console.log('Search filter:', JSON.stringify(filter, null, 2));
      
      const rides = await Ride.find(filter).lean();
      
      console.log(`Found ${rides.length} rides`);
      rides.forEach((ride, i) => {
        console.log(`\nRide ${i+1}:`);
        console.log(`From: ${ride.origin.place}`);
        console.log(`To: ${ride.destination.place}`);
        console.log(`Available Seats: ${ride.availableSeats}`);
        console.log(`Start Time: ${new Date(ride.startTime).toLocaleString()}`);
        console.log(`ISOString Date: ${ride.startTime}`);
      });
    }
    
    // Add additional debugging - check date range
    console.log('\n\nChecking if we have any rides in the database between Sep 8-11:');
    const startDate = new Date('2025-09-08');
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date('2025-09-11');
    endDate.setHours(23, 59, 59, 999);
    
    const dateRangeRides = await Ride.find({
      'startTime': { $gte: startDate.toISOString(), $lte: endDate.toISOString() }
    }).lean();
    
    console.log(`Found ${dateRangeRides.length} rides between Sep 8-11`);
    dateRangeRides.forEach((ride, i) => {
      console.log(`\nRide ${i+1}:`);
      console.log(`From: ${ride.origin.place}`);
      console.log(`To: ${ride.destination.place}`);
      console.log(`Start Time: ${new Date(ride.startTime).toLocaleString()}`);
      console.log(`ISO String: ${ride.startTime}`);
    });
    
  } catch (error) {
    console.error('Error testing search:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testSearch();
