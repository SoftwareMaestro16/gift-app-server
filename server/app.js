import express from "express";
import cors from "cors";
import fs from "fs";
import https from "https";
import mongoose from "mongoose";
import User from './models/user.js';
import Gifts from "./models/gifts.js";
import { getInvoice, checkInvoiceStatus } from "./createInvoice/invoice.js";

async function initializeGifts() {
    try {
        const existingGifts = await Gifts.findOne();
        
        if (!existingGifts) {
            const newGifts = new Gifts({
                cake: 500,
                green: 3000,
                blue: 5000,
                red: 10000,
                totalUsers: 0
            }); 
            
            await newGifts.save();
            console.log("Gifts initialized with default values.");
        } else {
            console.log("Gifts already initialized.");
        }
    } catch (error) {
        console.error('Error initializing gifts:', error);
    }
}

mongoose.connect('mongodb+srv://softwaremaestro:lovecoding@cluster0.yokse.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'), await initializeGifts())
    .catch(err => console.error('Error connecting to MongoDB:', err)); 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const { id, username, first_name, is_premium } = req.body;
    console.log("Received user data:", req.body);

    try {
        if (!id || !username || !first_name) {
            return res.status(400).json({ error: 'Required user data missing.' });
        }

        const existingUser = await User.findOne({ idUser: id });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(200).json({ message: 'User already exists', user: existingUser });
        }

        const newUser = new User({
            idUser: parseInt(id, 10),
            userName: username,
            firstName: first_name,
            isPremium: is_premium,
            giftCounts: {
                cake: 0,
                green: 0,
                blue: 0,
                red: 0
            },
            receivedGifts: 0,
            placeLeaderboard: 0
        });

        await newUser.save();
        console.log("New user added to database:", newUser);
        
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/gifts-info', async (req, res) => {
    try {
        const giftsInfo = await Gifts.findOne();
        res.status(200).json({
            cakeQuantity: giftsInfo.cake,
            greenQuantity: giftsInfo.green,
            blueQuantity: giftsInfo.blue,
            redQuantity: giftsInfo.red
        });
    } catch (error) {
        console.error('Ошибка при получении информации о подарках:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении информации о подарках' });
    }
});


app.get('/profile/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({ idUser: userId });
        if (user) {
            res.json({
                first_name: user.firstName,
                is_premium: user.isPremium,
                received_gifts: user.receivedGifts,
                place_leaderboard: user.placeLeaderboard
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/create-invoice-gift', async (req, res) => {
    const { userId, amount, asset } = req.body; 
    try {
        const invoice = await getInvoice(amount, asset);
        
        res.json({ miniAppPayUrl: invoice.miniAppPayUrl, invoiceId: invoice.id });
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ error: 'Failed to generate invoice' });
    }
});

app.get('/invoice-status/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;
    const userId = req.query.userId; 

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const invoice = await checkInvoiceStatus(invoiceId);
        
        if (invoice === 'paid') {
            console.log('Invoice paid on backend');

            await User.updateOne({ idUser: userId }, { $inc: { "giftCounts.cake": 1, receivedGifts: 1 } });
            await Gifts.updateOne({}, { $inc: { cake: -1 } });
            
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    } catch (error) {
        console.error('Error checking invoice status:', error);
        res.status(500).json({ error: 'Failed to check invoice status' });
    }
});

const options = {
    key: fs.readFileSync('./certificates/server.key'),
    cert: fs.readFileSync('./certificates/server.cert'),
};

const port = 4444;
https.createServer(options, app).listen(port, () => {
    console.log(`Server is running at https://192.168.100.193:${port}`);
});
