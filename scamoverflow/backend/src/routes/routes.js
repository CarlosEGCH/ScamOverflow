require('dotenv').config()

const { Router } = require("express");
const router = Router();

//Import bcrypt
const bcrypt = require("bcrypt");

//const nodemailer = require("nodemailer");

//Import user model
const User = require("../models/user");
const Ticket = require("../models/ticket");
const Message = require("../models/message");

//Import JSON Web Token
const jwt = require("jsonwebtoken");

//Import Multer for file uploading
//const multer = require("multer");
const path = require("path");

/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../server/src/public/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage}).single('file')
*/

/**
 * -----------------------
 *          Routes
 * -----------------------
 */

/*
router.post("/upload",(req, res) => {
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
*/

router.post("/reopen-ticket", async (req, res) => {
    const { ticketId, category, title, description, email } = req.body;
    const newTicket = new Ticket({
        category,
        title,
        message: description,
        email,
        adminId: '',
        response: ''
    })


    await Ticket.findByIdAndDelete({ _id: ticketId });

    await newTicket.save();

    res.status(200).json({"message": "Ticket reopened"})
})

router.post("/signup", async (req, res) => {
    try {

        //const { name, phone, email, password, image } = req.body;
        
        const { name, phone, email, password } = req.body;
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

router.post("/save-message", async (req, res) => {
    try {
        const { message, author, room, image, isImage } = req.body;
        
        const newMessage = new Message({
            message: message,
            author: author,
            room: room,
            image: image,
            isImage: isImage
        })
        await newMessage.save();

        res.status(200).json({ message: "Message saved" });
    } catch (e) {
        console.log("Request error: " + e);
    }
})

router.post("/edit-message", async (req, res) => {
    try {
        const { id, content } = req.body;
        await Message.updateOne({_id: id}, {$set : {message: content}});

        res.status(200).json({ message: "Message updated" });

    } catch (error) {
        console.log(error)
    }
})

router.post("/edit-ticket", async (req, res) => {
    try {
        
        const { id, content, response } = req.body;

        await Ticket.updateOne({_id: id}, {$set : {title: content, response: response}});

        res.status(200).json({ message: "Ticket updated" });

    } catch (error) {
        console.log(error)
    }
})

router.get("/get-messages", async (req, res) => {
    const messages = await Message.find({}).sort({createdAt: 1});

    res.status(200).json({ messages });
})

router.post("/delete-message", async (req, res) => {
    try {
        const { id } = req.body;
        await Message.deleteOne({_id: id});

        res.status(200).json({ message: "Message deleted" });
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

router.post("/edit-description", async (req, res) => {
    try {
        const { id, content } = req.body;

        await User.updateOne({_id: id}, {$set : {description: content}});

        res.status(200).json({ message: "Description updated" });

    } catch (error) {
        console.log(error)
    }
})

router.post("/answer-ticket", async (req, res) => {
    try {
        
        const { ticketId, email, response, adminId, faq } = req.body;

        const ticket = await Ticket.findOneAndUpdate({ _id: ticketId }, { $set: { response: response, adminId: adminId } }, { new: true });

        const admin = await User.findOne({ _id: ticket.adminId });

        /*const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
               ciphers:'SSLv3'
            }
        })*/

        if(!ticket) return res.status(401).send("Ticket not found");

        /*await transport.sendMail({
            from: admin.email,
            to: email,
            subject: "Ticket response - WeUMa",
            html: `<h1>Ticket response</h1>
                    <p>${ticket.title}</p>
                    <p>${ticket.message}</p>
                    <p>${response}</p>
                    <p>${admin.name}</p>
                    <p>${admin.email}</p>
                    `

        })*/

        if(faq){
            const newFaq = new Faq({
                title: ticket.title,
                response: response,
                pinned: false,
                category: ticket.category
            })
            await newFaq.save();
        }

        return res.status(200).json({ ticket });

    } catch (error) {
        console.log(error)
    }
})

router.post("/get-solved-tickets", async (req, res) => {
    try {
        
        const { profileId } = req.body;

        const solvedTickets = await Ticket.find({ adminId: profileId }).sort({createdAt: -1});

        if(!solvedTickets) return res.status(401).send("No tickets found");

        return res.status(200).json({ solvedTickets });

    } catch (error) {
        console.log(error)
    }
})

router.post("/delete-faq", async (req, res) => {
    try {
        
        const { id } = req.body;
        await Faq.findByIdAndDelete({ _id: id });

        return res.status(200).json({ message: "FAQ deleted" });

    } catch (error) {
        console.log(error)
    }
})

router.post("/delete-ticket", async (req, res) => {
    try {
        
        const { id } = req.body;
        await Ticket.findByIdAndDelete({ _id: id });

        return res.status(200).json({ message: "Ticket deleted" });

    } catch (error) {
        console.log(error)
    }
})

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

router.post("/get-shortcuts", async (req, res) => {
    try {
        
        const { id } = req.body;
        const shortcuts = await Shortcut.find({ adminId: id }).sort({createdAt: -1});

        return res.status(200).json({ shortcuts });

    } catch (error) {
        console.log(error)
    }
})

router.post("/pin-faq", async (req, res) => {
    try {
        
        const { id } = req.body;

        const faq = await Faq.findOne({ _id: id });

        await Faq.updateOne({_id: id}, {$set : {pinned: !faq.pinned}});

        return res.status(200).json({ message: "FAQ pinned" });

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
            category: category.toLowerCase(),
            description: description
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
        const user = await User.findOne({ _id: userId}, { _id: 1, name: 1, image: 1, role: 1, categories: 1});
        res.status(200).json(user);
    }else{
        res.status(301).json({error: "No user"})
    }
})

router.get("/users", async (req, res) => {
    const users = await User.find({});

    res.status(200).json({"users": users});
})

router.post("/tickets", async (req, res) => {
    const { categories } = req.body;

    const tickets = await Ticket.find({adminId : {$eq : ''}, category: {$in : categories}}, { _id: 1, email: 1, category: 1, title: 1, message: 1, senderId: 1, createdAt: 1});

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