import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"

import { setupGlobalMiddleware, errorHandler } from "./middleware/global.js"
import authRoute from "./routes/auth.routes.js"
import userRoute from "./routes/user.routes.js"
import rideRoute from "./routes/ride.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Handle CORS preflight requests
app.options('*', cors({
  origin: [
    process.env.CLIENT_URL, 
    "http://localhost:5173",
    "https://cabbuddy-black.vercel.app",
    "https://cabbuddy.vercel.app",
    "https://cabbuddy-git-main-prithamnandavaram.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//middlewares
setupGlobalMiddleware(app)

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/rides", rideRoute);

app.use(errorHandler)

// Connect to database first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
  })
}).catch(err => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
