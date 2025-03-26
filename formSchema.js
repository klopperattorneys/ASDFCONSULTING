const mongoose = require('mongoose');

//=========== Schema for the Form Data ===========
// Define a schema for the form data
const formSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,       
        trim: true,
    },
    businessRegistrationNumber: {
        type: String,
        required: true,
        trim: true,
    },
    facilityType: {
        type: String,
        enum: ['Loan', 'Invoice Factoring'],// limit the values to only those two options
        required: true
    },
    facilitySize: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

// Export the schema
module.exports = mongoose.model('formData', formSchema);

