import express from 'express';
import Stations from '../datas/stations.js';
import { v4 as uuid } from 'uuid';
import Ticket from '../models/tickets.js'
const bookTicketRouter = express.Router();

bookTicketRouter.post('/book', async(req, res) => {

    try {
        const { fromStation, toStation } = req.body;
        if (!fromStation || !toStation) {
            return res.status(400).json({ error: 'Both fromStation and toStation are required.' });
        }
        // Here you would typically handle the booking logic, such as saving the ticket to a database.
        const from = Stations[fromStation];
        const to = Stations[toStation];
        const price = Math.abs( to.price - from.price);
        if (!from || !to) {
            return res.status(404).json({ error: 'Invalid station names provided.' });
        }
        // Simulate ticket booking logic
        const bookingDate = new Date();
        const isValid = new Date(bookingDate.getTime() + 6 * 60 * 60 * 1000); // Ticket valid for 6 hours
        const ticket = new Ticket({
            ticketId: uuid(),
            fromStation,
            toStation,
            price,
            bookingDate, // This would be set when the user exits
            isValid
        })
        await ticket.save();
        
        res.status(201).json(ticket);
    } catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
export default bookTicketRouter;