// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const PORT = process.env.PORT || 3000; 
const NODE_ENV = process.env.NODE_ENV || 'production';


// Create an instance of an Express application
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    const title = 'Home Page';
    const content = '<h1>Welcome to the Home Page</h1><p>This is the main content of the home page.</p>';
    res.render('index', { title, content, NODE_ENV, PORT });
});
app.get('/about', (req, res) => {
    const title = 'About';
    const content = `
    <h1>About Me</h1>
    <p>Hello! I’m Luke a student trying to be a web developer. I'm learning to build clean, user-friendly websites.</p>
    <img src="/images/me-byui.webp" alt="My photo" style="max-width: 200px;">
`;
    res.render('index', { title, content, NODE_ENV, PORT });
});
 
app.get('/contact', (req, res) => {
    const title = 'Contact';
    const content = `
    <h1>Contact Me</h1>
    <form action="/submit" method="POST">
        <input type="text" name="name" placeholder="Name"><br>
        <input type="email" name="email" placeholder="Email"><br>
        <textarea name="message" placeholder="Message"></textarea><br>
        <input type="submit" value="Submit">
    </form>
`;
    res.render('index', { title, content, NODE_ENV, PORT });
});



 
// Start the server and listen on the specified port
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

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});