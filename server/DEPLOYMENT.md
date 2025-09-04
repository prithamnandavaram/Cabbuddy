# CabBuddy Backend

This is the backend API for the CabBuddy ride-sharing application.

## Deployment on Render

1. Fork/Clone this repository to your GitHub account
2. Sign up or log in to [Render](https://render.com)
3. Click "New Web Service" and select your GitHub repository
4. Configure the following settings:
   - Name: cabbuddy-backend (or your preferred name)
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `PORT`: 8000
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `CLIENT_URL`: Your Vercel frontend URL (e.g., https://cabbuddy.vercel.app)
6. Click "Create Web Service"

## Local Development

1. Install dependencies: `npm install`
2. Create a `.env` file based on `.env.example`
3. Start the development server: `npm run dev`
