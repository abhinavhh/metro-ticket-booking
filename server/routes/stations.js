import express from 'express';
import Station from '../datas/stations.js'; // Assuming this is the correct path to your stations data
const router = express.Router();

router.get('/stations', async(req, res) => {

    try {
        // convert the stations object to an array
        const stations = Object.values(Station);
        res.status(200).json(stations);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stations', error: error.message });
    }
})
export default router;