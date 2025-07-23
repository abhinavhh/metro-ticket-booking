import express from 'express';
import Ticket from '../models/tickets.js';
const exitStationRouter = express.Router();

exitStationRouter.post('/exit-station', async (req, res) => {
    try{
        const { ticketId, stationName } = req.body;
        const now = new Date();
        const ticket = await Ticket.findOne({ ticketId });
        if (!ticket) {
            return res.status(400).json({ error: "Invalid Ticket" });
        }
        if (ticket.toStation !== stationName) {
            return res.status(400).json({ error: "Invalid Station Name" });
        }
        if (ticket.isValid < now) {
            return res.status(400).json({ error: "Ticket has expired" });
        }
        if (ticket.exitTime == null) {
            ticket.exitTime = now;
            ticket.bookingDate = new Date(); // Update booking date to current time
            ticket.isValid = new Date(now.getTime() + 6 * 60 * 60 * 1000); // Extend validity for another 6 hours
            await ticket.save();
            return res.status(200).json({ message: "Exit success", ticket });
        } else {
            return res.status(400).json({ error: "Already exited from station" });
        }
    }
    catch (err) {
        console.log("Error in exiting", err);
        return res.status(400).json({ error: "Failed to exit" });
    }
})
export default exitStationRouter;