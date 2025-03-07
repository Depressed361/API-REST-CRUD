const mongoose = require('mongoose');

const ReservationSchema =  mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  
    assurance: 
    {
        type: mongoose.Schema.Types.String,
        ref: 'assurance',

    },

    status: {
        type: String,
        enum: ['En attente', 'Confirmée', 'Annulée'],
        default: 'En attente'
    }

});
    ReservationSchema.pre('save', function(next) {
        if (this.dateFin) {
          // Arrondir la date à la seconde la plus proche en ignorant les millisecondes
          this.dateFin = new Date(this.dateFin.setMilliseconds(0));
        }
        next();

});



const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;