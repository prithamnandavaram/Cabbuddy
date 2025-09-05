import jwt from "jsonwebtoken"
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  console.log("verifyToken middleware called");
  console.log("Request headers:", req.headers);
  console.log("Cookies:", req.cookies);
  
  // Try to get token from cookies
  const cookieToken = req.cookies?.accessToken;
  // Try to get token from Authorization header
  const headerToken = req.headers.authorization?.startsWith('Bearer ') 
    ? req.headers.authorization.split(' ')[1] 
    : null;
  
  console.log("Cookie token:", cookieToken ? "Found" : "Not found");
  console.log("Header token:", headerToken ? "Found" : "Not found");
  
  // Use the token from either source
  const token = cookieToken || headerToken;
  
  if (!token) {
    console.log("Authentication failed: No token provided");
    return next(createError(401, "You are not authenticated!"));
  }

  try {
    // First try standard JWT verification
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("JWT verification failed:", err.message);
        
        // If standard verification fails, try to parse a client-generated token
        try {
          // Check if it might be a client-generated token
          if (token.includes(".") === false) {
            console.log("Attempting to parse client-generated token");
            const decodedClientToken = JSON.parse(atob(token));
            
            if (decodedClientToken && decodedClientToken.id) {
              console.log("Successfully parsed client token:", decodedClientToken);
              req.user = decodedClientToken;
              return next();
            }
          }
          
          // If we reach here, both token formats failed
          console.log("Authentication failed: Invalid token", err.message);
          return next(createError(403, "Token is not valid!"));
        } catch (parseErr) {
          console.log("Failed to parse client token:", parseErr);
          return next(createError(403, "Token is not valid!"));
        }
      } else {
        req.user = user;
        next();
      }
    });
  } catch (e) {
    console.error("Unexpected error in token verification:", e);
    return next(createError(500, "Authentication error"));
  }
}

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
