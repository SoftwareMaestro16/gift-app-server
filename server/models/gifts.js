import mongoose from "mongoose";

const GiftsSchema = new mongoose.Schema({
    cake: {
        type: Number,
        default: 500 
    },
    green: {
        type: Number,
        default: 3000
    },
    blue: {
        type: Number,
        default: 5000
    },
    red: {
        type: Number,
        default: 10000
    },
    totalUsers: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Gifts = mongoose.model('Gifts', GiftsSchema);
export default Gifts;
