if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// console.log(process.env.SECRET);
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
//database connection

const dbURL=process.env.ATLASDB_URL;
main()
    .then(res => { console.log("Successful connection") })
    .catch(err => { console.log(err) });
async function main() {
    await mongoose.connect(dbURL);
}

// const store = MongoStore.create({
//     mongoUrl: process.env.ATLASDB_URL,
//     collectionName: "sessions",
//     crypto: {
//         secret: "mysupersecret"
//     },
//     touchAfter: 24 * 3600
// });

store = MongoStore.create({
        client: mongoose.connection.getClient(), // ✅ FIX
        dbName: "test",
        collectionName: "sessions"
    });

store.on("error", (err) => {
    console.log("MongoStore Error", err);
});


const sessionOptions = {
    store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //cookie should expire after this time(eg github demand re-login after 7 days)
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


app.locals.mapApiKey = process.env.MAP_API_KEY;

app.use(session(sessionOptions));
app.use(flash());

//passport initialization middleware
app.use(passport.initialize());
app.use(passport.session()); // a single user needs to login only once in single session (even if use in diff tabs still don't require to re-login )
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLust";


//middleware for flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//with this listings routes are calling
app.use("/listings", listings);
app.use("/", user);
app.use("/listings/:id/reviews", reviews);


// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     //register method  -> to register the user
//     let registeredUser = await User.register(fakeUser,"helloworld") //password
//     res.send(registeredUser);
// })

app.listen(8080, (req, res) => {
    console.log(`Server is Listening to port 8080`);
})

//middleware

//if not found in others then *
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not FOUND !"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    // res.status(status).send(message);
    res.render("error.ejs", { status, message });
    // res.send("Something went wrong!");
})