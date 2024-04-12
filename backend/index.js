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
app.use(express.json({ limit: '50mb' }));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


// mongoose.connect("mongodb://127.0.0.1:27017/SocialMediaDB", { useNewUrlParser: true })
mongoose.connect("mongodb://127.0.0.1:27017/SocialMediaDB")
    .then(() => {
        // console.log("Successfully connected to MongoDB");
        console.log("Connected to mongodb://127.0.0.1:27017/SocialMediaDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });


//mongodb schemas creation  
const postSchema = new mongoose.Schema({
    description: { type: String, default: "" },
    imageData: Buffer,
    NOL: { type: Number, default: "0" },
    NOC: { type: Number, default: "0" },
    time: { type: Date, default: Date.now },
    CommentsList: [{
        commentby: { type: String, required: true },
        commentDescription: { type: String, required: true }
    }]
});

const notificationSchema = new mongoose.Schema({
    Content: String,
    Read: { type: Boolean, default: false },
    time: { type: Date, default: Date.now },
});

//mongodb models creation
const Post = mongoose.model("Post", postSchema);
const Notification = mongoose.model("Notification", notificationSchema);

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

app.get("/getNotifications", async (req, res) => {
    try {
        const notifications = await Notification.find({});
        // console.log("Notifications Fetched", notifications);
        console.log("Notifications Fetched");
        res.status(200).send(notifications);
    } catch (e) {
        console.log("Error", e);
        res.status(400).send({ msg: e.message })
    }
})


app.delete("/deleteNotifications", async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.status(200).send("All Notifications Cleared");
    } catch (e) {
        console.log("Error", e);
        res.status(400).send({ msg: e.message })
    }
})

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