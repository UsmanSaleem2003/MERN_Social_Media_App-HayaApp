const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const { Binary } = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
    time: { type: Date, default: Date.now },
    previousSearches: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification', default: [] }],
    pendingFollowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
});


// defining Posts schema
const postSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creatorUniqueName: { type: String, default: "" },
    description: { type: String, default: "" },
    imageData: Buffer,
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
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
    uniqueName: { type: String, default: "" },
    Content: String,
    Read: { type: Boolean, default: false },
    type: { type: String, enum: ['NewFollower', 'Comment', 'Like', "NewPost"], required: true },
    relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false },
    time: { type: Date, default: Date.now },
});

// defining Messaging Schema
// const messageSchema = new mongoose.Schema({
//     from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     message: String,
//     timestamp: { type: Date, default: Date.now }
// });

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
            return res.status(401).json({ message: "Invalid Password" });
        }

        req.session.user = { id: req.sessionID, username: user.username, uniqueName: user.uniqueName, gender: user.gender, objectId: user._id };
        res.cookie('user_sid', req.sessionID, { httpOnly: true, secure: true });

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
    try {
        if (!req.session.user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const base64ImageData = req.body.base64ImageData;
        const imageBuffer = Buffer.from(base64ImageData, 'base64');

        const newPost = new Post({
            creator: req.session.user.objectId,
            creatorUniqueName: req.session.user.uniqueName,
            description: req.body.description,
            imageData: new Binary(imageBuffer),
            CommentsList: []
        });

        await newPost.save();

        //generating notification of profile post uploaded
        const newNotification = new Notification({
            user: req.session.user.objectId,
            uniqueName: req.session.user.uniqueName,
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
        const user = await User.findOne({ _id: req.session.user.objectId }).populate("posts");

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const posts = user.posts || [];

        // console.log("User's data that is being sent : ", user)
        // console.log("User's Profile Data Fetched Successfully");
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

        // console.log("Notifications Fetched", notifications);
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

app.delete("/deletePreviousSearch/:searchId", async (req, res) => {
    try {
        const userId = req.session.user.objectId;
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const searchIndex = currentUser.previousSearches.indexOf(req.params.searchId);
        if (searchIndex === -1) {
            return res.status(404).json({ message: "Search not found" });
        }

        currentUser.previousSearches.splice(searchIndex, 1);

        await currentUser.save();
        res.status(200).json({ message: "Previous search deleted successfully" });
    } catch (error) {
        console.error("Error deleting previous search:", error);
        res.status(500).json({ message: "Error deleting previous search" });
    }
});

app.get('/SearchedUser/:id', async (req, res) => {
    const currentUserID = req.session.user.objectId;
    const currentUser = await User.findById(currentUserID);

    try {
        const user = await User.findById(req.params.id).populate("posts");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = currentUser.following.includes(user._id);
        const isCurrentUserInPendingRequest = user.pendingFollowers.includes(currentUserID);
        let followingStatus = false;
        let pendingRequestStatus = false;

        if (isFollowing) {
            followingStatus = true;
        }

        if (isCurrentUserInPendingRequest) {
            pendingRequestStatus = true;
        }

        res.json({
            user: user,
            postsData: user.posts || [],
            following: followingStatus,
            pendingRequest: pendingRequestStatus
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching searched user's Data" });
    }
});


// GET Api for Follow Requests
app.get('/pendingFollowRequests', async (req, res) => {
    const currentUserID = req.session.user.objectId;

    try {
        const currentUser = await User.findById(currentUserID).populate('pendingFollowers', 'profilePic uniqueName _id');
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const pendingRequests = currentUser.pendingFollowers.map(user => ({
            id: user._id,
            profilePic: user.profilePic,
            uniqueName: user.uniqueName
        }));

        res.json({ pendingRequests });
    } catch (error) {
        console.error("Error fetching pending follow requests:", error);
        res.status(500).json({ message: "Error fetching pending follow requests" });
    }
});

// ---------------------------------Follow Handling------------------------------------------

// POST to send a follow request
app.post("/sendFollowRequest/:id", async (req, res) => {
    const userId = req.session.user.objectId;
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (userToFollow.pendingFollowers.includes(userId)) {
        return res.status(400).json({ message: 'Follow request already sent' });
    }
    userToFollow.pendingFollowers.push(userId);
    await userToFollow.save();
    res.status(200).json({ message: 'Follow request sent' });
});

// POST to accept a follow request
app.post("/acceptFollowRequest/:followerId", async (req, res) => {
    const CurrentUserId = req.session.user.objectId;
    const followerId = req.params.followerId;
    const CurrentUser = await User.findById(CurrentUserId);
    const followerUser = await User.findById(followerId);

    if (!CurrentUser || !followerUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    CurrentUser.followers.push(followerId);
    followerUser.following.push(CurrentUserId);
    CurrentUser.pendingFollowers = CurrentUser.pendingFollowers.filter(id => id.toString() !== followerId);
    await CurrentUser.save();
    await followerUser.save();
    res.status(200).json({ message: 'Follow request accepted' });
});

// POST to reject a follow request
app.post("/rejectFollowRequest/:followerId", async (req, res) => {
    const userId = req.session.user.objectId;
    const followerId = req.params.followerId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.pendingFollowers = user.pendingFollowers.filter(id => id.toString() !== followerId);
    await user.save();
    res.status(200).json({ message: 'Follow request rejected' });
});

// POST to unfollow a user
app.post("/unfollow/:id", async (req, res) => {
    const userId = req.session.user.objectId;
    const userToUnfollowId = req.params.id;
    const CurrentUser = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!CurrentUser || !userToUnfollow) {
        return res.status(404).json({ message: 'User not found' });
    }
    CurrentUser.following = CurrentUser.following.filter(id => id.toString() !== userToUnfollowId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);
    await CurrentUser.save();
    await userToUnfollow.save();
    res.status(200).json({ message: 'Successfully unfollowed' });
});

app.post("/requestCancel/:id", async (req, res) => {
    const requestSentToID = req.params.id;
    const currentUserID = req.session.user.objectId;
    const requestSentTo = await User.findById(requestSentToID);

    if (!requestSentTo) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        requestSentTo.pendingFollowers = requestSentTo.pendingFollowers.filter(id => id.toString() !== currentUserID);
        await requestSentTo.save();
        res.status(200).json({ message: 'Follow request cancelled' });
    } catch (error) {
        res.status(500).json({ message: "Error Cancelling Sent Follow Request" });
    }
})

app.get("/HomeFeed", async (req, res) => {
    const currentUserID = req.session.user.objectId;
    const currentUser = await User.findById(currentUserID).populate('following');

    const posts = await Post.find({
        'creator': { $in: currentUser.following.map(user => user._id) }
    }).populate('creator', 'uniqueName profilePic')
        .populate({
            path: 'CommentsList.commentby',
            select: 'username uniqueName profilePic'  // Include profile picture
        })
        .sort({ time: -1 });

    const postsData = posts.map(post => ({
        id: post._id,
        currentUser: currentUserID,
        creatorId: post.creator._id,
        page_title: post.creator.uniqueName,
        page_logo: post.creator.profilePic,
        time_ago: post.time,
        content_pic: post.imageData,
        post_description: post.description,
        number_of_likes: post.NOL,
        number_of_comments: post.NOC,
        post_comments: post.CommentsList
    }));

    res.json({ postsData, currentUserID: req.session.user.objectId });

    // res.json(posts.map(post => ({
    //     id: post._id,
    //     currentUser: currentUserID,
    //     creatorId: post.creator._id,
    //     page_title: post.creator.uniqueName,
    //     page_logo: post.creator.profilePic,
    //     time_ago: post.time,
    //     content_pic: post.imageData,
    //     post_description: post.description,
    //     number_of_likes: post.NOL,
    //     number_of_comments: post.NOC,
    //     post_comments: post.CommentsList
    // })));
});

app.post('/updateLike/:postId', async (req, res) => {
    try {
        const currentUserID = req.session.user.objectId;
        const currentUserUniqueName = req.session.user.uniqueName;

        const post = await Post.findById(req.params.postId);
        const postOwner = await User.findById(post.creator);

        const currentUserLiked = post.likedBy.includes(currentUserID);

        if (currentUserLiked) {
            post.likedBy.pull(currentUserID);
            post.NOL -= 1;
        } else {
            post.likedBy.push(currentUserID);
            post.NOL += 1;

            const newNotification = new Notification({
                user: currentUserID,
                uniqueName: currentUserUniqueName,
                Content: "New Like on your Post",
                type: "Like",
                relatedPost: post._id,
            })
            await newNotification.save();

            postOwner.notifications.push(newNotification._id);
            await postOwner.save();
        }

        await post.save();

        res.status(200).json(post.NOL);
    } catch (error) {
        res.status(500).json({ message: "Error adding like", error });
    }
});

app.post('/addComment/:postId', async (req, res) => {
    const { commentDescription } = req.body;
    const commentby = req.session.user.objectId;

    const post = await Post.findById(req.params.postId);
    const postOwner = await User.findById(post.creator);
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            { $push: { CommentsList: { commentDescription, commentby } }, $inc: { NOC: 1 } },
            { new: true }
        ).populate('CommentsList.commentby', 'username uniqueName profilePic');

        const newNotification = new Notification({
            user: req.session.user.objectId,
            uniqueName: req.session.user.uniqueName,
            Content: "User Commented on your Post",
            type: "Comment",
            relatedPost: post._id,
        })
        await newNotification.save();

        postOwner.notifications.push(newNotification._id);
        await postOwner.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }
});

app.delete('/posts/:postId/comments/:commentId', async (req, res) => {
    const { postId, commentId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        post.CommentsList = post.CommentsList.filter(comment => comment._id.toString() !== commentId);
        post.NOC -= 1;
        await post.save();
        res.status(200).send({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Failed to delete comment", error: error.message });
    }
});

app.post('/updateProfile', async (req, res) => {
    const { fullName, password, accountCategory, profilePicture } = req.body;

    try {
        const CurrentUserId = req.session.user.objectId;
        if (!CurrentUserId) {
            throw new Error('CurrentUserId not found in session');
        }

        const CurrentUser = await User.findById(CurrentUserId);
        if (!CurrentUser) {
            throw new Error(`User with id ${CurrentUserId} not found`);
        }

        if (fullName) {
            CurrentUser.fullname = fullName;
        }
        if (password) {
            CurrentUser.password = await bcrypt.hash(password, saltRounds);
        }
        if (accountCategory && accountCategory !== 'default' && accountCategory !== CurrentUser.account_type) {
            CurrentUser.account_type = accountCategory;
        }
        if (profilePicture) {
            const imageBuffer = Buffer.from(profilePicture, 'base64');
            CurrentUser.profilePic = imageBuffer;
        }

        // Save the updated user document
        await CurrentUser.save();

        res.json({ success: true, message: "Profile updated successfully.", data: CurrentUser });
    } catch (error) {
        console.error("Error updating profile: ", error);
        res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
    }
});


app.get("/image/:imageId", async (req, res) => {
    const imageId = req.params.imageId;

    try {
        const post = await Post.findById(imageId)
            .populate('creator', 'uniqueName profilePic')
            .populate({
                path: 'CommentsList.commentby',
                select: 'username uniqueName profilePic'  // Include profile picture
            })
            .sort({ time: -1 });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.creator || !post.creator.uniqueName || !post.creator.profilePic) {
            console.error("Populated fields are missing or incorrect", post.creator);
        }
        res.status(200).json({ post: post, currentUserID: req.session.user.objectId });
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error", error: e })
    }
})

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// Admin Panel------------------------------------------------------------------------------------------

app.get('/server-users', async (req, res) => {
    try {
        const users = await User.find()
            .populate('followers following posts')
            .exec();

        res.status(200).json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/server-users/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        await Post.deleteMany({ creator: userId });

        await User.updateMany(
            { $or: [{ followers: userId }, { following: userId }] },
            { $pull: { followers: userId, following: userId } }
        );

        await Post.updateMany(
            { likedBy: userId },
            { $pull: { likedBy: userId } }
        );

        await Notification.deleteMany({ user: userId });

        await User.findByIdAndDelete(userId);

        res.send('User deleted');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});



app.get('/server-posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('creator likedBy CommentsList.commentby').exec();
        res.json(posts);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/server-posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Find the post to be deleted
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Find the user who created the post
        const user = await User.findById(post.creator);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Delete the post from the user's posts array
        user.posts = user.posts.filter(postId => postId.toString() !== post._id.toString());
        await user.save();

        // Delete the post
        await Post.findByIdAndDelete(postId);

        res.send('Post deleted');
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).send('Error deleting post');
    }
});


app.get('/server-users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers following posts')
            .exec();
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(4000, function () {
    console.log("Server is up and running on port 4000");
});