// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const PORT = process.env.PORT || 3000; 


// Create an instance of an Express application
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/views/home.html'));
});
 
app.get('/page1', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/views/page1.html'));
});
 
app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/views/page2.html'));
});

app.set ('views', path.join(__dirname, 'src.views'))


 
// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});