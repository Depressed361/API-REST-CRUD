const assurance =require('../models/assurance.model');
const express = require('express');
const router = express.Router();





router.get("/GetAssurance", async (req, res) => {
    try {
        const assurances = await assurance.find();
        res.status(200).json(assurances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

module.exports = router;
