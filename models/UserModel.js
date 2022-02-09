const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {

            type: String,
            required: [true, "A username is required"],
            lowercase: true,
            maxlength: 255,
            trim: true,
            unique: [true, "This username is already taken, please submit another"],

        },
        firstname: { type: String, required: [true, "Your first Name is required"], maxlength: 100 },

        lastname: { type: String, required: [true, "Your last Name is required"], maxlength: 100 },

        password: {

            type: String,
            required: [true, "A password is required"],
            minlength: [6, "For security reasons, your password should be less than 6 characters"],
            maxlength: [64, "Your password should not exceed more than 64 characters"],

        },
    },
        { timeseries: true }
);

const User = new mongoose.model("Users", UserSchema);

module.exports = User;