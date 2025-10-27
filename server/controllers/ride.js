import Ride from "../models/Ride.js"
import User from "../models/User.js"; 

export const getRide = async (req, res, next) => {
  try{
    const ride = await Ride.findById(req.params.id).populate('creator', 'name age stars profile ridesCreated createdAt').lean(); 
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json(ride); 
  }catch(err){
    next(err);
  }
}

export const getAllRides = async (req, res, next) => {
  try{
    const rides = await Ride.find().populate('creator', 'name stars').lean(); 
    res.status(200).json(rides); 
  }catch(err){
    next(err);
  }
}

export const findRides = async (req, res, next) => {
  try {
    const { from, to, seat, date, sort, departure } = req.query;
    console.log('SEARCH QUERY:', req.query);
    
    // Validate required parameters
    if (!from || !to || !seat || !date) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required search parameters: from, to, seat, date' 
      });
    }

    // Parse and validate date
    const searchDate = new Date(date);
    if (isNaN(searchDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format provided'
      });
    }

    // Set search range for the entire day
    searchDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(searchDate.getTime() + 24 * 60 * 60 * 1000);

    // Validate seat number
    const seatCount = parseInt(seat);
    if (isNaN(seatCount) || seatCount < 1 || seatCount > 10) {
      return res.status(400).json({
        success: false,
        message: 'Seat count must be a number between 1 and 10'
      });
    }

    // Build base filter - case insensitive and trimmed search
    let filter = {
      'origin.place': new RegExp(from.trim(), 'i'),
      'destination.place': new RegExp(to.trim(), 'i'),
      'availableSeats': { $gte: seatCount },
      'startTime': { 
        $gte: searchDate.toISOString(), 
        $lt: nextDay.toISOString() 
      },
      'status': { $ne: 'canceled' } // Exclude canceled rides
    };

    // Add departure time filters if provided
    let departureFilters = [];
    if (departure) {
      const depArr = Array.isArray(departure) ? departure : departure.split(',');
      depArr.forEach((d) => {
        if (d === 'departure_before_six_am') {
          departureFilters.push({
            startTime: { 
              $gte: searchDate.toISOString(), 
              $lt: new Date(searchDate.getTime() + 6 * 60 * 60 * 1000).toISOString() 
            }
          });
        } else if (d === 'departure_six_to_noon') {
          departureFilters.push({
            startTime: { 
              $gte: new Date(searchDate.getTime() + 6 * 60 * 60 * 1000).toISOString(), 
              $lt: new Date(searchDate.getTime() + 12 * 60 * 60 * 1000).toISOString() 
            }
          });
        } else if (d === 'departure_noon_to_six') {
          departureFilters.push({
            startTime: { 
              $gte: new Date(searchDate.getTime() + 12 * 60 * 60 * 1000).toISOString(), 
              $lt: new Date(searchDate.getTime() + 18 * 60 * 60 * 1000).toISOString() 
            }
          });
        }
      });
    }

    if (departureFilters.length > 0) {
      filter = { ...filter, $or: departureFilters };
    }

    // Sorting options
    let sortOption = { startTime: 1 }; // Default: earliest departure
    if (sort === 'Price') sortOption = { price: 1 };
    if (sort === 'Shortest ride') sortOption = { endTime: 1 };

    console.log('Search filter:', JSON.stringify(filter, null, 2));

    // Execute search with better error handling
    const rides = await Ride.find(filter)
      .populate('creator', 'name profilePicture stars')
      .sort(sortOption)
      .lean();

    console.log(`Found ${rides.length} rides`);

    res.status(200).json({ 
      success: true, 
      count: rides.length,
      rides: rides 
    });
    
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      message: 'Search failed. Please try again.',
      error: err.message
    });
  }
}

export const joinRide = async (req, res, next) =>{
  try{
    const ride = await Ride.findById(req.params.id);

    if (ride.passengers.includes(req.user.id)) {
      res.status(400).json('You already joined this ride!');
    }
    if (ride.passengers.length >= ride.availableSeats) {
      res.status(400).json('Ride is full!');
    }

    await Ride.updateOne(
      { _id: ride._id },
      { $push: { passengers: req.user.id }, $inc: { availableSeats: -1 } }
    ),
    await User.updateOne(
      { _id: req.user.id },
      { $push: { ridesJoined: ride._id } }
    ),

    res.status(200).json({ message: 'Successfully joined the ride!' });
  }catch(err){
    next(err);
  }
}

export const createRide = async (req, res, next) => {
  try {
    console.log("createRide called, user:", req.user);
    console.log("Request body:", req.body);
    
    if (!req.user || !req.user.id) {
      console.log("User ID not found in request");
      return res.status(401).json({
        success: false,
        message: "User authentication failed. Please log in again."
      });
    }

    // Validate required fields
    const { availableSeats, origin, destination, startTime, endTime, price } = req.body;
    
    if (!availableSeats || !origin?.place || !destination?.place || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided: seats, origin, destination, start time, end time"
      });
    }

    // Validate dates
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format provided"
      });
    }

    if (startDate < now) {
      return res.status(400).json({
        success: false,
        message: "Start time cannot be in the past"
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time"
      });
    }

    // Validate seats and price
    if (availableSeats < 1 || availableSeats > 10) {
      return res.status(400).json({
        success: false,
        message: "Available seats must be between 1 and 10"
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative"
      });
    }

    // Create ride with validated data
    const rideData = {
      ...req.body,
      creator: req.user.id,
      startTime: startDate,
      endTime: endDate,
      status: 'pending'
    };

    const newRide = new Ride(rideData);
    await newRide.save();
    
    // Update user's ridesCreated array
    await User.findByIdAndUpdate(req.user.id, { 
      $push: { ridesCreated: newRide._id } 
    });
    
    console.log("Ride created successfully:", newRide);
    
    res.status(201).json({
      success: true,
      message: "Ride created successfully",
      ride: newRide
    });
    
  } catch (err) {
    console.error("Error creating ride:", err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }
    
    next(err);
  }
}

export const updateRide = async(req, res, next) => {
  try{
    const { ...details } = req.body;
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        $set: details,
      },
      {new:true}    
    )
    res.status(200).json({success: true, ride})
  }catch(err){
    next(err)
  }
}

export const deleteRide = async(req, res, next) => {
  try{
    await Ride.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate( req.user.id, { $pull: { ridesCreated: req.params.id } })
    res.status(200).send("ride has been deleted");
  }catch(err){
    next(err)
  }
}