const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    imageProfile: {type: String},
    password: {type: String, required: true},
    numberPhone: {type: Number, required: true},
    status: {
        type: String,
        enum: ['active', 'suspended'],
        required: true
    },
    roleId: {type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true},
    specialityId: {type: mongoose.Schema.Types.ObjectId, ref: "Speciality", required: false}

}, {collection: "User", timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;