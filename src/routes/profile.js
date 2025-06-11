const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const {
    validateEditProfileData,
    validateNewPassword,
} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authenticateUser, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: {
                user: req.user,
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

profileRouter.patch("/profile/edit", authenticateUser, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit data");
        }

        // validationProfileData(req);

        const loggedInUser = req.user;
        Object.keys(req.body).forEach(
            (key) => (loggedInUser[key] = req.body[key])
        );

        await loggedInUser.save();
        res.status(200).json({
            success: true,
            message: `${loggedInUser.firstName} your profile updated successfully`,
            data: {
                user: loggedInUser,
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

profileRouter.patch("/profile/password", authenticateUser, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Validate the new password
        validateNewPassword(newPassword);

        const loggedInUser = req.user;

        // First find the user and explicitly select the password field
        const user = await User.findOne({
            emailId: loggedInUser.emailId,
        }).select("+password");

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await user.validatePassword(oldPassword);

        if (!isPasswordValid) {
            throw new Error("Invalid old password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
            error: "Internal server error",
        });
    }
});

module.exports = profileRouter;
