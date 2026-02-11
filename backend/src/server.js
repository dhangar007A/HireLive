import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import {serve} from 'inngest/express';
import { inngest, functions } from './lib/inngest.js';
import chatRoutes from './routes/chatRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up two levels from backend/src to project root
const projectRoot = path.resolve(__dirname, '..', '..');

//middlewares
app.use(express.json());
// credentials=true means => server allows a browser to include cookies on requests
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(clerkMiddleware()); // this adds auth field to req object: req.auth

app.use('/api/inngest', serve({client: inngest, functions}));
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({msg: "Hello, healthy!"});
});


if (ENV.NODE_ENV === 'production') {
    // Serve the built frontend from repo root /frontend/dist
    app.use(express.static(path.join(projectRoot, 'frontend', 'dist')));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(projectRoot, 'frontend', 'dist', 'index.html'));
    });
}


const startServer = async () => {
    try {
        await connectDB();  
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on http://localhost:${ENV.PORT}`);
        });
    } catch (err) {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    }       
};

startServer();
