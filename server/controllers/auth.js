import bcrypt from "bcryptjs"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({message:"All fields are required"});
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({message:"Email already exists"});

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      name: name,
      email: email,
      password: hash
    })
    
    const savedUser = await newUser.save();
    
    if (!savedUser) {
      return res.status(500).json({message:"Failed to create user"});
    }
    
    const accessToken = jwt.sign(
      { id: savedUser._id, isAdmin: savedUser.isAdmin }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      sameSite: 'lax' // Changed from 'strict' to 'lax' for better compatibility
    };

    const { password: userPassword, isAdmin, ...otherDetails } = savedUser._doc;
    
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ user: { ...otherDetails }, isAdmin: isAdmin });
  } catch(err) {
    console.error("Registration error:", err);
    return res.status(500).json({message: err.message || "An error occurred during registration"});
  }
}

export const login = async(req, res, next)=>{
  try{
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({message:"Email and password are required"});
    }
    
    const user = await User.findOne({email: email})

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({message:"Wrong email or password"});
    }
    
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      sameSite: 'lax' // Changed from 'strict' to 'lax' for better compatibility
    };

    const { password: userPassword, isAdmin, ...otherDetails } = user._doc;
    
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ user: { ...otherDetails }, isAdmin: isAdmin });

  }catch(err){
    console.error("Login error:", err);
    return res.status(500).json({message: err.message || "An error occurred during login"});
  }
}

export const logout = async (req, res, next) => {
  try{
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};