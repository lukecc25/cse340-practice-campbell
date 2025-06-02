import dashboardRoutes from './src/routes/dashboard/index.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupDatabase, testConnection } from './src/models/setup.js';

// Import route handlers from their new locations
import indexRoutes from './src/routes/index.js';
import exploreRoutes from './src/routes/products/index.js';
import testRoutes from './src/routes/test.js';

// Import global middleware
import {
    addGlobalData,
    addTimestamp,
    poweredByHeader,
    measureProcessingTime,
    validateDisplayMode
} from './src/middleware/index.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Static files
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON data in request body
app.use(express.json());
 
// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));
// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Global middleware
app.use(addGlobalData);
app.use(addTimestamp);
app.use(poweredByHeader);
app.use(measureProcessingTime);

// Middleware to parse JSON data in request body
app.use(express.json());
 
// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));
/**
 * Routes
 */

// Route handlers from imported routers
app.use('/', indexRoutes);           
app.use('/products', exploreRoutes); 
app.use('/test', testRoutes);     
app.use('/dashboard', dashboardRoutes);
// Custom product routes

// Manual error test route
app.get('/manual-error', (req, res, next) => {
    const err = new Error('This is a manually triggered error');
    err.status = 500;
    next(err);
});


/**
 * Error Handling Middleware
 */

// 404 Handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
        error: err.message,
        stack: err.stack,
        NODE_ENV,
        PORT
    };
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, context);
});

/**
 * WebSocket Dev Server (Live Reloading)
 */
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');
    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();
        await setupDatabase();
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
