const mongoose = require('mongoose');
require('dotenv').config()

let mongoDBString = process.env.MONGODBSTRING || ''

async function connect(){
    try{
        await mongoose.connect(mongoDBString);
        console.log("connect success!!!");
    }catch(error){
        console.log("connect fail!!!"+error);
        }
}

module.exports={connect}