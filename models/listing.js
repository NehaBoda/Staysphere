const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Review = require('./review')

const listingSchema = new schema({
    title: {
        type: String,
        required: true,  
    },
    description: {
        type: String,
    },
    image: {
       url : String,
       filename : String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews :[
        {
            type: schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner :
        {
            type: schema.Types.ObjectId,
            ref : "User"
        },
    geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },category : {
        type : String,
        enum :['Rooms','Iconic_cities','Mountains','Castles','Amazing_pools','Beach','Camping','Farms','Arctic','Domes','Boats'],
        required: true
    }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing){
      await Review.deleteMany({_id:{$in: listing.reviews }})
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
