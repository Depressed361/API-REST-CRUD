const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    vehicule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicule',
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,

        required: true
    },
    utilisateur: {
        type: mongoose.Schema.Types.String,
        ref: 'Utilisateur',
        required: true
    },
    assurance: 
    {
        type: mongoose.Schema.Types.String,
        ref: 'assurance',

    }

});
    ReservationSchema.pre('save', function(next) {
        if (this.dateFin) {
          // Arrondir la date à la seconde la plus proche en ignorant les millisecondes
          this.dateFin = new Date(this.dateFin.setMilliseconds(0));
        }
        next();

});

module.exports = mongoose.model('Reservation', ReservationSchema);