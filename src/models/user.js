const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            minLength: [2, "First name must be at least 2 characters long"],
            maxLength: [50, "First name cannot exceed 50 characters"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            minLength: [2, "Last name must be at least 2 characters long"],
            maxLength: [50, "Last name cannot exceed 50 characters"],
            trim: true,
        },
        // this is the one way to validate the emailId
        // emailId: {
        //     type: String,
        //     required: [true, "Email is required"],
        //     lowercase: true,
        //     trim: true,
        //     unique: true,
        //     match: [
        //         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        //         "Please enter a valid email",
        //     ],
        // },
        emailId: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            unique: true,
            validate(v) {
                if (!validator.isEmail(v)) {
                    throw new Error("Please enter a valid email");
                }
            },
            // validate: {
            //     validator: function (v) {
            //         if (!validator.isEmail(v)) {
            //             throw new Error("Please enter a valid email");
            //         }
            //     },
            // },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters long"],
            select: false, // Password won't be returned in queries by default
            validate(v) {
                if (!validator.isStrongPassword(v)) {
                    throw new Error("Enter a strong password");
                }
            },
        },
        age: {
            type: Number,
            min: [18, "Age must be at least 18"],
            max: [120, "Age cannot exceed 120"],
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "others"],
                message: "Gender must be either male, female, or others",
            },
        },
        photoUrl: {
            type: String,
            // validate: {
            //     validator: function (v) {
            //         return (
            //             !v || v.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)
            //         );
            //     },
            //     message: "Photo URL must be a valid image URL",
            // },
            validate(v) {
                if (!validator.isURL(v)) {
                    throw new Error("Photo URL must be a valid image URL");
                }
            },
        },
        about: {
            type: String,
            maxLength: [500, "About cannot exceed 500 characters"],
            default: "This is the default about of the user.",
        },
        skills: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v.length <= 10;
                },
                message: "Cannot have more than 10 skills",
            },
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.id;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.id;
                return ret;
            },
        },
    }
);

// Add virtual for full name
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Add index for faster queries
// userSchema.index({ emailId: 1 });

userSchema.methods.getJWT = function () {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET || "DevTinder@123$",
        {
            expiresIn: "1d",
        }
    );
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const hashedPassword = this.password;
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        hashedPassword
    );
    return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
