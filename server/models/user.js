import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    idUser: {
        type: Number,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        default: false 
    },
    giftCounts: {
        cake: {
            type: Number,
            default: 0 
        },
        green: {
            type: Number,
            default: 0
        },
        blue: {
            type: Number,
            default: 0
        },
        red: {
            type: Number,
            default: 0
        }
    },
    receivedGifts: {
        type: Number,
        default: 0
    },
    placeLeaderboard: {
        type: Number,
        default: 100
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
export default User;
