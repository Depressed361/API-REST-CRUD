const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vehicule = require('../models/post.model');
const session = require('express-session');
require('dotenv').config();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const auth = require('../auth/auth');
const Ville = require('../models/ville.model');
const Reservation = require('../models/resa.model');


//post.routes route est le fichier contenant les routes des requetes concernant la reservations et les vehicules
//meme si la route s'appelle post , elle contient des requetes post get put etc...



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
        const { name } = req.params;
        const { dateDebut, dateFin } = req.query;

        // Convertir les dates de début et de fin en objets Date
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        // Rechercher tous les véhicules dans la ville spécifiée
        const vehicules = await Vehicule.find({ name: name }); // name est le nom de la ville dans le modèle de véhicule

        if (!vehicules.length) {
            return res.status(404).json({ message: "Aucun véhicule trouvé dans cette ville" });
        }

        // Filtrer les véhicules disponibles
        const vehiculesDisponibles = [];

        for (const vehicule of vehicules) {
            const reservations = await Reservation.find({
                vehicule: vehicule._id,
                dateDebut: { $lt: fin },
                dateFin: { $gt: debut }
            });

            // Si aucune réservation ne se chevauche, le véhicule est disponible
            if (reservations.length === 0) {
                vehiculesDisponibles.push(vehicule);
            }
        }

        // Retourner les véhicules disponibles
        res.status(200).json(vehiculesDisponibles);
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

router.post("/reserve-and-pay", auth, async (req, res) => {
    try {
        const { vehiculeId, userId, dateDebut, dateFin, assurance } = req.body;

        // Vérifier que toutes les informations nécessaires sont présentes
        if (!vehiculeId || !userId || !dateDebut || !dateFin) {
            return res.status(400).json({ message: "Toutes les informations sont requises" });
        }

        // Simuler le paiement
        const paymentSuccess = true; // Vous pouvez remplacer cette ligne par une logique de paiement réelle

        if (!paymentSuccess) {
            return res.status(400).json({ message: "Le paiement a échoué" });
        }

        // Vérifier que le véhicule est disponible pour les dates spécifiées
        const reservations = await Reservation.find({
            vehicule: vehiculeId,
            dateDebut: { $lt: new Date(dateFin) },
            dateFin: { $gt: new Date(dateDebut) }
        });

        if (reservations.length > 0) {
            return res.status(400).json({ message: "Le véhicule n'est pas disponible pour les dates spécifiées" });
        }

        // Créer la réservation
        const reservation = new Reservation({
            vehicule: new mongoose.Types.ObjectId(vehiculeId),
            user: new mongoose.Types.ObjectId(userId),
            dateDebut: new Date(dateDebut),
            dateFin: new Date(dateFin),
            assurance: assurance,
            status: 'Confirmée'
        });

        await reservation.save();

        res.status(201).json({ message: "Réservation et paiement réussis", reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;