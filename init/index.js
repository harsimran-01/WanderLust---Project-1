const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLust";

main()
    .then(() => {
        console.log("Successful connection");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// 🔥 Free geocoding using OpenStreetMap Nominatim
async function getCoordinates(location, country) {
    const query = encodeURIComponent(`${location}, ${country}`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&limit=1&addressdetails=1`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "WonderLustApp/1.0 (student project)"
        }
    });

    const data = await response.json();

    console.log(`📍 Geocoding: ${location}, ${country}`, data[0]);

    if (!data.length) {
        return {
            type: "Point",
            coordinates: [76.7794, 30.7333] // fallback Chandigarh
        };
    }

    return {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
    };
}

const initDB = async () => {
    // delete old listings
    await Listing.deleteMany({});
    console.log("🗑 Old listings deleted");

    const listingsWithGeometry = [];

    for (let ob of initData.data) {
        const geometry = await getCoordinates(ob.location, ob.country);

        listingsWithGeometry.push({
            ...ob,
            owner: "69c10f9f8db6f4af462a481c", // your owner id
            geometry
        });

        // small delay to avoid API rate limit
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await Listing.insertMany(listingsWithGeometry);
    console.log("✅ Data was initialized with correct coordinates");

    mongoose.connection.close();
};

initDB();