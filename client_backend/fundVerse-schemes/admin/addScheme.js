// Import required modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('../models/schemeModel'); // Correct path to the scheme model

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Function to add a new scheme
const addScheme = async () => {
    // Sample data for the new scheme
    const newScheme = new Scheme({
        name: 'Savings Scheme',
        description: 'A scheme to help users save money with good returns.',
        target_audience: 'Individuals looking to save money',
        investment_plan: {
            monthly_contribution: { min: 1000, max: 5000 },
            chit_period: { min: 6, max: 24 }, // in months
            total_fund_value: [
                { duration: 12, min_value: 12000, max_value: 60000 }
            ]
        },
        benefits: ['High returns', 'Flexible contributions', 'Insurance coverage']
    });

    try {
        // Save the new scheme to the database
        const result = await newScheme.save();
        console.log('Scheme added:', result);
    } catch (error) {
        console.error('Error adding scheme:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

// Execute the function
addScheme();
