const validator = require("validator");

const validationOnSignUp = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    } else if (validator.isEmail(emailId) === false) {
        throw new Error("Please enter a valid email");
    } else if (validator.isStrongPassword(password) === false) {
        throw new Error("Please enter a strong password");
    }
};

const validateEditProfileData = (req) => {
    const isAllowedEditData = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isUpdateAllowed = Object.keys(req.body).every((k) =>
        isAllowedEditData.includes(k)
    );

    return isUpdateAllowed;
};

const validationProfileData = (req) => {
    const { emailId, photoUrl, skills, about } = req.body;

    // validate email
    if (!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid email");
    }

    // validate photoUrl
    if (!validator.isURL(photoUrl)) {
        throw new Error("Photo URL must be a valid image URL");
    }

    // validate skills
    if (!Array.isArray(skills)) {
        throw new Error("Skills must be an array");
    }

    if (skills.length <= 10) {
        throw new Error("Cannot have more than 10 skills");
    }

    if (!skills.every((skill) => typeof skill === "string")) {
        throw new Error("All skills must be strings");
    }

    // validation about
    if (about.length > 500) {
        throw new Error("About cannot exceed 500 characters");
    }
};

const validateNewPassword = (password) => {
    if (!password) {
        throw new Error("Password is required");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error(
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
    }

    return true;
};

module.exports = {
    validationOnSignUp,
    validateEditProfileData,
    validationProfileData,
    validateNewPassword,
};
