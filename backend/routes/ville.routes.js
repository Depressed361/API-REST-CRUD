const express = require('express');
const router = express.Router();
const upload = require('../config/middleware/upload');
const Ville = require('../models/ville.model');
require('dotenv').config();


const bcrypt = require('bcrypt');
const auth = require('../auth/auth');

// Middleware CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.post("/addVille", async (req, res) => {
    try {
        const ville = await Ville.create(req.body)
        res.status(201).json(ville);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.put("/updateVille/:id", upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
       
       
        const ville = await Ville.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(ville);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;