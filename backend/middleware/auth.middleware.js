import jwt from "jsonwebtoken"
import User from "../models/user.js"
export const protectRoute = async (req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken;

        if(!accessToken){
            return res.status(401).json({message: "unauthorized - No access token provided"});
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.ACCESS_SECRETKEY);
            const user = await User.findById(decoded.userid).select("-password");

            if(!user){
                return res.staus(401).json({message: "User not found"});
            }

            req.user = user;
        
            next();
        } catch (error) {
            if(error.name === "TokenExpiredError") {
                return res.status(401).json({message: "Unauthorized - Access token expired"});
            }
            throw error
        }
    }catch(error){
        console.log("Error in protectROute middleware ", error.message);
        return res.status(401).json({message: "Unauthorized - Invalid access token"});
    }
}


export const adminRoute = async (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({message: "Access denied - Admin only"});
    }
}