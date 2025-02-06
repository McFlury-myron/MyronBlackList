const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint do pobierania listy banów
app.get('/bans', (req, res) => {
    const filePath = path.join(__dirname, 'banlist.json'); // Plik z banami
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } else {
        res.status(404).json({ error: "banlist.json not found" });
    }
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
