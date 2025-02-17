
const mongoose = require('mongoose');//returns promises

const connectdb = async() =>{
    await mongoose.connect("mongodb+srv://sulavsinghal99:yPAaOTddrgmrHi6R@projectonnodejs.ysbrr.mongodb.net/ALIKE");
};

module.exports = connectdb;
 
