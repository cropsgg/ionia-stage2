import { CONFIG } from './config/index.js';
import connectDB from './db/db.js';
import { app } from './app.js';

// Start the application
const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();
        
        // Start the server
        const server = app.listen(CONFIG.SERVER.PORT, () => {
            console.log(`🚀 Server is running successfully!`);
            console.log(`   Environment: ${CONFIG.SERVER.NODE_ENV}`);
            console.log(`   Port: ${CONFIG.SERVER.PORT}`);
            console.log(`   API Base URL: ${CONFIG.API.BASE_URL}`);
            console.log(`   Frontend URL: ${CONFIG.API.FRONTEND_URL}`);
            console.log(`📍 Server URLs:`);
            console.log(`   Local: http://localhost:${CONFIG.SERVER.PORT}`);
            console.log(`   API Docs: http://localhost:${CONFIG.SERVER.PORT}/api`);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error("❌ Server error:", error);
            throw error;
        });

        // Graceful shutdown
        const shutdown = (signal) => {
            console.log(`\n🔄 Received ${signal}. Graceful shutdown...`);
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

// Start the server
startServer();