import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { exit } from 'process';

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
    },
    fromStation: {
        type: String,
        required: true,
    },
    toStation: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    bookingDate: {
        type: Date,
    },
    entryTime: {
        type: Date,
    },
    exitTime: {
        type: Date,
    },
    isValid: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'entered', 'exited', 'expired'],
        default: 'booked'
    }
});
export default mongoose.model('Ticket', ticketSchema);