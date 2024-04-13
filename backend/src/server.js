import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//Route files
import golfballs from './routes/golfball.js';

//Load env vars
dotenv.config({ path: './config/config.env'});

const app = express();

app.use('/api/golfballs', golfballs)
app.use(cors());



const PORT = process.env.PORT || 3222
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
