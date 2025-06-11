const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = require("../models/user");
const { validationOnSignUp } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // validate the user data
        validationOnSignUp(req);

        const { firstName, lastName, emailId, password } = req.body;

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });
        const savedData = await user.save();

        // here we are directly redirecting the user to the login page after successful registration.
        // Create user response without password
        // const userResponse = {
        //     _id: user._id,
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     emailId: user.emailId,
        // };

        const token = await savedData.getJWT();

        // Add a token to cookie and sent the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "User added successfully",
            data: {
                user: savedData,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Registration failed",
            message: error.message,
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Please enter a valid email");
        }
        // Explicitly select the password field for authentication
        const user = await User.findOne({ emailId }).select("+password");
        if (!user) {
            throw new Error("Invalid credentials");
        }
        // Compare the password with the hashed password in the database
        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = await user.getJWT();

        // Add a token to cookie and sent the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Update last login time after successful authentication and successful token generation
        user.lastLogin = new Date();
        await user.save();

        // login response
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            photoUrl: user.photoUrl,
        };

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                user: userResponse,
            },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: "Authentication failed",
            message: error.message,
        });
    }
});

authRouter.post("/logout", (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        status: true,
        message: "User logged out successfully",
    });
});

module.exports = authRouter;
