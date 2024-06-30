const mongoose = require('mongoose');

const villeSchema = mongoose.Schema({

    name: {
        type : String,
        required: true,
        trim : true,
        unique : true
    },
    codePostal: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false
    },
});


const Ville = mongoose.model('Ville', villeSchema);
module.exports = Ville;