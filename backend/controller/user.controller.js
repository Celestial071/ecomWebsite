import User from "../models/user.js"
import { redis } from "../libs/redis.js"
import jwt from "jsonwebtoken";

const generateTokens = (userid) => {

    const accessToken = jwt.sign({ userid }, process.env.ACCESS_SECRETKEY, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({userid}, process.env.REFRESH_SECRETKEY, {
        expiresIn: "7d",
    });

    return {accessToken, refreshToken};
}

const storeRefreshToken = async (userid, refreshToken) => {
    await redis.set(`refresh_token${userid}`, refreshToken, "EX", 7*24*60*60);
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge: 15*60*1000,
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge: 7*24*60*60*1000,
    })
}

export const signup = async (req, res) => {
    const {username, email, password} = req.body
    try{
        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({"message": "Email already in use"});
        }
        
        const user = await User.create({username, email, password});
        
        const {accessToken, refreshToken} = generateTokens(user._id)
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: user._id,
            name: user.username,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        console.log("error in signup controller");
        res.status(500).json({"message" : error.message});
    }

};

export const logout = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRETKEY);
            await redis.del(`refresh_token${decoded.userid}`)
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message: "Logged out successfully"});
    }catch(error){
        console.log("error in logout controller");
        res.status(500).json({ message: "Server error", error: error.message});
    }
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(user && (await (user.comparePassword(password)))){
            const {accessToken, refreshToken} = generateTokens(user._id);
            
            await storeRefreshToken(user._id, refreshToken);

            setCookies(res, accessToken, refreshToken);
            
            res.status(201).json({
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role
            });
        }else{
            res.status(400).json({message: "Incorrect email or password"});
        }
    }catch(error){
        console.log("error in login controller");
        res.status(500).json({ message: "Server error", error: error.message});
    }
}

export const renewToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(401).json({message: "refresh Token not provided"});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRETKEY);
        const storedToken = await redis.get(`refresh_token${decoded.userid}`);
    
        if(storedToken !== refreshToken) {
            return res.status(401).json({ message: "invalid refresh token" });
        }

        const accessToken = jwt.sign({ userid: decoded.userid }, process.env.ACCESS_SECRETKEY, {
            expiresIn: "15m",
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge: 15*60*1000,
        });

        res.json({ message: "Token renewed successfully"});

    }catch(error){
        console.log("Error in refreshToken renewal controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getProfile = async (req, res) => {
    try{
        res.json(req.user);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}