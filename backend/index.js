const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const { Binary } = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

mongoose.connect("mongodb://127.0.0.1:27017/SocialMediaDB")
    .then(() => {
        console.log("Connected to mongodb://127.0.0.1:27017/SocialMediaDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });


app.use(cookieParser());
app.use(session({
    secret: 'This_is_my_secret_key',
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/SocialMediaDB' }),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto', httpOnly: true } // 'auto' will use true if you're on https, otherwise false
}));

//mongodb schemas creation---------------------------  

// defining Users Schema
const userSchema = new mongoose.Schema({
    fullname: { type: String },
    uniqueName: { type: String, unique: true, require: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type: String, default: "male" },
    account_type: { type: String, default: "Public", enum: ["private", "public"] },
    birthdate: { type: Date },
    profilePic: Buffer,
    previousSearches: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    time: { type: Date, default: Date.now },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification', default: [] }]
});


// defining Posts schema
const postSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: "" },
    imageData: Buffer,
    NOL: { type: Number, default: 0 },
    NOC: { type: Number, default: 0 },
    time: { type: Date, default: Date.now },
    CommentsList: [{
        commentby: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        commentDescription: { type: String, required: true }
    }]
});


// defining Notifications schema
const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Content: String,
    Read: { type: Boolean, default: false },
    type: { type: String, enum: ['New Follower', 'Comment', 'Like', "NewPost"], required: true },
    relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false },
    time: { type: Date, default: Date.now },
});

// defining Messaging Schema
const messageSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: String,
    timestamp: { type: Date, default: Date.now }
});

//mongodb models creation
const Post = mongoose.model("Post", postSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.send("Express App Is Running");
})

app.get("/check-auth", (req, res) => {
    if (req.session.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.post("/userSignup", async (req, res) => {
    try {
        const { fullName, uniqueName, username, password, gender, birthdate, accountCategory, profilePic } = req.body;

        const imageBuffer = Buffer.from(profilePic, 'base64');
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            fullname: fullName,
            uniqueName: uniqueName,
            username: username,
            password: hashedPassword,
            gender: gender,
            birthdate: new Date(birthdate),
            profilePic: new Binary(imageBuffer),
            account_type: accountCategory,
            posts: [],
            notifications: [],
            followers: [],
            following: [],
        });

        // req.session.user = { id: newUser._id, username: username, fullname: fullName, gender: gender };
        req.session.user = { id: req.sessionID, username: username, uniqueName: uniqueName, fullname: fullName, gender: gender, objectId: newUser._id };
        res.cookie('username', username, { httpOnly: true, secure: true });
        await newUser.save();

        // console.log("Session ID:", req.sessionID);  // Log the session ID
        // console.log("Session:", req.session);      // Log the session object
        // console.log("Cookie set with session ID");


        console.log("User Registered Successfully");
        res.status(201).send({ message: "User registered successfully", redirectTo: "/" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send({ message: "Error occurred during signup" });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ $or: [{ username: username }, { uniqueName: username }] });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // req.session.user = { id: user._id, username: user.username, uniqueName: user.uniqueName, gender: user.gender, objectId: user._id };
        req.session.user = { id: req.sessionID, username: user.username, uniqueName: user.uniqueName, gender: user.gender, objectId: user._id };
        res.cookie('user_sid', req.sessionID, { httpOnly: true, secure: true }); // Set cookie

        console.log("Session ID:", req.session.user.id);  // Log the session ID
        console.log("User ID:", req.session.user.objectId);  // Log the session ID

        // console.log("Session ID:", req.sessionID);  // Log the session ID
        // console.log("Session:", req.session);      // Log the session object
        // console.log("Cookie set with session ID");

        res.json({ message: "Logged in successfully" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error occurred during login" });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Failed to destroy the session");
            res.status(500).send({ message: "Failed to logout" });
        } else {
            res.clearCookie('user_sid');
            res.json({ message: "Logged out successfully" });
        }
    });
});

