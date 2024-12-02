import mongoose from 'mongoose';
import config from './config.js'


export const dbConnection = async () => {
    if (!config.MONGO_URI) {
        console.error('MONGO_URI is not defined in the environment variables.');
        return;
    }

    try {
        const connection = await mongoose.connect(config.MONGO_URI);
        console.log('MongoDB connected:',connection.connection.host);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};