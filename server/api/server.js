import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import stations from '../routes/stations.js';
import calculatePrice from '../routes/calculateprice.js';
import bookTicketRouter from '../routes/bookticket.js';
import enterStation from '../routes/enterStation.js';
import exitStationRouter from '../routes/exitStation.js';
const serverless = require("serverless-http");

const app = express();
app.use(cors());
app.use(express.json());

// const PORT = 5000;

connectDB();

app.use('/api', stations);

app.use('/api/tickets', calculatePrice)

app.use('/api/tickets', bookTicketRouter)

app.use('/api/tickets', enterStation)

app.use('/api/tickets', exitStationRouter)

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })

export const handler = serverless(app);