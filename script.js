function login() {
    document.getElementById("loading-screen").style.display = "flex";
    setTimeout(function(){
        window.location.href = "dashboard.html";
    }, 2000);
}

function updatePlayers() {
    let mode = document.getElementById("mode").value;
    let playersDiv = document.getElementById("players");
    playersDiv.innerHTML = "";

    let count = (mode === "solo") ? 1 : (mode === "duo") ? 2 : 4;

    for(let i=1; i<=count; i++){
        playersDiv.innerHTML += 
        `<input type="text" id="p${i}" placeholder="Player ${i} ID">`;
    }
}

updatePlayers();

function sendWhatsApp(){
    let team = document.getElementById("teamName").value;
    let map = document.getElementById("map").value;
    let mode = document.getElementById("mode").value;

    let message = `Team Name: ${team}%0AMap: ${map}%0AMode: ${mode}%0A`;

    let count = (mode === "solo") ? 1 : (mode === "duo") ? 2 : 4;

    for(let i=1; i<=count; i++){
        let player = document.getElementById("p"+i).value;
        message += `Player ${i}: ${player}%0A`;
    }

    window.open(`https://wa.me/923302281172?text=${message}`, "_blank");
}

/* ADMIN PROTECTION */
function adminCheck(){
    let password = prompt("Enter Admin Password:");
    if(password === "bzadmin123"){
        addTeam();
    } else {
        alert("Wrong Password!");
    }
}

/* ADD TEAM + AUTO RANKING + SAVE DATA */
let teams = JSON.parse(localStorage.getItem("teams")) || [];

function addTeam() {
    let team = document.getElementById("teamInput").value;
    let wins = parseInt(document.getElementById("winsInput").value);
    let points = parseInt(document.getElementById("pointsInput").value);

    teams.push({team, wins, points});
    teams.sort((a,b) => b.points - a.points);

    localStorage.setItem("teams", JSON.stringify(teams));
    displayTeams();
}

function displayTeams(){
    let table = document.getElementById("pointsTable");
    table.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Wins</th>
            <th>Points</th>
        </tr>
    `;

    teams.forEach((t, index) => {
        table.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${t.team}</td>
                <td>${t.wins}</td>
                <td>${t.points}</td>
            </tr>
        `;
    });
}

displayTeams();