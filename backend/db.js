const mongoose = require('mongoose');

// Replace 'your_atlas_connection_string' with the actual connection string from MongoDB Atlas
const atlasConnectionString = 'mongodb://localhost:27017/Project';
const mongoURI = atlasConnectionString;

async function connectToMongo() {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error.message);
    }
}

module.exports = connectToMongo;
