const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const PUBLIC_SAFE_DATA = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "age",
    "gender",
    "skills",
];

userRouter.get(
    "/user/requests/received",
    authenticateUser,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            const connectionRequest = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested",
            }).populate("fromUserId", PUBLIC_SAFE_DATA);

            // If you want to populate the fromUserId field with specific fields
            // you can use the populate method like this:
            // -> populate("fromUserId", ["firstName lastName profilePicture"]);

            res.status(200).json({
                success: true,
                message: "Connection requests fetched successfully",
                data: {
                    connectionRequests: connectionRequest,
                },
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error.message,
                error: "Internal server error",
            });
        }
    }
);

userRouter.get("/user/connections", authenticateUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", PUBLIC_SAFE_DATA)
            .populate("toUserId", PUBLIC_SAFE_DATA);

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.status(200).json({
            success: true,
            message: "Connections fetched successfully",
            data: {
                connections: data,
            },
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
            error: "Internal server error",
        });
    }
});

userRouter.get("/feed", authenticateUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        // if (req.fromUserId.equals(loggedInUser._id)) {
        //     hideUserFromFeed.add(req.toUserId.toString());
        // } else {
        //     hideUserFromFeed.add(req.fromUserId.toString());
        // }
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUserFromFeed) } },
            ],
        })
            .select(PUBLIC_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "Feed fetched successfully",
            data: {
                users: users,
            },
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
            error: "Internal server error",
        });
    }
});

module.exports = userRouter;
