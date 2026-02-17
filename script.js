import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Login Page
window.loginAdmin = function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("loginError");

  signInWithEmailAndPassword(auth,email,password)
  .then(()=>{
    errorMsg.textContent = "";
    window.location.href="dashboard.html";
  })
  .catch((err)=>{
    errorMsg.textContent = "Login Failed: "+err.message;
  });
}

// 🔹 Registration Page
window.updatePlayers = function(){
  const mode = document.getElementById("mode").value;
  const div = document.getElementById("players");
  div.innerHTML = "";
  const count = mode==="solo"?1:mode==="duo"?2:4;
  for(let i=1;i<=count;i++){
    const input = document.createElement("input");
    input.placeholder = `Player ${i} Name`;
    input.id = `player${i}`;
    div.appendChild(input);
  }
}
updatePlayers();

window.registerTeam = async function(){
  const team = document.getElementById("teamName").value;
  const map = document.getElementById("map").value;
  const mode = document.getElementById("mode").value;

  let players = [];
  const count = mode==="solo"?1:mode==="duo"?2:4;
  for(let i=1;i<=count;i++){
    players.push(document.getElementById(`player${i}`).value);
  }

  await addDoc(collection(db,"teams"),{team, map, mode, players});
  document.getElementById("registerMsg").textContent = "Team Registered Successfully!";
}

// 🔹 Admin Dashboard Points
window.addPoints = async function(){
  const name = document.getElementById("playerName").value;
  const points = Number(document.getElementById("playerPoints").value);

  await addDoc(collection(db,"players"),{name, points});
}

// 🔹 Live Points Table
const pointsTable = document.getElementById("pointsTable");
if(pointsTable){
  const q = query(collection(db,"players"), orderBy("points","desc"));
  onSnapshot(q, snapshot=>{
    pointsTable.innerHTML="";
    let rank=1;
    snapshot.forEach(doc=>{
      const data = doc.data();
      const p = document.createElement("p");
      p.textContent = `${rank}. ${data.name} - ${data.points} Points`;
      pointsTable.appendChild(p);
      rank++;
    });
  });
}

// 🔹 Search Players
window.searchPlayers = function(){
  const filter = document.getElementById("searchPlayer").value.toLowerCase();
  const rows = pointsTable.getElementsByTagName("p");
  for(let i=0;i<rows.length;i++){
    const text = rows[i].textContent.toLowerCase();
    rows[i].style.display = text.includes(filter) ? "" : "none";
  }
}