const mongoose =  require('mongoose');
const assuranceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const assurance = mongoose.model('Assurance', assuranceSchema);
module.exports = assurance;