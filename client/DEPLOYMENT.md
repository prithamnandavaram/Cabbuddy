# CabBuddy Frontend

This is the frontend part of the CabBuddy ride-sharing application.

## Deployment on Vercel

1. Fork/Clone this repository to your GitHub account
2. Sign up or log in to [Vercel](https://vercel.com)
3. Click "Add New Project" and import the GitHub repository
4. Configure the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL (e.g., https://cabbuddy-backend.onrender.com/api)
6. Click "Deploy"

## Local Development

1. Install dependencies: `npm install`
2. Create a `.env` file based on `.env.example`
3. Start the development server: `npm run dev`
