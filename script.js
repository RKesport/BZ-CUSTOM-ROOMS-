import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebaseConfig.js"; // COPY SECTION

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Admin Login
window.loginAdmin = function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth,email,password)
  .then(()=>{ alert("Login Success"); })
  .catch(()=>{ alert("Login Failed"); });
}

// 🔹 Tournament Registration
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
  alert("Team Registered!");
}

// 🔹 Admin: Add / Update Points
window.addPoints = async function(){
  const name = document.getElementById("playerName").value;
  const points = Number(document.getElementById("playerPoints").value);

  await addDoc(collection(db,"players"),{name, points});
  alert("Points Added");
}

// 🔹 Live Points Table with Auto Ranking
const q = query(collection(db,"players"), orderBy("points","desc"));
onSnapshot(q, snapshot=>{
  const table = document.getElementById("pointsTable");
  if(!table) return;
  table.innerHTML="";
  let rank=1;
  snapshot.forEach(doc=>{
    const data = doc.data();
    const p = document.createElement("p");
    p.textContent = `${rank}. ${data.name} - ${data.points} Points`;
    table.appendChild(p);
    rank++;
  });
});