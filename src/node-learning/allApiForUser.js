const express = require("express");
const { connectDB } = require("../config/database");

const app = express();
const User = require("../models/user");
const PORT = process.env.PORT || 7777;

// we use express.json() to parse incoming JSON requests
// and put the parsed data in req.body
app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully");
    } catch (error) {
        res.status(400).send("Error adding user: " + error);
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
// app.patch("/user", async (req, res) => {
//     const userId = req.body.userId;
//     const updatedData = req.body;
//     try {
//         await User.findByIdAndUpdate(userId, updatedData);
//         res.send("User updated successfully");
//     } catch (error) {
//         res.status(400).send("Error updating user: " + error);
//     }
// });

// Update user by email implementation
app.patch("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    const updatedData = req.body;
    try {
        // { new: true } tells Mongoose to return the modified document rather than the original
        // Without this option, findOneAndUpdate() returns the document as it was before the update
        const user = await User.findOneAndUpdate(
            { emailId: userEmail },
            updatedData,
            { new: true } // This ensures we get the updated user document
        );
        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.send("User updated successfully");
        }
    } catch (error) {
        res.status(400).send("Error updating user: " + error);
    }
});

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
