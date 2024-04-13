import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env'});

const app = express();

app.get('/', (req, res) =>{
  res.status(200).send("Get all Data success!")
})

const PORT = process.env.PORT || 3222
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
