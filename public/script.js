const apiUrl = "https://myronblacklist.onrender.com";

async function fetchExcluded() {
    const response = await fetch(apiUrl + "/excluded");
    const data = await response.json();
    const list = document.getElementById("excludedList");
    list.innerHTML = "";

    data.excludedNicknames.forEach(nick => {
        const li = document.createElement("li");
        li.textContent = "Nick: " + nick;
        list.appendChild(li);
    });

    data.excludedUUIDs.forEach(uuid => {
        const li = document.createElement("li");
        li.textContent = "UUID: " + uuid;
        list.appendChild(li);
    });
}

async function addExcluded() {
    const token = document.getElementById("token").value;
    const nick = document.getElementById("nick").value;
    const uuid = document.getElementById("uuid").value;

    const response = await fetch(apiUrl + "/excluded/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nick, uuid })
    });

    const result = await response.json();
    alert(result.message || result.error);
    fetchExcluded();
}

async function removeExcluded() {
    const token = document.getElementById("token").value;
    const nick = document.getElementById("nick").value;
    const uuid = document.getElementById("uuid").value;

    const response = await fetch(apiUrl + "/excluded/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nick, uuid })
    });

    const result = await response.json();
    alert(result.message || result.error);
    fetchExcluded();
}

fetchExcluded();
