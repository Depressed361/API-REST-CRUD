const express = require('express');
const router = express.Router();
//const {setPosts} = require('../controllers/post.controllers');
const {createVehicule} = require('../models/post.model');
const Vehicule = require('../models/post.model');
const session = require('express-session');
require('dotenv').config();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const auth = require('../auth/auth');
const Ville = require('../models/ville.model');
const resa = require('../models/resa.model');
const axios = require('axios');




router.get("/", (req, res) => {
    console.log(req.session);
});

// Route pour obtenir tous les véhicules disponibles dans une ville spécifique
router.get("/Vehicules/:villeId", async (req, res) => {
    try {
        // Vérifier si l'ID de la ville est fourni
        if (!req.params.villeId) {
            return res.status(400).json({ message: "L'ID de la ville est requis" });
        }

        // Rechercher les véhicules disponibles dans la ville spécifiée
        const vehicules = await Vehicule.find({disponible: true, villeId: req.params.villeId});

        // Si aucun véhicule n'est trouvé, retourner une erreur 404
        if (!vehicules.length) {
            return res.status(404).json({ message: "Aucun véhicule disponible dans cette ville" });
        }

        // Retourner les véhicules trouvés
        res.status(200).json(vehicules);
    } catch (error) {
        // Si une erreur se produit, retourner une erreur 500
        res.status(500).json({ message: error.message });
    }
});

router.get("/BookingVille", async (req, res) => {
    try {
        const villes = await Ville.find();
        // Ajouter une vérification pour s'assurer que les URLs des images sont correctes
        
        res.status(200).json(villes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/Vehicules/disponibilite/:name", async (req, res) => {
    try {
        const {name}  = req.params;
        const { dateDebut, dateFin } = req.query;

        // Convertir les dates de début et de fin en objets Date
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        // Rechercher le véhicule par ID de la ville qui est dans le modèle de véhicule
        const vehicule = await Vehicule.find({ name: name  });
        if (!vehicule) {
            return res.status(404).json({ message: "Véhicule non trouvé" });
        }

        // Rechercher les réservations qui se chevauchent avec l'intervalle de dates
        const reservations = await resa.find({
            
            dateDebut: { $lt: fin },
            dateFin: { $gt: debut }
        });

        // Si une réservation se chevauche, le véhicule n'est pas disponible
        if (reservations.length > 0) {
            return res.status(200).json({ disponible: false });
        }

        // Sinon, le véhicule est disponible
        return res.status(200).json(vehicule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/vehicule/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const vehicule = await Vehicule.findById(id);
        res.status(200).json(vehicule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/*/router.get("/Vehicules/disponibilite/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { dateDebut, dateFin } = req.query;

        // Convertir les dates de début et de fin en objets Date
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        // Rechercher le véhicule par ID de la ville qui est dans le modèle de véhicule
        const vehicule = await Vehicule.find({ villeId: id  });
        if (!vehicule) {
            return res.status(404).json({ message: "Véhicule non trouvé" });
        }

        // Rechercher les réservations qui se chevauchent avec l'intervalle de dates
        const reservations = await resa.find({
            
            dateDebut: { $lt: fin },
            dateFin: { $gt: debut }
        });

        // Si une réservation se chevauche, le véhicule n'est pas disponible
        if (reservations.length > 0) {
            return res.status(200).json({ disponible: false });
        }

        // Sinon, le véhicule est disponible
        return res.status(200).json({vehicule});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
//});*/



router.get("/Vehicules/priceperday/:id", async (req, res) => {
    try {
        const {id}= req.params;
        const vehicule = await Vehicule.findById(id);
        res.status(200).json(vehicule.pricePerDay);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





router.get('/Vehicules/:id', async (req, res) => {
 try {
    const {id}= req.params;
    const vehicule = await Vehicule.findById(id);
    res.status(200).json(vehicule);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

//router.post("/", setPosts);



module.exports = router;