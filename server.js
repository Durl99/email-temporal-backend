const express = require('express');
const NodeCache = require('node-cache');

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutos en segundos

app.use(express.json());

app.get('/generate-email', (req, res) => {
    const email = generateTempEmail();
    cache.set(email, { createdAt: Date.now() });
    res.json({ email });
});

app.get('/get-email/:email', (req, res) => {
    const email = req.params.email;
    const data = cache.get(email);
    if (data) {
        res.json({ email, data });
    } else {
        res.status(404).json({ message: 'Email expired or not found' });
    }
});

function generateTempEmail() {
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${randomString}@tempmail.com`;
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
