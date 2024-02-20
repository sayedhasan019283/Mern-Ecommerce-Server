import express from 'express'; 
import colors from 'colors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan'
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js'
dotenv.config();

const app = express();


// middleware
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use('/api/v1/auth', authRouter);

app.get("/", (req, res) => {
    res.send({message: 'Welcome to e commerce server '})
})

connectDB()
    .then(() => {
        // Start your Express server here
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server is running on ${process.env.DEV} on ${PORT}`.bgCyan.white)
        })
    });





//  mongodb+srv://sayedhasan973:vGbC0GWbGv1rLkbQ@cluster0.2yzecua.mongodb.net/?retryWrites=true&w=majority