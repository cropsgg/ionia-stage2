import mongoose from "mongoose";
import { CONFIG } from "../config/index.js";

const connectDB = async () => {
    try {
        console.log("🔌 Connecting to MongoDB...");
        console.log(`Connection URI: ${CONFIG.DATABASE.URI.replace(/\/\/.*@/, '//***:***@')}`);
        console.log(`Environment: ${CONFIG.SERVER.NODE_ENV}`);
        console.log(`Is Development: ${CONFIG.SERVER.IS_DEVELOPMENT}`);
        
        const connectionInstance = await mongoose.connect(
            CONFIG.DATABASE.URI, 
            CONFIG.DATABASE.CONNECTION_OPTIONS
        );
        
        console.log(`✅ MongoDB connected successfully!`);
        console.log(`   Host: ${connectionInstance.connection.host}`);
        console.log(`   Database: ${connectionInstance.connection.name}`);
        console.log(`   Port: ${connectionInstance.connection.port}`);
        
        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('📊 Mongoose connected to MongoDB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('📴 Mongoose disconnected from MongoDB');
        });
        
        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n🔄 Gracefully shutting down...');
            if (mongoose.connection.readyState !== 0) {
                await mongoose.connection.close();
                console.log('✅ MongoDB connection closed');
            }
            process.exit(0);
        });
        
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        console.log(`Environment check: NODE_ENV=${process.env.NODE_ENV}, IS_DEV=${CONFIG.SERVER.IS_DEVELOPMENT}`);
        
        // Always continue in development mode without database
        console.log("⚠️  Development mode: Continuing without database connection");
        console.log("   API endpoints will work but database operations will fail");
        console.log("   Please install and start MongoDB locally or configure Atlas connection");
        console.log("   To install MongoDB: brew install mongodb-community");
        console.log("   To start MongoDB: brew services start mongodb-community");
        
        // Don't exit, continue without database
        return;
    }
}

export default connectDB; 
