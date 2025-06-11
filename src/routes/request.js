const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
    "/request/send/:status/:toUserId",
    authenticateUser,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowedStatus = ["ignored", "interested"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status" + status,
                });
            }
            const toUser = await User.findById(toUserId);

            if (!toUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            // check if the connection request already sent
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });

            if (existingConnectionRequest) {
                return res.status(400).json({
                    success: false,
                    message: "You already sent a connection request.",
                });
            }

            const username = req.user.firstName;

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });

            const data = await connectionRequest.save();

            res.status(200).send({
                success: true,
                message:
                    status === "interested"
                        ? `${username} sent connection request.`
                        : `${username} ignored connection request.`,
                data: {
                    connectionRequest: data,
                },
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    authenticateUser,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            const { status, requestId } = req.params;
            const allowedStatus = ["accepted", "rejected"];

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status: " + status,
                });
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });

            if (!connectionRequest) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Connection request not found or already processed",
                });
            }
            connectionRequest.status = status;

            const data = await connectionRequest.save();

            res.status(200).json({
                success: true,
                message: `${loggedInUser.firstName} ${status} Connection request`,
                data: {
                    connectionRequest: data,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
);

module.exports = requestRouter;
