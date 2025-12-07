import express from 'express';
import path from 'path';
import cors from 'cors';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import {serve} from 'inngest/express';
import { inngest } from './lib/inngest.js';


const app = express();
const __dirname = path.resolve();

//middlewares
app.use(express.json());
//Credentials=true means => server allows a browser to include cookies on requests
app.use(cors({origin:ENV.CLIENT_URL}, Credentials=true));

app.use('/inngest', serve({client: inngest, functions}));

app.get("/health", (req, res) => {
    res.status(200).json({msg: "Hello, healthy!"});
});

app.get("/help", (req, res) => {
    res.status(200).json({msg: "Hello, needy!"});
});


if(ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("/{*any }", (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist' , 'index.html'));
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