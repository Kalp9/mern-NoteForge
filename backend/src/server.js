import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import noteRoutes from './routes/noteRoutes.js'; 
import { connectDB } from './config/db.js';

import rateLimitMiddleware from './Middleware/rateLimiter.js';

connectDB();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
//app.use(rateLimit);
app.use(rateLimitMiddleware); // Apply rate limiting middleware to all routes
// Enable CORS for all routes and origin your frotned url
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
   
}));


app.use('/notes', noteRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});