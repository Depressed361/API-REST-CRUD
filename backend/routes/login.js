const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const {createVehicule} = require('../models/post.model');
const Vehicule = require('../models/post.model');
const session = require('express-session');
require('dotenv').config();
const Assurance =require('../models/assurance.model');
const User = require('../models/user.model');
const bcrypt = require('bcrypt')
const privateKey = require('../auth/private_key');
const jwt = require ('jsonwebtoken');
const Resa = require('../models/resa.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


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

        req.session.user = {id: user._id, token: token};
        return res.status(200).json({user:user,token:token});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "Logged out successfully" });
});

//route pour réinitialiser le mot de passe
router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Générer un jeton de réinitialisation
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 heure

        // Enregistrer le jeton et l'expiration dans l'utilisateur
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Envoyer le jeton par e-mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Réinitialisation du mot de passe',
            text: `Vous recevez cet e-mail parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n` +
                `Veuillez cliquer sur le lien suivant, ou copiez-le dans votre navigateur pour compléter le processus :\n\n` +
                `http://${req.headers.host}/reset-password/${resetToken}\n\n` +
                `Si vous n'avez pas demandé cela, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Un e-mail de réinitialisation du mot de passe a été envoyé à ' + user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//inscription

router.post("/inscription", async (req, res) => {
    try {
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Un utilisateur avec cette adresse e-mail existe déjà." });
        }
        // Hachez le mot de passe
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Créez un nouvel utilisateur
        const user = await User.create({ ...req.body, password: hashedPassword });

        // Répondez avec les détails de l'utilisateur créé
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch ("/:id", auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id", auth, (req, res) => {
    console.log(req.params.id);
    console.log(req.body);

    res.json({message: `You patched post ${req.params.id}`});
});

// finaliser la location

router.get ('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/reservations/:id', auth, async (req, res) => {
    try {
        await Resa.create(req.body);
        res.status(201).json({ message: req.body });

    } catch (error) {
        res.status(400).json({ message: error.message });
     
    }
});


router.get ('/Getreservations/:id', auth, async (req, res) => {
    try {
        const resa=await Resa.find ({user: req.params.id});
        res.status(200).json(resa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get assurances


router.get ('/GetAssurances', auth, async (req, res) => {
    try {
        const assurance = await Assurance.find ();
        res.status(200).json(assurance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





module.exports = router;