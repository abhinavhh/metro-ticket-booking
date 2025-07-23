import express from 'express';
import Stations from '../datas/stations.js';
const pricerouter = express.Router();

pricerouter.post('/calculate-price', (req, res) => {
    try{
        const { fromStation, toStation } = req.body;
        if (!fromStation || !toStation) {
            return res.status(400).json({ error: 'Both fromstation and tostation are required.' });
        }
        const from = Stations[fromStation];
        const to = Stations[toStation];
        if (!from || !to) {
            return res.status(404).json({ error: 'Invalid station names provided.' });
        }
        const price = Math.abs(to.price - from.price);
        res.status(200).json({ price});
    }
    catch (error) {
        console.error('Error calculating price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
export default pricerouter;