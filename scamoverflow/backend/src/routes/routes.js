require('dotenv').config()

const { Router } = require("express");
const router = Router();

//Import bcrypt
const bcrypt = require("bcrypt");

//const nodemailer = require("nodemailer");

//Import user model
const User = require("../models/user");
const Ticket = require("../models/ticket");
const Post = require("../models/post");
const Comment = require("../models/Comment");

//Import JSON Web Token
const jwt = require("jsonwebtoken");

//Import Multer for file uploading
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../backend/src/public/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage}).single('file')


/**
 * -----------------------
 *          Routes
 * -----------------------
 */


router.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err){
            console.log(JSON.stringify(err));
            res.status(400).send("fail saving image");
        } else {
            const filename = req.file.filename;
            res.status(200).json({ filename });
    }
    })
})

router.post("/create-post", verifyToken, async (req, res) => {
    try {

        const userId = req.userId;

        const { title, description, image } = req.body;

        const user = await User.findById({_id: userId})

        const newPost = new Post({
            userId: userId,
            name: user.name,
            occupation: user.occupation,
            title: title,
            description: description,
            image: image            
        })
        await newPost.save();

        res.status(200).json({ success: "Post Created!" });
    } catch (e) {
        console.log("Request error: " + e);
    }
})

router.post("/signup", async (req, res) => {
    try {

        //const { name, phone, email, password, image } = req.body;
        
        const { name, phone, email, password, occupation } = req.body;
        const hash = await bcrypt.hash(password, 10);

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({error: "Email already exists"});
        }

        const newUser = new User({
            name: name,
            phone: phone,
            email: email,
            password: hash,
            occupation: occupation,
            role: 'user',
            ban: ""
        })
        await newUser.save();

        const token = jwt.sign({_id: newUser._id}, process.env.SECRET_KEY);

        res.status(200).json({ token });
    } catch (e) {
        console.log("Request error: " + e);
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email});

        console.log(user)

        if(user.ban != "") return res.status(400).json({ban: user.ban});
        
        if(!user) return res.status(400).send("The email is not associated with any account in existence");

        const validPass = await bcrypt.compare(password, user.password);

        if(!validPass) return res.status(401).send("Wrong password");

        //Create token after successful login

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

        return res.status(200).json({ token, name: user.name, image: user.image, role: user.role });

    } catch (e) {
        console.log("Request error: " + e);
    }
})

router.post("/get-user", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { profileId } = req.body;

        const user = await User.findById({_id: profileId}, {password: 0});

        if(userId == profileId){
            res.status(200).json({user, owner: true});
        }else{
            res.status(200).json({user, owner: false});
        }

    } catch (error) {
        console.log("Request error: " + error);
    }
})

router.post("/ban-user", async (req, res) => {
    try {
        const { userid, ban, commentid } = req.body;

        await User.findOneAndUpdate({_id: userid}, {$set: {"ban" : ban}});

        await Comment.findByIdAndDelete({_id: commentid});

        res.status(200).json({success: "User banned successfully"});

    } catch (error) {
        console.log("Request error: " + error);
    }
})

router.get("/get-posts", async (req, res) => {

    try {
        
        const posts = await Post.find();

        let newPosts = [];

        newPosts = await Promise.all(posts.map(async (post, key) => {

            const newPost = {
                _id: post._id,
                userId: post.userId,
                name: post.name,
                occupation: post.occupation,
                title: post.title,
                description: post.description,
                image: post.image,
                comments: []
            };

            newPost.comments = await Comment.find({postId: post._id});

            return newPost
            
        }))

        res.status(200).json({posts: newPosts})

    } catch (error) {
        console.log(error)
    }

})

router.post("/get-user-posts", async (req, res) => {

    try {
        
        const { userid } = req.body;

        const posts = await Post.find({userId: {$eq: userid}})

        res.status(200).json({posts: posts})

    } catch (error) {
        console.log(error)
    }
})

router.post("/answer-ticket", async (req, res) => {
    try {
        
        const { ticketid, answer } = req.body;

        await Ticket.updateOne({_id: ticketid}, {$set : {answer: answer, state: "solved"}});

        const tickets = await Ticket.find({})

        return res.status(200).json({ tickets });

    } catch (error) {
        console.log(error)
    }
})

