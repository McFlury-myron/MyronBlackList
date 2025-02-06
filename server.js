const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const configPath = path.join(__dirname, "config.json");
const excludedPath = path.join(__dirname, "excluded.json");

// 📌 Funkcja do pobierania hasła admina
function getAdminToken() {
    if (!fs.existsSync(configPath)) {
        return "default-token"; // Domyślny token (zmień go w `config.json`)
    }
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return config.adminToken;
}

// 📌 Pobieranie wykluczonych graczy
app.get("/excluded", (req, res) => {
    if (!fs.existsSync(excludedPath)) {
        return res.status(404).json({ error: "Brak pliku excluded.json" });
    }
    res.sendFile(excludedPath);
});

// 📌 Dodawanie wykluczonych graczy (z hasłem)
app.post("/excluded/add", (req, res) => {
    const { token, nick, uuid } = req.body;

    if (token !== getAdminToken()) {
        return res.status(403).json({ error: "Brak uprawnień!" });
    }

    let excludedData = { excludedNicknames: [], excludedUUIDs: [] };
    if (fs.existsSync(excludedPath)) {
        excludedData = JSON.parse(fs.readFileSync(excludedPath, "utf-8"));
    }

    if (nick && !excludedData.excludedNicknames.includes(nick)) {
        excludedData.excludedNicknames.push(nick);
    }
    if (uuid && !excludedData.excludedUUIDs.includes(uuid)) {
        excludedData.excludedUUIDs.push(uuid);
    }

    fs.writeFileSync(excludedPath, JSON.stringify(excludedData, null, 4));
    res.json({ message: "Dodano do wykluczonych!" });
});

// 📌 Usuwanie wykluczonych graczy (z hasłem)
app.post("/excluded/remove", (req, res) => {
    const { token, nick, uuid } = req.body;

    if (token !== getAdminToken()) {
        return res.status(403).json({ error: "Brak uprawnień!" });
    }

    let excludedData = { excludedNicknames: [], excludedUUIDs: [] };
    if (fs.existsSync(excludedPath)) {
        excludedData = JSON.parse(fs.readFileSync(excludedPath, "utf-8"));
    }

    if (nick) {
        excludedData.excludedNicknames = excludedData.excludedNicknames.filter(n => n !== nick);
    }
    if (uuid) {
        excludedData.excludedUUIDs = excludedData.excludedUUIDs.filter(u => u !== uuid);
    }

    fs.writeFileSync(excludedPath, JSON.stringify(excludedData, null, 4));
    res.json({ message: "Usunięto z wykluczonych!" });
});

// Uruchomienie serwera
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
