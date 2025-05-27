require('dotenv').config(); // Untuk membaca .env
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema dengan coupleId
const messageSchema = new mongoose.Schema({
    name: String,
    message: String,
    coupleId: String, // tambahkan coupleId
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema, 'allTheme1'); // Collection: messages

// POST: Tambah pesan
app.post('/messages', async (req, res) => {
    const { name, message, coupleId } = req.body;

    if (!coupleId) {
        return res.status(400).json({ error: 'coupleId is required' });
    }

    const newMessage = new Message({ name, message, coupleId });

    try {
        await newMessage.save();
        res.json({ status: 'Message saved!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message.' });
    }
});

// GET: Ambil semua pesan berdasarkan coupleId
app.get('/messages', async (req, res) => {
    const { coupleId } = req.query;

    if (!coupleId) {
        return res.status(400).json({ error: 'coupleId is required as query parameter' });
    }

    try {
        const messages = await Message.find({ coupleId }).sort({ createdAt: -1 }); // terbaru dulu
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// Start server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