app.post("/upload", async (req, res) => {
    // console.log("Uploader information : ", req.session.user)
    try {
        if (!req.session.user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const base64ImageData = req.body.base64ImageData;
        const imageBuffer = Buffer.from(base64ImageData, 'base64');

        const newPost = new Post({
            creator: req.session.user.objectId,
            description: req.body.description,
            imageData: new Binary(imageBuffer),
            CommentsList: []
        });

        await newPost.save();

        //generating notification of profile post uploaded
        const newNotification = new Notification({
            user: req.session.user.objectId,
            Content: "New Image has been uploaded",
            type: "NewPost",
            relatedPost: newPost._id,
        })
        await newNotification.save();

        await User.findByIdAndUpdate(req.session.user.objectId, { $push: { notifications: newNotification._id } });
        await User.findByIdAndUpdate(req.session.user.objectId, { $push: { posts: newPost._id } });

        console.log("Image uploaded successfully");
        res.status(200).send("Image saved successfully");
    }
    catch (e) {
        console.log("Error : ", e);
        res.status(500).send("Error occurred while saving the image");
    }
});

//API for getting user's profile data
app.get("/ProfilePostsList", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ message: "user is unauthorized" });
    }

    try {
        // const user = await User.findOne({ username: req.session.user.username }).populate("posts");
        const user = await User.findOne({ _id: req.session.user.objectId }).populate("posts");

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const posts = user.posts || []; // Use empty array if user.posts is null or undefined

        // console.log("User's data that is being sent : ", user)
        console.log("User's Profile Data Fetched Successfully");
        res.status(200).json({ posts, user });
    } catch (e) {
        console.error("Failed to fetch posts: ", e);
        res.status(500).send({ message: "Error occurred while fetching posts" });
    }
});

//API for getting all notifications 
app.get("/getNotifications", async (req, res) => {

    if (!req.session.user) {
        return res.status(401).send({ message: "user is unauthorized" });
    }

    try {
        const user = await User.findOne({ _id: req.session.user.objectId }).populate("notifications");
        // const notifications = await Notification.find({});
        const notifications = user.notifications || [];

        if (!notifications) {
            return res.status(404).send({ message: "User's notifications not found" });
        }

        console.log("Notifications Fetched", notifications);
        res.status(200).send({ user, notifications });
    } catch (e) {
        console.log("Error", e);
        res.status(400).send({ msg: e.message })
    }
})

// API for deleting all notifications of a user
app.delete("/deleteNotifications", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ message: "User is unauthorized" });
    }

    try {
        const user = await User.findOne({ _id: req.session.user.objectId }).populate("notifications");
        const notificationIds = user.notifications.map(notification => notification._id);

        await Notification.deleteMany({ _id: { $in: notificationIds } });

        user.notifications = [];
        await user.save();

        res.status(200).send("All Notifications Cleared");
    } catch (e) {
        console.log("Error", e);
        res.status(400).send({ msg: e.message })
    }
})

// API for deleting specific notification of a user
app.delete("/deleteNotification/:id", async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).send("Notification deleted");
        console.log("Notification Deleted");
    } catch (e) {
        console.error("Error deleting notification:", e);
        res.status(500).send("Error deleting notification");
    }
});

app.post("/searchUsers", async (req, res) => {

    if (!req.session || !req.session.user) {
        console.error("No session/user found");
        return res.status(401).send({ message: "Unauthorized - Session invalid or expired" });
    }

    const { username, gender, accountType } = req.body;

    let query = {
        $and: [
            { $or: [{ username: username }, { uniqueName: username }] },
            { _id: { $ne: req.session.user.objectId } }  // Exclude the logged-in user's ID from the search
        ]
    };

    if (gender && gender !== "none") {
        query.gender = gender;
    }

    if (accountType && accountType !== "none") {
        query.account_type = accountType;
    }

    try {
        const user = await User.findOne(query);
        if (!user) {
            console.log("User not found in Search");
            return res.status(401).json({ message: "User not found" });
        }

        const loggedInUserId = req.session.user.objectId;
        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser.previousSearches.includes(user._id)) {
            loggedInUser.previousSearches.push(user._id);
            await loggedInUser.save();
        }

        console.log("User found in Search");
        res.status(200).json({ message: "User found", user });
    } catch (e) {
        console.error("Search Error:", e);
        res.status(500).json({ message: "Error occurred during searching" });
    }
});

app.get("/getPreviousSearches", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user.objectId);
        const previousSearchesInfo = await Promise.all(currentUser.previousSearches.map(async (searchId) => {
            const searchUser = await User.findById(searchId);
            return {
                _id: searchUser._id,
                uniqueName: searchUser.uniqueName,
                profilePic: searchUser.profilePic // Assuming this is a buffer or base64-encoded image
            };
        }));

        console.log(previousSearchesInfo);
        res.status(200).json({ previousSearchesInfo });
    } catch (error) {
        console.error("Error fetching previous searches:", error);
        res.status(500).json({ message: "Error fetching previous searches" });
    }
});

app.get("/clearAllPreviousSearches", async (req, res) => {
    try {
        const userId = req.session.user.objectId;
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        currentUser.previousSearches = [];

        await currentUser.save();
        res.status(200).json({ message: "Previous searches cleared successfully" });
    } catch (error) {
        console.error("Error clearing previous searches:", error);
        res.status(500).json({ message: "Error clearing previous searches" });
    }
});


app.listen(4000, function () {
    console.log("Server is up and running on port 4000");
});