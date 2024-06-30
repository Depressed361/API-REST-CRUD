const express = require('express');
const router = express.Router();
const Vehicule = require('../models/post.model');
const Ville = require('../models/ville.model');
require('dotenv').config();


const bcrypt = require('bcrypt');
const auth = require('../auth/auth');




router.post("/addVille", async (req, res) => {
    try {
        const ville = await Ville.create(req.body)
        res.status(201).json(ville);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;