const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const excludedPath = path.join(__dirname, "excluded.json");

// 📌 Funkcja do wczytywania danych z excluded.json
function getExcludedData() {
    if (!fs.existsSync(excludedPath)) {
        return { excludedNicknames: [], excludedUUIDs: [] };
    }
    return JSON.parse(fs.readFileSync(excludedPath, "utf-8"));
}

// 📌 Pobieranie listy wykluczonych graczy
app.get("/excluded", (req, res) => {
    res.json(getExcludedData());
});

// 📌 Dodawanie wykluczonych nicków i UUID-ów
app.post("/excluded/add", (req, res) => {
    const { nick, uuid } = req.body;
    if (!nick && !uuid) {
        return res.status(400).json({ error: "Brak nicka lub UUID" });
    }

    let excludedData = getExcludedData();

    if (nick && !excludedData.excludedNicknames.includes(nick)) {
        excludedData.excludedNicknames.push(nick);
    }
    if (uuid && !excludedData.excludedUUIDs.includes(uuid)) {
        excludedData.excludedUUIDs.push(uuid);
    }

    fs.writeFileSync(excludedPath, JSON.stringify(excludedData, null, 4));
    res.json({ message: "Dodano do wykluczonych!", data: excludedData });
});

// 📌 Usuwanie wykluczonych nicków i UUID-ów
app.post("/excluded/remove", (req, res) => {
    const { nick, uuid } = req.body;
    if (!nick && !uuid) {
        return res.status(400).json({ error: "Brak nicka lub UUID" });
    }

    let excludedData = getExcludedData();

    if (nick) {
        excludedData.excludedNicknames = excludedData.excludedNicknames.filter(n => n !== nick);
    }
    if (uuid) {
        excludedData.excludedUUIDs = excludedData.excludedUUIDs.filter(u => u !== uuid);
    }

    fs.writeFileSync(excludedPath, JSON.stringify(excludedData, null, 4));
    res.json({ message: "Usunięto z wykluczonych!", data: excludedData });
});

// Uruchomienie serwera
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
