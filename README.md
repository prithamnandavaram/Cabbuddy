# CabBuddy 🚗

A modern ride-sharing platform that connects people heading to the same destination, making travel more affordable, sustainable, and social.

## 🌟 Overview

CabBuddy is a full-stack web application designed to facilitate carpooling by matching riders with similar routes. Users can either publish rides as drivers or search for available rides as passengers, helping reduce traffic congestion, save money, and minimize environmental impact.

**Live Demo:** [https://cabbuddy-black.vercel.app](https://cabbuddy-black.vercel.app)

## ✨ Key Features

- **Dual Role System**: Users can act as drivers, passengers, or both
- **Smart Ride Matching**: Intelligent search algorithm matches users based on origin, destination, date, and available seats
- **Real-time Availability**: Instant updates on ride availability and booking status
- **Profile Management**: Comprehensive user profiles with ride history and ratings
- **Flexible Scheduling**: Pre-book rides or find instant matches
- **Rating & Review System**: Community-driven accountability through user ratings
- **Secure Authentication**: JWT-based authentication with bcrypt password encryption
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router v6** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client for API requests
- **Shadcn UI** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication tokens
- **Bcrypt.js** - Password hashing
- **Cloudinary** - Image upload and management
- **Multer** - File upload middleware

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.x or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cabbuddy.git
cd cabbuddy
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

3. **Configure environment variables**

Create `.env` file in the `server` directory:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:8080/api
```

4. **Start the development servers**

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
cabbuddy/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Images and static files
│   └── package.json
│
├── server/                # Backend Express application
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Helper functions
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Rides
- `GET /api/rides` - Search available rides
- `POST /api/rides` - Create new ride
- `GET /api/rides/:id` - Get ride details
- `PUT /api/rides/:id` - Update ride
- `DELETE /api/rides/:id` - Cancel ride

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/upload` - Upload profile picture

## 🎯 Core Functionality

### For Drivers
1. Sign up and create a profile
2. Publish ride details (route, date, time, available seats, price)
3. Receive booking notifications
4. Manage ride bookings
5. Rate passengers after ride completion

### For Passengers
1. Sign up and create a profile
2. Search rides by origin, destination, date, and seats needed
3. View driver profiles and ratings
4. Book available seats
5. Rate drivers after ride completion

## 🔒 Security Features

- Password encryption using bcrypt
- JWT-based authentication
- HTTP-only cookies for token storage
- Input validation and sanitization
- Protected API routes
- CORS configuration

## 🌐 Deployment

The application is deployed using:
- **Frontend**: Vercel (automated deployments from main branch)
- **Backend**: Render (automated deployments from main branch)
- **Database**: MongoDB Atlas

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ by Pritham Nandavaram

---

**Note**: This is a portfolio project demonstrating full-stack development skills with the MERN stack.
