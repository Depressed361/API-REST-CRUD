const mongoose = require('mongoose');



const VehiculeSchema = mongoose.Schema({

    picture: {
        type: String,
        required: false
    },
    immatriculation: {
        type: String,
        required: true
    },
    make: {
        type: String,
        required: true
    },
    modele: {
        type: String,
        required: true
    },
    annee: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },

    caution: {
         type: Number,
         required: true,
         default: 480
    },
  
    villeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ville', // le nom du modèle auquel 'villeId' fait référence
        required: false
    },

    name: {
        type: mongoose.Schema.Types.String,
        ref: 'Ville', // le nom du modèle auquel 'villeId' fait référence
        required: false
    }


    
});

const Vehicule = mongoose.model('Vehicule', VehiculeSchema);


module.exports= Vehicule;