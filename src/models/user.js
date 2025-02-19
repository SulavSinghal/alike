// creating schemas using mongoose
const mongoose = require('mongoose');
const validator = require('validator'); // validation package
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 15,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 15,
    },
    emailId: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate(value){ //validation at database level/schema level
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){ //validation at database level
            if(!validator.isStrongPassword(value)){
                throw new Error("Weak password!!It should have One UpperCase,min length,special characters." + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate (value){ //only run when new document is created
            if(!["male","female","others"] === value){
                throw new Error("Not a valid gender");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/02/44/43/69/240_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg",
        validate(value){ //validation at database level
            if(!validator.isURL(value)){
                throw new Error("Invalid photo Url" + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is the default about of the user.",
    },
    skills: {
        type: [String], //to store nnArray of strings
    },

},{timestamps : true});//to add created and updated timestamps automatically

// mongoose model creation

const User = mongoose.model("User", userSchema);

module.exports = User;