router.post("/create-comment", verifyToken, async (req, res) => {
    try {

        const userId = req.userId;

        const { postid, comment } = req.body;

        const user = await User.findById({_id: userId})

        const newComment = new Comment({
            postId: postid,
            userid: userId,
            name: user.name,
            comment: comment,
            misinformation: 0,
            badlanguage: 0,
            spam: 0
        })

        await newComment.save();

        res.status(200).json({ success: "Comment Saved!" });
    } catch (e) {
        console.log("Request error: " + e);
    }
})

router.post("/report-comment", async (req, res) => {
    try {
        
        const { commentid, reason } = req.body;

        if(reason == "misinformation"){
            await Comment.findOneAndUpdate({_id: commentid}, {$inc: {"misinformation": 1}});
        }else if(reason == "badlanguage"){
            await Comment.findOneAndUpdate({_id: commentid}, {$inc: {"badlanguage": 1}});
        }else{
            await Comment.findOneAndUpdate({_id: commentid}, {$inc: {"spam": 1}});
        }

        return res.status(200).json({ success: "Comment Reported Successfully" });

    } catch (error) {
        console.log(error)
    }
})

router.post("/delete-post", async (req, res) => {
    try {
        
        const { postid } = req.body;

        await Post.findByIdAndDelete({ _id: postid });

        return res.status(200).json({ success: "Post deleted successfully" });

    } catch (error) {
        console.log(error)
    }
})

router.post("/edit-profile", async (req, res) => {
    try {
        
        const { userid, name, occupation, email, phone } = req.body;

        await User.updateOne({_id: userid}, {$set : {name: name, email: email, occupation: occupation, phone: phone}});

        const user = await User.findById({_id: userid})

        return res.status(200).json({ user });

    } catch (error) {
        console.log(error)
    }
})

// =====================
// =====================
// =====================
// =====================
// =====================
// END OF THE NEW ROUTES
// =====================
// =====================
// =====================
// =====================
// =====================

router.post("/process-ticket", async (req, res) => {
    try {
        
        const { ticketid } = req.body;

        await Ticket.updateOne({_id: ticketid}, {$set : {state: "processed"}});

        const tickets = await Ticket.find({})

        return res.status(200).json({ tickets });

    } catch (error) {
        console.log(error)
    }
})

router.post("/get-user-solved-tickets", async (req, res) => {

    const { userid } = req.body;

    const tickets = await Ticket.find({userid: userid});

    res.status(200).json({tickets:  tickets});
})

/**
 * /ticket-submit
 * Allow users save a ticket after checking if the user is logged in.
 * 
 */

router.post("/ticket-submit", verifyToken, async (req, res) => {
    try {
        const {userId} = req;

        if(userId == "") res.status(301).json({error: "Not logged in"})

        const { category, description } = req.body;

        const user = await User.findById({ _id: userId});

        const newTicket = new Ticket({
            userid: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            category: category,
            description: description,
            state: "new",
            answer: ""
        })

        await newTicket.save();

        res.status(200).json({ message: "Ticket submitted successfully" });

    } catch (error) {
        console.log("Request error: " + error);
    }
})

router.post("/register", verifyToken, async (req, res) => {
    const {userId} = req;
    if(userId != ""){
        const user = await User.findOne({ _id: userId}, { _id: 1, name: 1, role: 1});
        res.status(200).json(user);
    }else{
        res.status(301).json({error: "No user"})
    }
})

router.get("/get-moderators", async (req, res) => {
    const users = await User.find({ role: {$eq: "admin"} });

    res.status(200).json({users: users});
})

router.get("/tickets", async (req, res) => {

    const tickets = await Ticket.find();

    res.status(200).json({"tickets": tickets});
})

router.post("/tickets-amount", async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findOne({ _id: userId });

        const tickets = await Ticket.find({category: {$in : user.categories}, adminId: ""}, { _id: 1});

        res.status(200).json({"amount": tickets.length});
    } catch (error) {
        console.log(error)
    }
})

function verifyToken(req, res, next){

    //Check if the request has the "Bearer" header
    if(!req.headers.authorization){
        return res.status(401).send("Unauthorized request");
    }

    //Check if the token is not null
    const token = req.headers.authorization.split(" ")[1];
    if(token == "null"){
        return res.status(401).send("Unauthorized request");
    }

    req.userId = "";

    try{
        //Verify token and get the info that we introduced into it
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        //Introduce the payload into the request body
        req.userId = payload._id;

    }catch(e){
        console.log("Not a valid Bearer")
    }
    next();
}

module.exports = router;