async function checkBan() {
    const input = document.getElementById("searchInput").value.trim();
    const resultElement = document.getElementById("result");

    if (!input) {
        resultElement.innerHTML = "⚠️ Wpisz IP lub UUID!";
        return;
    }

    try {
        const response = await fetch('/bans');
        const data = await response.json();

        if (data.bannedIPs.includes(input) || data.bannedUUIDs.includes(input)) {
            resultElement.innerHTML = "❌ Ten użytkownik jest zbanowany!";
        } else {
            resultElement.innerHTML = "✅ Nie ma bana!";
        }
    } catch (error) {
        resultElement.innerHTML = "❌ Błąd połączenia z serwerem.";
        console.error(error);
    }
}
