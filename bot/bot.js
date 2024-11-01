require('dotenv').config(); 
const { Bot, InlineKeyboard } = require('grammy');
const { InputFile } = require("grammy/types");
const express = require('express');

const bot = new Bot(process.env.BOT_API_KEY);
const app = express();
app.use(express.json());

bot.command("start", async (ctx) => {
    const photoPath = "./images/GiftApp.jpg";
    const messageText = "🎁 Here you can buy and send gifts to your friends.";
    const webAppUrl = "https://gift-app-client.vercel.app/"; 

    const keyboard = new InlineKeyboard().webApp("Open WebApp", webAppUrl);
  
    await ctx.replyWithPhoto(new InputFile(photoPath), {
      caption: messageText,
      reply_markup: keyboard,
    });
});

// bot.command("buy", async (ctx) => {
//     const nameOfGift = "Test";
//     const messageText = `✅ You have purchased gift of *${nameOfGift}*.`; 
//     const webAppUrl = "https://gift-app-client.vercel.app/gifts"; 

//     const keyboard = new InlineKeyboard().webApp("Open Gifts", webAppUrl);
  
//     await ctx.reply(messageText.replace('.', '\\.'), { 
//         reply_markup: keyboard,
//         parse_mode: "MarkdownV2"
//     });
// });

// bot.command("sent", async (ctx) => {
//     const nameOfRecipient = "Alice";
//     const nameOfGift = "Test";
//     const messageText = `👌 *${nameOfRecipient}* received your gift of *${nameOfGift}*.`; 
//     const webAppUrl = "https://gift-app-client.vercel.app/"; 

//     const keyboard = new InlineKeyboard().webApp("Open App", webAppUrl);
  
//     await ctx.reply(messageText.replace('.', '\\.'), { 
//         reply_markup: keyboard,
//         parse_mode: "MarkdownV2"
//     });
// });

// bot.command("received", async (ctx) => {
//     const nameOfSender = "Alice";
//     const nameOfGift = "Test";
//     const messageText = `⚡️ *${nameOfSender}* has given you the gift of *${nameOfGift}*.`; 
//     const webAppUrl = "https://gift-app-client.vercel.app/profile"; 

//     const keyboard = new InlineKeyboard().webApp("View Gift", webAppUrl);
  
//     await ctx.reply(messageText.replace('.', '\\.'), {
//         reply_markup: keyboard,
//         parse_mode: "MarkdownV2"
//     });
// });

async function buyNotification(userId, giftName) {
    const webAppUrl = "https://gift-app-client.vercel.app/gifts"; 
    const messageText = `✅ You have purchased a gift of *${giftName}*.`; 
    const keyboard = new InlineKeyboard().webApp("Open Gifts", webAppUrl);

    try {
        await bot.api.sendMessage(userId, messageText.replace('.', '\\.'), {
            parse_mode: "MarkdownV2",
            reply_markup: keyboard
        });
    } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
    }
}

async function sentNotification(userId, nameOfRecipient, giftName) {
    const messageText = `👌 *${nameOfRecipient}* received your gift of *${giftName}*.`; 
    const webAppUrl = "https://gift-app-client.vercel.app/"; 
    const keyboard = new InlineKeyboard().webApp("Open App", webAppUrl);
  
    try {
        await bot.api.sendMessage(userId, messageText.replace('.', '\\.'), {
            parse_mode: "MarkdownV2",
            reply_markup: keyboard
        });
    } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
    }
}

async function receivedNotification(userId, nameOfSender, giftName) {
    const messageText = `⚡️ *${nameOfSender}* has given you the gift of *${giftName}*.`; 
    const webAppUrl = "https://gift-app-client.vercel.app/profile"; 
    const keyboard = new InlineKeyboard().webApp("View Gift", webAppUrl);

    try {
        await bot.api.sendMessage(userId, messageText.replace('.', '\\.'), {
            parse_mode: "MarkdownV2",
            reply_markup: keyboard
        });
    } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
    }
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/notify-gift-purchase', async (req, res) => {
    const { userId, giftName } = req.body;
    try {
        await buyNotification(userId, giftName);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending purchase notification:', error);
        res.status(500).json({ success: false });
    }
});

function startBot() {
    bot.start();
    app.listen(3333, () => console.log('Bot notification server running on port 3333'));
    console.log("bot started.");
}
  
startBot();