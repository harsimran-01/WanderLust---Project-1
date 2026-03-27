const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

//schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,

    //schema changes to store the filename also
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg"
        }
    },
    price: {
        type: Number,
        min: 0
    },
    location: String,
    country: String,

    // ✅ ADD THIS
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [lng, lat]
            default: [76.7794, 30.7333] // Chandigarh default
        }
    },

    //reviews array (1*n)
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    //owner -> s that only owner should have permissions
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


//mongoose middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });

    }
})


//model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;