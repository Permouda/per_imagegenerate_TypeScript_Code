import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from "./mongodb/connect";
import postRoutes from "./routes/postRoutes";
import dalleRoutes from "./routes/dalleRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb'}));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);


app.get('/', async (req, res) => {
    res.send('hello world !');
})

const startServer = async() => {
    try {
        connectDB(process.env.MONGODB_URL as string);
        app.listen(8080, ()=> console.log('Server has started on port http://localhost:8080'));
    } catch (error) {
        console.log(error);
    }

}

startServer();