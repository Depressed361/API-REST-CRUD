
const mongoose = require('mongoose');




const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    lastname: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,

    },

    address : {
        type: String,
        required: true,
        trim: true
    },

    permisNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
        

    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const user = mongoose.model('User', userSchema);

module.exports = user;