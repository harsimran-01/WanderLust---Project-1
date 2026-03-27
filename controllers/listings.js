//all the callbacks here to make the project code clean and efficient
// all the functionality of that will perfrom in routes ends up here
const Listing = require("../models/listing");

// 🔥 Free geocoding using OpenStreetMap Nominatim
async function getCoordinates(location, country) {
    const query = encodeURIComponent(`${location}, ${country}`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "WonderLustApp/1.0 (student project)"
        }
    });

    const data = await response.json();

    if (!data.length) {
        return null;
    }

    return {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)] // [lng, lat]
    };
}



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
    // res.send("success");
};

module.exports.newForm = (req, res) => {
    // res.send("Success");

    //to only allow a logged in user to add new listing -> now passed as an middleware
    res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    // res.send("Success");
    let { id } = req.params;
    const listings = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listings) {
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listings");
    }
    console.log(listings);
    res.render("listings/show", { listings });
};

// router.post("/listings", async (req, res, next) => {
//     try {
//         // let {title,description,price} = req.body;
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         // console.log(listing);
//         res.redirect("/listings");
//     } catch (err) {
//         next(err);
//     }
// })
module.exports.createListing = async (req, res, next) => {
    // let {title,description,price} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(filename,url);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    // ✅ Temporary demo coordinates
    // Chandigarh
    // newListing.geometry = {
    //     type: "Point",
    //     coordinates: [76.7794, 30.7333]
    // };

    // 🔥 Get coordinates from location + country
    const geometry = await getCoordinates(newListing.location, newListing.country);
    console.log("Fetched Geometry:", geometry);

    if (!geometry) {
        req.flash("error", "Invalid location entered. Please try again.");
        return res.redirect("/listings/new");
    }

    newListing.geometry = geometry;

    await newListing.save();
    // console.log(listing);
    req.flash("success", "new listing created");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    // res.send("success");
    let { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listings });
};


// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
    
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     if(typeof req.file !== "undefined"){
//         let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = {url,filename};
//     await listing.save();
//     }
    
    
//     req.flash("success", "listing updated");
//     res.redirect(`/listings/${id}`);
// };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // 🔥 Update coordinates when location changes
    const geometry = await getCoordinates(listing.location, listing.country);
    console.log("Updated Geometry:", geometry);

    if (geometry) {
        listing.geometry = geometry;
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();

    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};