const express = require("express");
const { connectDB } = require("../config/database");

const app = express();
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");
const { validationOnSignUp } = require("../utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../middlewares/auth");

const PORT = process.env.PORT || 7777;
const JWT_SECRET = process.env.JWT_SECRET || "DevTinder@123$";

// we use express.json() to parse incoming JSON requests
// and put the parsed data in req.body
// we use cookie-parser to parse cookies attached to the client request object
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
        await user.save();

        // Create user response without password
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
        };

        res.status(201).json({
            success: true,
            message: "User added successfully",
            data: {
                user: userResponse,
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

app.post("/login", async (req, res) => {
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

        // login response
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
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

/**
 * Middleware to authenticate user for profile access
 * The authenticateUser middleware verifies the JWT token and attaches the user to req.user
 * Note: Password field is automatically excluded by the schema configuration
 * so no need for explicit password removal in the response
 */
app.get("/profile", authenticateUser, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: {
                user: req.user,
            },
        });
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
});

app.post("/sendConnectionRequest", authenticateUser, async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            message: "Connection request sent successfully",
            data: {
                user: user.fullName + " send you the connect Request",
            },
        });
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
});

/**
 * * get the user by email
 *  const userId = req.body._id;
     try {
         const users = await User.find({ _id: userId });
         res.send(users);
     } catch (error) {
         res.status(400).send("Error logging in user: " + error);
     }
 * 
 * * to find one user with the emailId
 *  try {
        const user = await User.findOne({ emailId: userEmail });

        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("Error logging in user: " + error);
    }
 * 
 */

// to find the user with the emailId
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.find({ emailId: userEmail });

        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Error logging in user: " + error);
    }
});

// get the feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send("Error logging in user: " + error);
    }
});

// delete the user with the id from the database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Error deleting user: " + error);
    }
});

// update the user with the id from the database

// Update user by ID implementation
// always update the user with the userId with the params
app.patch("/user/:userId", async (req, res) => {
    // const userId = req.body.userId;
    const userId = req.params?.userId;
    const updatedData = req.body;

    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ];

        const isUpdateAllowed = Object.keys(updatedData).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if (!isUpdateAllowed) {
            throw new Error("Invalid updates");
        }
        await User.findByIdAndUpdate(userId, updatedData, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send("Error updating user: " + error);
    }
});

// Update user by email implementation
// app.patch("/user", async (req, res) => {
//     const userEmail = req.body.emailId;
//     const updatedData = req.body;
//     try {
//         // { new: true } tells Mongoose to return the modified document rather than the original
//         // Without this option, findOneAndUpdate() returns the document as it was before the update
//         const user = await User.findOneAndUpdate(
//             { emailId: userEmail },
//             updatedData,
//             { new: true } // This ensures we get the updated user document
//         );
//         if (!user) {
//             res.status(404).send("User not found");
//         } else {
//             res.send("User updated successfully");
//         }
//     } catch (error) {
//         res.status(400).send("Error updating user: " + error);
//     }
// });

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is successfully listening on port ${PORT}...`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
