/* Load environment variables from the .env 
file using the dotenv package*/
require('dotenv').config();
// Import required modules and packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// Import the formSchema
const FormSubmission = require('./formSchema');

const app = express();

//Extract Environmental Variables
const port = process.env.PORT || 3001;
const uri = process.env.DATABASE_URL;
const database = process.env.DATABASE_NAME;

//Conditional rendering to check if enviromental variables are present
if (!uri || !database || !port) {
    console.error("Missing required environment variables:");
    if (!uri) console.error("- DATABASE_URL is missing");
    if (!database) console.error("- DATABASE_NAME is missing");
    if (!port) console.error("PORT is missing");
    process.exit(1); // Exit process if variables are missing
}

//===========SETUP MIDDLEWARE==================
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors({ origin: '*' })); // Enable CORS for all origins

//==================CONNECT TO MONGODB=================
mongoose.Promise = global.Promise

mongoose.connect(uri, {
    dbName: database
})
    .then(() => {
        console.log('connected to mongoDb');
        
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);//Log an error message for debugging purposes
        process.exit(1)
    })

//==================MONGODB EVENT HANDLERS=======================
// Function executed when there is an error in the MongoDB connection
mongoose.connection.on('error', (error) => {
    console.error('Could not connect to the database. Exiting now...', error);//Log an error message in the console for debugging purposes
    process.exit(1);//Exit the process with a failure code
})
// Function executed when the MongoDB connection is successfully open
mongoose.connection.once('open', () => {
    console.log('Successfully connected to the database');//Log a success message in the console for debugging purposes
});

//=================API ENDPOINTS===========================
// API Endpoint: Fetch Zoho Form Data and save it to MongoDB
app.post(`/api/submitForm`, async (req, res) => {
    try {
        const formData = req.body; // Zoho Webhook sends JSON data
        console.log("Received Webhook Data:", formData);

        // Extract form fields
        const { businessName, businessRegistrationNumber, facilityType, facilitySize } = formData;

        // Validate required fields
        if (!businessName || !businessRegistrationNumber || !facilityType || !facilitySize) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Save form data to MongoDB
        const newSubmission = new FormSubmission({
            businessName,
            businessRegistrationNumber,
            facilityType,
            facilitySize
        });

        await newSubmission.save();

        res.status(200).json({ message: "Form submission saved successfully" });

    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//=================START THE SERVER =======================
// Start the server and connect to MongoDB
app.listen(port,  () => {
    console.log(` Server is running on port: ${port}`);
})
