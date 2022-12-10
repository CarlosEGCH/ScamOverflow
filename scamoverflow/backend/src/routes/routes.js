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

//Import JSON Web Token
const jwt = require("jsonwebtoken");

//Import Multer for file uploading
const multer = require("multer");
const path = require("path");
const { findOne } = require('../models/user');


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
            return res.status(400).json({error: "User already exists"});
        }

        const newUser = new User({
            name: name,
            phone: phone,
            email: email,
            password: hash,
            occupation: occupation,
            role: 'user',
            //image: image
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

        if(!user) return res.status(401).send("The email is not associated with any account in existence");

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

router.get("/get-posts", async (req, res) => {

    try {
        
        const posts = await Post.find();

        res.status(200).json({posts: posts})

    } catch (error) {
        console.log(error)
    }

})

router.post("/get-user-posts", async (req, res) => {

    try {
        
        const { userid } = req.body;

        console.log(userid)

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

        const newComment = {
            userid: userId,
            name: user.name,
            comment: comment
        }

        await Post.findOneAndUpdate({_id: postid}, {$push : {"comments": newComment}});

        res.status(200).json({ success: "Comment Saved!" });
    } catch (e) {
        console.log("Request error: " + e);
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


// END OF THE NEW ROUTES

router.post("/submit-shortcut", async (req, res) => {
    try {
        const {message, category, adminId} = req.body;
        console.log(category.toLowerCase())
        const newShortcut = new Shortcut({
            message: message,
            category: category.toLowerCase(),
            adminId: adminId
        })

        await newShortcut.save();

        return res.status(200).json(newShortcut);

    } catch (error) {
        console.log(error)
    }
})

router.post("/delete-shortcut", async (req, res) => {
    try {
        
        const { id } = req.body;
        await Shortcut.findByIdAndDelete({ _id: id });

        return res.status(200).json({ message: "Shortcut deleted" });

    } catch (error) {
        console.log(error)
    }
})

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

router.post("/get-faq", async (req, res) => {
    try {
        
        const { category } = req.body;

        const pinnedFaq = await Faq.find({ category: category.toLowerCase(), pinned: true }) || [];

        const unpinnedFaq = await Faq.find({ category: category.toLowerCase(), pinned: false }).sort({createdAt: -1}) || [];

        const faq = [...pinnedFaq, ...unpinnedFaq];

        if(!faq) return res.status(401).json({ message: "No faq found" });

        if(faq.length == 0) return res.status(401).json({ message: "No faq found" });

        return res.status(201).json({ faq });

    } catch (error) {
        console.log(error)
    }
})

router.post("/faq-submit", async (req, res) => {
    try {
        
        const { question, answer, category, ticketId } = req.body;

        const newFaq = new Faq({
            title: question,
            response: answer,
            category: category,
            pinned: false
        })
        
        await newFaq.save(async (err, faq) => {
            if(err) return res.status(401).send(err);
            await Ticket.findOneAndDelete({_id: ticketId})
        })

        res.status(201).json("FAQ submitted");
    } catch (error) {
        console.log(error)
    }
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

        const user = await User.findOne({ _id: userId});

        const newTicket = new Ticket({
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