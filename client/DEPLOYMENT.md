# CabBuddy Frontend

This is the frontend part of the CabBuddy ride-sharing application.

## Deployment on Vercel

1. Fork/Clone this repository to your GitHub account
2. Sign up or log in to [Vercel](https://vercel.com)
3. Click "Add New Project" and import the GitHub repository
4. Configure the following settings:
   - Root Directory: `client` (important!)
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL with "/api" at the end (e.g., https://cabbuddy-tzte.onrender.com/api)
6. Click "Deploy"

## Avoiding Common Errors

1. **API Connection Issues**: Make sure your Render backend is deployed first and the URL is correct in the environment variables
   - The URL must end with `/api` to match the API routes

2. **Build Failures**: Ensure the root directory is set to `client` in the Vercel project settings
   - This prevents errors like `DEPLOYMENT_NOT_FOUND` or `FUNCTION_INVOCATION_FAILED`

3. **CORS Issues**: The backend is already configured to accept requests from your Vercel domain
   - If you see CORS errors in the console, double check your environment variables

4. **Route Handling**: The `vercel.json` file includes SPA fallback routes and security headers
   - All non-file routes will correctly redirect to index.html for client-side routing

## Local Development

1. Install dependencies: `npm install`
2. Create a `.env` file based on `.env.example`
3. Start the development server: `npm run dev`
