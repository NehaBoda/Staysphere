const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/staysphere";

main().then((res)=>{
    console.log("connected to DB")
}).catch((err)=>{console.log(err)});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const init = async()=>{
    await Listing.deleteMany({});
    initData.Data= initData.Data.map((obj)=>({...obj,owner:"695be584e7da31c20768d3e5"}))
    await Listing.insertMany(initData.Data); 
    console.log("Database seeded successfully");
}

init();