const mongoose = require ('mongoose');
const user = require ('../models/user.model');
// const connectDB = async () => {
//     try {
//         mongoose.set ('strictQuery', false);
//          mongoose.connect( process.env.MONGO_URI, ()  =>console.log
//          ('MongoDB is connected'));
//     } catch (err) {
//         console.log(err);
//         process.exit(1);
//     }
//};




async function connectDB() {
    
   
    try {
        await mongoose.connect(process.env.MONGO_URI, {  });
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
}


module.exports = connectDB;