const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { Binary } = require('mongodb');
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));
// app.use(bodyParser.json({ limit: '150mb' }));
// app.use(bodyParser.urlencoded({ extended: true }));


// mongoose.connect("mongodb://127.0.0.1:27017/SocialMediaDB", { useNewUrlParser: true })
mongoose.connect("mongodb://127.0.0.1:27017/SocialMediaDB")
    .then(() => {
        // console.log("Successfully connected to MongoDB");
        console.log("Connected to mongodb://127.0.0.1:27017/SocialMediaDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });


//mongodb schemas creation---------------------------  

// defining Users Schema
const userSchema = new mongoose.Schema({
    fullname: { type: String, default: "" },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type: String, default: "Male" },
    account_type: { type: String, default: "Public", enum: ["Private", "Public"] },
    birthdate: { type: Date },
    time: { type: Date, default: Date.now },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }]
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
    type: { type: String, enum: ['New Follower', 'Comment', 'Like'], required: true },
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

app.post("/upload", async (req, res) => {
    try {

        const base64ImageData = req.body.base64ImageData;
        const imageBuffer = Buffer.from(base64ImageData, 'base64');

        const newPost = new Post({
            description: req.body.description,
            imageData: new Binary(imageBuffer),
            CommentsList: []
        });

        await newPost.save();

        //generating notification of profile post uploaded
        const newNotification = new Notification({
            Content: "New Image has been uploaded",
        })

        await newNotification.save();

        console.log("Image uploaded successfully");
        res.status(200).send("Image saved successfully");
    }
    catch (e) {
        console.log("Error : ", e);
        res.status(500).send("Error occurred while saving the image");
    }
});

//API for getting all posts pics
app.get("/ProfilePostsList", async (req, res) => {
    try {
        const posts = await Post.find({});
        console.log("Profile Posts Fetched");
        res.status(200).send(posts);
    } catch (e) {
        console.log(e);
        res.status(400).send({ msg: e.message })
    }
})

//API for getting all notifications 
app.get("/getNotifications", async (req, res) => {
    try {
        const notifications = await Notification.find({});
        console.log("Notifications Fetched");
        res.status(200).send(notifications);
    } catch (e) {
        console.log("Error", e);
        res.status(400).send({ msg: e.message })
    }
})

// API for deleting all notifications
app.delete("/deleteNotifications", async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.status(200).send("All Notifications Cleared");
    } catch (e) {
        console.log("Error", e);
        res.status(400).send({ msg: e.message })
    }
})

// API for deleting specific notification
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




app.listen(4000, function () {
    console.log("Server is up and running on port 4000");
});  