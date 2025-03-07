// creating schemas using mongoose
const mongoose = require('mongoose');
const validator = require('validator');// validation package
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, 
        minLength: 4,
        maxLength: 15,
    },
    lastName: {
        type: String,
        maxLength: 15,
    },
    emailId: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true, //making unique automatically creates indexes 
        validate(value)
        {   //validation at database level/schema level
            if(!validator.isEmail(value))
            {
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
        enum: {
            values: ["male","female","others"],
            message: `{VALUE} is not the correct gender type.`
        },
        //only run when new document is created custom validation
        // validate (value){ 
        //     if(!["male","female","others"] === value){
        //         throw new Error("Not a valid gender");
        //     }
        // },
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






userSchema.methods.getJWT = async function ()
{
    const user = this; // this is referring to the current user 

   const token = await jwt.sign({_id: user._id},"SulaV123",{
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser)
{
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;
};

// mongoose model creation
const User = mongoose.model("User", userSchema);
module.exports = User;
