import express, { Router } from 'express';
import Ticket from '../models/tickets.js';
const enterStation = express.Router();

enterStation.post('/enter-station', async (req, res) => {
    try {

        const {ticketId, stationName } = req.body;
        const now = new Date();
        const ticket = await Ticket.findOne({ticketId});
        if(!ticket){
            return res.status(400).json({error: "Invalid Ticket"});
        }
        if(ticket.fromStation !== stationName) {
           return res.status(400).json({error: "Invalid Station Name"});

        }
        if(ticket.isValid < now) {
            ticket.status = 'expired';
            await ticket.save();
            return res.status(400).json({error: "Ticket has expired"});
        }
        if(ticket.status !== 'entered' && ticket.status !== 'exited' && ticket.status == 'booked' && ticket.status !== 'expired') {
            ticket.entryTime = new Date();
            ticket.status = 'entered';
            await ticket.save();
            return res.status(200).json({message: "Entry success", ticket});
        }
        else{
            return res.status(400).json({error: "Alread entered at station"});
        }
    }
    catch (err) {
        console.log("Error in entering", err);
        return res.status(400).json({error: "Failed to enter"});
    }
})
export default enterStation;