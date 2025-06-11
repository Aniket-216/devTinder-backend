const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "DevTinder@123$";

const authenticateUser = async (req, res, next) => {
    try {
        // Get token from cookies
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Authentication required");
        }

        // verify the token
        const decodedMessage = jwt.verify(token, JWT_SECRET);

        // extract the id from the decodedMessage
        const { _id } = decodedMessage;

        // Find user by id
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            success: false,
            message: "Authentication failed",
            error: error.message,
        });
    }
};

module.exports = {
    authenticateUser,
};

// this is the middleware for authentication instead writing the logic in each route we can create the middleware so we can use it in each route

/*
const adminAuth = (req, res, next) => {
    console.log("Admin auth middleware called");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
};

const userAuth = (req, res, next) => {
    console.log("User auth middleware called");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
};

module.exports = {
    adminAuth,
    userAuth,
};
*/
