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
        
        return true;
        
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        console.log(`Environment check: NODE_ENV=${process.env.NODE_ENV}, IS_DEV=${CONFIG.SERVER.IS_DEVELOPMENT}`);
        
        // In development mode, provide helpful error messages and fallback
        if (CONFIG.SERVER.IS_DEVELOPMENT) {
            console.log("⚠️  Development mode: MongoDB connection failed");
            console.log("   Possible solutions:");
            console.log("   1. Install MongoDB locally: brew install mongodb-community");
            console.log("   2. Start MongoDB: brew services start mongodb-community");
            console.log("   3. Configure Atlas connection in .env file");
            console.log("   4. Use Docker: docker run -d -p 27017:27017 mongo");
            console.log("   ⚠️  CONTINUING WITHOUT DATABASE - API will work but data operations will fail");
            
            // Don't exit in development, allow server to start
            return false;
        } else {
            // In production, database connection is critical
            console.error("💥 Production environment requires database connection");
            throw err;
        }
    }
}

export default connectDB; 
