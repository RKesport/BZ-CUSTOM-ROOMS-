function openAdmin(){
    let password = prompt("Enter Admin Password");

    if(password === "bzadmin123"){
        window.location.href = "dashboard.html";
    } else {
        alert("Wrong Password");
    }
}

function addPoints(){
    let name = document.getElementById("playerName").value;
    let points = document.getElementById("playerPoints").value;

    if(name === "" || points === ""){
        alert("Fill all fields");
        return;
    }

    let playersList = document.getElementById("playersList");

    let div = document.createElement("div");
    div.innerHTML = "<strong>" + name + "</strong> - " + points + " Points";
    div.style.marginBottom = "10px";

    playersList.appendChild(div);

    document.getElementById("playerName").value = "";
    document.getElementById("playerPoints").value = "";
}