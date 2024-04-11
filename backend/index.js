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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

const postSchema = new mongoose.Schema({
    description: { type: String, default: "" },
    image: String,
    imageData: Buffer,
    NOL: { type: Number, default: "0" },
    NOC: { type: Number, default: "0" },
    CommentsList: [{
        commentby: { type: String, required: true },
        commentDescription: { type: String, required: true }
    }]
});

const Post = mongoose.model("Post", postSchema);


app.get("/", (req, res) => {
    res.send("Express App Is Running");
})

app.post("/upload", async (req, res) => {
    try {

        const base64ImageData = req.body.base64ImageData;
        const imageBuffer = Buffer.from(base64ImageData, 'base64');

        const newPost = new Post({
            description: req.body.description,
            image: req.body.base64ImageData,
            imageData: new Binary(imageBuffer),
            CommentsList: []
        });

        await newPost.save();

        console.log("Image saved successfully");
        res.status(200).send("Image saved successfully");
    }
    catch (e) {
        console.log("Error : ", e);
        res.status(500).send("Error occurred while saving the image");
    }
});

app.listen(4000, function () {
    console.log("Server is up and running on port 4000");
});  