const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req,res) => {
    try{
        const {email,password } = req.body;

        //validation

        if(!email || !password){
            return res.status(400).json({
                message:"Email and password are required"
            });
        }

        if (password.length < 8){
            return res.status(400).json({
                message:"Password must be atleast 8 characters"
            });
        }

        //if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        //hash the password

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //Create user
        const user = new User({email,passwordHash});

        await user.save();

        //respond
        res.status(201).json({
            message: "User registered successfully"
        });
    } catch(err) {
        console.error("register error:",err.message);
        res.status(500).json({message:"Server error"});
    }
};

exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;

        //validate
        if(!email || !password) {
            return res.status(400).json({
                message:"email and password are required"
            });
        }

        //find user
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                message: "This email doesn't exisit."
            });
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch){
            return res.status(401).json({
                message: "Incorrect password."
            })
        }

        //Create jwt
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        console.log("user logged in:",email);

        //respond
        res.json({token});
    } catch(err) {
        console.error("login error:",err.message);
        res.status(500).json({message:"server error"});
    }
};
