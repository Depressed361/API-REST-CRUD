const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const {createVehicule} = require('../models/post.model');
const Vehicule = require('../models/post.model');
const session = require('express-session');
require('dotenv').config();
const app = express();
const User = require('../models/user.model');
const bcrypt = require('bcrypt')
const privateKey = require('../auth/private_key');
const jwt = require ('jsonwebtoken')
 

router.use (session({
   name : process.env.SESSION_NAME,
   resave : false,
    saveUninitialized : false,
    secret : privateKey,
    cookie : {
    maxAge : 1000 * 60 * 60 * 2,
        sameSite : true,
        secure : process.env.NODE_ENV === 'production'
    }

}))


//jwt


//login


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); // Change 'user' to 'User'
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        
        const token = jwt.sign({ id: user._id }, privateKey, { expiresIn: 60 * 60 * 2 });

        req.session.user = user;
        return res.status(200).json({user:user,token:token});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



//inscription

router.post ("/inscription", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({...req.body, password: hashedPassword});
         
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// patch

router.patch("/:id", auth, (req, res) => {
    console.log(req.params.id);
    console.log(req.body);

    res.json({message: `You patched post ${req.params.id}`});
});

// finaliser la location




module.exports = router;