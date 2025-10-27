import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
  },
  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  availableSeats: {
    type: Number,
    required: [true, 'Available seats is required'],
    min: [1, 'Must have at least 1 seat'],
    max: [10, 'Cannot have more than 10 seats'],
  },
  origin: {
    place: {
      type: String, 
      required: [true, 'Origin place is required'],
      trim: true,
      minlength: [2, 'Origin must be at least 2 characters'],
    },
    coordinates: {
      type: [Number],
    }, 
  },
  destination: {
    place: {
      type: String,
      required: [true, 'Destination place is required'],
      trim: true,
      minlength: [2, 'Destination must be at least 2 characters'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Start time must be in the future'
    }
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(value) {
        return this.startTime && value > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'active', 'completed', 'canceled'],
      message: 'Status must be: pending, active, completed, or canceled'
    },
    default: 'pending',
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0,
  },
  vehicleDetails: {
    vehicleNumber: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
  },
}, {
  timestamps: true,
  // Add index for better search performance
  indexes: [
    { 'origin.place': 1, 'destination.place': 1, startTime: 1 },
    { startTime: 1 },
    { creator: 1 }
  ]
});

export default mongoose.model('Ride', rideSchema);