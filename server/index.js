import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoute from './routes/users.js';
import pinRoute from './routes/pins.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use(cors());

const PORT = process.env.PORT;
const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;

// Connect MongoDB
mongoose.connect(MONGODB_CONNECTION)
    .then(() => console.log('\x1b[42m%s\x1b[0m', "[SUCCESS] MongoDB is connect!"))
    .catch((err) => console.log('\x1b[41m%s\x1b[0m', "[FAILED] Connection to Mongo DB"));

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));




