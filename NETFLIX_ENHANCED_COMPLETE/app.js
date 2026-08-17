// ======================================================
// NETFIX APP.JS - FULL STREAMING HOME EXPERIENCE
// ======================================================

const MOVIES = [
 {id:1,title:"Interstellar",genre:"Sci-Fi",year:2014,image:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"},
 {id:2,title:"Inception",genre:"Sci-Fi",year:2010,image:"https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"},
 {id:3,title:"The Dark Knight",genre:"Crime",year:2008,image:"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"},
 {id:4,title:"Top Gun: Maverick",genre:"Action",year:2022,image:"https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1iB4wTSA.jpg"},
 {id:5,title:"Oppenheimer",genre:"Drama",year:2023,image:"https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"},
 {id:6,title:"Dune: Part Two",genre:"Adventure",year:2024,image:"https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"},
 {id:7,title:"Avengers: Endgame",genre:"Action",year:2019,image:"https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"},
 {id:8,title:"Spider-Man: No Way Home",genre:"Action",year:2021,image:"https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"},
 {id:9,title:"Avatar: The Way of Water",genre:"Adventure",year:2022,image:"https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"},
 {id:10,title:"Barbie",genre:"Comedy",year:2023,image:"https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg"},
 {id:11,title:"John Wick: Chapter 4",genre:"Action",year:2023,image:"https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg"},
 {id:12,title:"Parasite",genre:"Thriller",year:2019,image:"https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"},
 {id:13,title:"Joker",genre:"Crime",year:2019,image:"https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"},
 {id:14,title:"Ford v Ferrari",genre:"Drama",year:2019,image:"https://image.tmdb.org/t/p/w500/6ApDtO7xaWAfPqB4cB6c5k0bX4T.jpg"},
 {id:15,title:"The Martian",genre:"Sci-Fi",year:2015,image:"https://image.tmdb.org/t/p/w500/5BHuvQ5pL7d8f7J6V8p6s5Vx5oV.jpg"},
 {id:16,title:"Mission: Impossible - Dead Reckoning",genre:"Action",year:2023,image:"https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg"},
 {id:17,title:"The Batman",genre:"Crime",year:2022,image:"https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"},
 {id:18,title:"Black Panther",genre:"Action",year:2018,image:"https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg"},
 {id:19,title:"Guardians of the Galaxy Vol. 3",genre:"Adventure",year:2023,image:"https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg"},
 {id:20,title:"A Quiet Place Part II",genre:"Horror",year:2021,image:"https://image.tmdb.org/t/p/w500/4q2hz2m8hubgvijz8Ez0OH7r2a.jpg"},
 {id:21,title:"The Shawshank Redemption",genre:"Drama",year:1994,image:"https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg"},
 {id:22,title:"The Godfather",genre:"Crime",year:1972,image:"https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"},
 {id:23,title:"Forrest Gump",genre:"Drama",year:1994,image:"https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg"},
 {id:24,title:"The Lord of the Rings: The Return of the King",genre:"Adventure",year:2003,image:"https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"},
 {id:25,title:"The Matrix",genre:"Sci-Fi",year:1999,image:"https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"},
 {id:26,title:"Gladiator",genre:"Action",year:2000,image:"https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUm7WJdJdR6H5W8fG.jpg"},
 {id:27,title:"Titanic",genre:"Romance",year:1997,image:"https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"},
 {id:28,title:"The Notebook",genre:"Romance",year:2004,image:"https://image.tmdb.org/t/p/w500/rNzQyW4f8B8c9g8QW7k8M2YJq9v.jpg"},
 {id:29,title:"La La Land",genre:"Romance",year:2016,image:"https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt3WlL.jpg"},
 {id:30,title:"A Star Is Born",genre:"Romance",year:2018,image:"https://image.tmdb.org/t/p/w500/wrFpXMNBRj2VvSnnx4hL2d3J6w.jpg"},
 {id:31,title:"The Hangover",genre:"Comedy",year:2009,image:"https://image.tmdb.org/t/p/w500/AcexKp7JYvX0Qxw8L0c5x6H9u2.jpg"},
 {id:32,title:"Superbad",genre:"Comedy",year:2007,image:"https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerZf3G.jpg"},
 {id:33,title:"Knives Out",genre:"Mystery",year:2019,image:"https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj9yQk2.jpg"},
 {id:34,title:"Glass Onion: A Knives Out Mystery",genre:"Mystery",year:2022,image:"https://image.tmdb.org/t/p/w500/vDGr1YdrlfbU1a78D9k8Z4dQh5v.jpg"},
 {id:35,title:"Everything Everywhere All at Once",genre:"Comedy",year:2022,image:"https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg"},
 {id:36,title:"Everything Everywhere All at Once",genre:"Drama",year:2022,image:"https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg"},
 {id:37,title:"The Hunger Games",genre:"Adventure",year:2012,image:"https://image.tmdb.org/t/p/w500/yXCbOiVDCxO71zI7cuwBRyW2A.jpg"},
 {id:38,title:"The Maze Runner",genre:"Sci-Fi",year:2014,image:"https://image.tmdb.org/t/p/w500/ode14q7WtDugFDp78fo9lCsmay.jpg"},
 {id:39,title:"Enola Holmes",genre:"Mystery",year:2020,image:"https://image.tmdb.org/t/p/w500/riYInlsq2kf1AWoGm80JQW5dM5.jpg"},
 {id:40,title:"The Gray Man",genre:"Action",year:2022,image:"https://image.tmdb.org/t/p/w500/8cXbitsS6dWQ5gfMTZdorpAAzEH.jpg"},
 {id:41,title:"Extraction 2",genre:"Action",year:2023,image:"https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg"},
 {id:42,title:"Red Notice",genre:"Action",year:2021,image:"https://image.tmdb.org/t/p/w500/wdE6ewaKZHr62bLqCn7A2DiGShc.jpg"},
 {id:43,title:"The Adam Project",genre:"Sci-Fi",year:2022,image:"https://image.tmdb.org/t/p/w500/wFjboE0aFZNbVOF05fzrka9Fqyx.jpg"},
 {id:44,title:"Glass",genre:"Thriller",year:2019,image:"https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg"},
 {id:45,title:"A Quiet Place",genre:"Horror",year:2018,image:"https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4N.jpg"},
 {id:46,title:"Bird Box",genre:"Thriller",year:2018,image:"https://image.tmdb.org/t/p/w500/rGfGfgL9pE7b3H8g8x5x8e8jQ.jpg"},
 {id:47,title:"Her",genre:"Romance",year:2013,image:"https://image.tmdb.org/t/p/w500/lEIaL12hSkqqe83kg3qN4F2j5m.jpg"},
 {id:48,title:"About Time",genre:"Romance",year:2013,image:"https://image.tmdb.org/t/p/w500/iR4b0YQf4wXj4s0tq5rWn3fJm.jpg"},
 {id:49,title:"The Pursuit of Happyness",genre:"Drama",year:2006,image:"https://image.tmdb.org/t/p/w500/lBYOKAMcxIvuk9s9s8Z7xY8R0.jpg"},
 {id:50,title:"12th Fail",genre:"Drama",year:2023,image:"https://image.tmdb.org/t/p/w500/7eKf3z5o9zvQ1d6H5y3yq7h8m.jpg"},
 {id:51,title:"Dangal",genre:"Drama",year:2016,image:"https://image.tmdb.org/t/p/w500/3t6QK2Y9hQm2m9x5g4t8n4s8.jpg"},
 {id:52,title:"RRR",genre:"Action",year:2022,image:"https://image.tmdb.org/t/p/w500/nEufeZlyA3Jr5qZ8m0m8s8W7.jpg"},
 {id:53,title:"Kantara",genre:"Drama",year:2022,image:"https://image.tmdb.org/t/p/w500/7J5q3r5Y3q6v8d9p1x2w3z4a5.jpg"},
 {id:54,title:"Jawan",genre:"Action",year:2023,image:"https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8k0l8m2n3q4r5.jpg"},
 {id:55,title:"Pathaan",genre:"Action",year:2023,image:"https://image.tmdb.org/t/p/w500/6F3sV0Y9fQm2q4x6z8.jpg"},
 {id:56,title:"Rocky Aur Rani Kii Prem Kahaani",genre:"Romance",year:2023,image:"https://image.tmdb.org/t/p/w500/5L6s8W9y0z1x2c3v4b5n6m7.jpg"},
 {id:57,title:"Zindagi Na Milegi Dobara",genre:"Adventure",year:2011,image:"https://image.tmdb.org/t/p/w500/1c0q6m7s8d9f0g1h2j3k4l5.jpg"},
 {id:58,title:"Yeh Jawaani Hai Deewani",genre:"Romance",year:2013,image:"https://image.tmdb.org/t/p/w500/2f4g6h8j0k1l3m5n7p9q.jpg"},
 {id:59,title:"Dil Chahta Hai",genre:"Drama",year:2001,image:"https://image.tmdb.org/t/p/w500/3q5w7e9r1t2y4u6i8o0p.jpg"},
 {id:60,title:"Wake Up Sid",genre:"Drama",year:2009,image:"https://image.tmdb.org/t/p/w500/4a6s8d0f2g3h5j7k9l1.jpg"}
];

// The first 30 are guaranteed to be visually strong posters. A fallback image
// keeps every card attractive if a remote poster is unavailable.
const FALLBACK_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=85";
MOVIES.forEach(m => { if (!m.image) m.image = FALLBACK_POSTER; });

const SHOWS = [
 {id:"s1",title:"Stranger Things",year:2016,genre:"Sci-Fi",image:"https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg"},
 {id:"s2",title:"Wednesday",year:2022,genre:"Mystery",image:"https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg"},
 {id:"s3",title:"Bridgerton",year:2020,genre:"Drama",image:"https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg"},
 {id:"s4",title:"Money Heist",year:2017,genre:"Crime",image:"https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg"},
 {id:"s5",title:"Squid Game",year:2021,genre:"Thriller",image:"https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg"},
 {id:"s6",title:"The Crown",year:2016,genre:"Drama",image:"https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8m6xkW.jpg"},
 {id:"s7",title:"Dark",year:2017,genre:"Sci-Fi",image:"https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg"},
 {id:"s8",title:"The Witcher",year:2019,genre:"Fantasy",image:"https://image.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiOQ6w6j8wY3F5.jpg"},
 {id:"s9",title:"The Queen's Gambit",year:2020,genre:"Drama",image:"https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg"},
 {id:"s10",title:"The Night Agent",year:2023,genre:"Thriller",image:"https://image.tmdb.org/t/p/w500/5L2wQk9M6m2c8s6k0d3f4g5h.jpg"}
];

const TOP_SEARCHES = [2,3,6,11,13,7,5,8,9,4];
const TOP10 = [3,2,6,5,11,7,8,1,13,4];

const HOME_SECTIONS = {
  "topPicksRow": [1,2,6,5,11,3,13,7,8,15],
  "newNetflixRow": [41,40,43,42,34,39,35,16,20,19],
  "familiarRow": [21,23,24,25,26,27,29,33,37,38],
  "dramaRow": [5,14,21,23,49,50,51,57,59,60],
  "hindiRow": [50,51,52,53,54,55,56,57,58,59],
  "excitingRow": [4,11,16,17,18,19,40,41,42,52],
  "romanticRow": [27,28,29,30,47,48,56,58,23,35],
  "onlyNetflixRow": [34,39,40,41,42,43,46,35,12,20],
  "emotionalRow": [5,21,23,27,30,35,49,50,51,59],
  "moviesRow": [1,2,3,4,5,6,7,8,9,10]
};

function movieByIds(ids) {
  return ids.map(id => MOVIES.find(m => m.id === id)).filter(Boolean);
}

function getStoredUser() {
  const saved = localStorage.getItem("netfixUser");
  if (!saved) return null;
  try { return JSON.parse(saved); } catch (e) { return null; }
}
function ensureProfiles(user) {
  if (!user) return null;
  const colors = ["#e50914","#046d8b","#5b2c8a","#1f7a3a","#b45309","#be185d"];
  if (!Array.isArray(user.profiles) || !user.profiles.length) {
    user.profiles = [{
      id: "profile_1",
      name: user.name || "User",
      avatar: (user.name || "U")[0].toUpperCase(),
      color: "#e50914",
      kids: false
    }];
  }
  user.profiles = user.profiles.map((p, i) => ({
    id: p.id || ("profile_" + (i + 1)),
    name: p.name || user.name || "User",
    avatar: ((p.avatar || p.name || "U")[0] || "U").toUpperCase(),
    color: p.color || colors[i % colors.length],
    kids: !!p.kids
  }));
  if (!user.activeProfileId || !user.profiles.some(p => p.id === user.activeProfileId)) {
    user.activeProfileId = user.profiles[0].id;
  }
  localStorage.setItem("netfixUser", JSON.stringify(user));
  return user;
}
function getActiveProfile() {
  const u = ensureProfiles(getStoredUser());
  return u ? (u.profiles.find(p => p.id === u.activeProfileId) || u.profiles[0]) : {id:"guest",name:"Guest",avatar:"G",color:"#e50914",kids:false};
}
function getUser() {
  const u = ensureProfiles(getStoredUser());
  if (!u) return {name:"Guest",email:"guest@netfix.com",plan:"Premium",profileId:"guest",profileAvatar:"G",profileColor:"#e50914"};
  const p = getActiveProfile();
  return {...u, name:p.name, profileId:p.id, profileAvatar:p.avatar, profileColor:p.color||"#e50914", kids:!!p.kids};
}
function profileKey(prefix){ return prefix+"_"+getUser().profileId; }

function updateNavbar() {
  const u=getUser();
  document.querySelectorAll("#navUser").forEach(e=>e.textContent=u.name);
  document.querySelectorAll("#navAvatar").forEach(e=>{
    e.textContent=(u.profileAvatar||"G").toUpperCase();
    if(u.profileColor) e.style.background = u.profileColor;
  });
  let raw=getStoredUser();
  if(raw) raw = ensureProfiles(raw);
  const profileMarkup = raw ? raw.profiles.map(p=>`<button class="profile-switch-item ${p.id===raw.activeProfileId?"selected":""}" onclick="switchHeaderProfile('${p.id}')"><span class="profile-switch-avatar" style="background:${p.color||'#e50914'}">${p.avatar}</span><span>${p.name}${p.kids?" (Kids)":""}</span>${p.id===raw.activeProfileId?"✓":""}</button>`).join("") : `<button class="profile-switch-item" onclick="location.href='profile.html'"><span class="profile-switch-avatar">G</span><span>Guest</span></button>`;
  ["profileSwitcherList","profilesHeaderList"].forEach(id=>{
    const profileList=document.getElementById(id);
    if(profileList) profileList.innerHTML=profileMarkup;
  });
  // Ensure Manage Profiles link exists in every profile menu
  document.querySelectorAll(".profile-switcher-menu").forEach(menu=>{
    if(!menu.querySelector("a.manage-profiles")){
      const a=document.createElement("a");
      a.className="manage-profiles";
      a.href="profile.html";
      a.textContent="Manage Profiles";
      menu.appendChild(a);
    }
  });
  setupNotification();
}

function switchHeaderProfile(id){
  const u=getStoredUser(); if(!u)return;
  u.activeProfileId=id; localStorage.setItem("netfixUser",JSON.stringify(u));
  location.reload();
}

function setupNotification(){
 const wrap=document.getElementById("notificationWrap"); if(!wrap)return;
 const btn=document.getElementById("notificationBtn"),panel=document.getElementById("notificationPanel");
 btn.onclick=e=>{e.stopPropagation();panel.classList.toggle("show");};
 document.addEventListener("click",()=>panel.classList.remove("show"),{once:true});
 const list=document.getElementById("notificationList");
 list.innerHTML=MOVIES.slice(0,5).map(m=>`<a href="movie-details.html?id=${m.id}"><b>🎬 ${m.title}</b><span>New title available to watch.</span></a>`).join("");
}

function getMyList(){return JSON.parse(localStorage.getItem(profileKey("netfixMyList"))||"[]");}
function saveMyList(list){localStorage.setItem(profileKey("netfixMyList"),JSON.stringify(list));}
function isInList(id){return getMyList().includes(Number(id));}
function toggleMyList(id){
 id=Number(id); let list=getMyList();
 list=list.includes(id)?list.filter(x=>x!==id):[...list,id];
 saveMyList(list); renderAllMovieLists();
}
function addFeatured(){toggleMyList(1);}

function getContinueWatching(){return JSON.parse(localStorage.getItem(profileKey("netfixContinue"))||"{}");}
function saveContinueWatching(d){localStorage.setItem(profileKey("netfixContinue"),JSON.stringify(d));}
function getWatchHistory(){return JSON.parse(localStorage.getItem(profileKey("netfixHistory"))||"[]");}
function saveWatchHistory(d){localStorage.setItem(profileKey("netfixHistory"),JSON.stringify(d));}
function recordWatchStart(id,progress=0,duration=0){
 id=Number(id); if(!MOVIES.find(m=>m.id===id))return;
 const d=getContinueWatching(); d[id]={id,progress,duration,updatedAt:Date.now()}; saveContinueWatching(d);
 saveWatchHistory([{id,watchedAt:Date.now()},...getWatchHistory().filter(x=>x.id!==id)].slice(0,20));
}
function getContinueMovies(){const d=getContinueWatching();return Object.values(d).sort((a,b)=>b.updatedAt-a.updatedAt).map(x=>MOVIES.find(m=>m.id===x.id)).filter(Boolean);}
function getHistoryMovies(){return getWatchHistory().sort((a,b)=>b.watchedAt-a.watchedAt).map(x=>MOVIES.find(m=>m.id===x.id)).filter(Boolean);}
function playMovie(id){
 if(typeof id==="string"){const m=MOVIES.find(x=>x.title.toLowerCase()===id.toLowerCase());id=m?m.id:id;}
 location.href="watch.html?id="+id;
}

function getRatings(){return JSON.parse(localStorage.getItem(profileKey("netfixRatings"))||"{}");}
function getMovieRating(id){return Number(getRatings()[Number(id)]||0);}

function shortDesc(movie){
  const d = {
    1:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    2:"A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    3:"When the menace known as the Joker wreaks havoc, Batman must accept one of the greatest psychological tests.",
    4:"After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
    5:"The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    6:"Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    7:"After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions.",
    8:"Peter Parker's secret identity is revealed to the entire world. Desperate for help, he turns to Doctor Strange.",
    9:"Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
    10:"Barbie suffers a crisis that leads her to question her world and her existence.",
  };
  return d[movie.id] || `${movie.title} (${movie.year}) • ${movie.genre}. Watch now on NETFIX.`;
}

function movieCard(movie){
  const added = isInList(movie.id);
  return `<article class="movie-card" data-id="${movie.id}">
    <a class="card-poster-link" href="movie-details.html?id=${movie.id}">
      <div class="card-poster">
        <img src="${movie.image}" alt="${movie.title}" onerror="this.src='${FALLBACK_POSTER}'">
        <div class="card-hover">
          <div class="card-hover-actions">
            <button class="ch-btn play" onclick="event.preventDefault();event.stopPropagation();playMovie(${movie.id})" title="Play">▶</button>
            <button class="ch-btn list" onclick="event.preventDefault();event.stopPropagation();toggleMyList(${movie.id});this.textContent=isInList(${movie.id})?'✓':'+'" title="My List">${added?"✓":"+"}</button>
            <span class="ch-btn info" title="More Info">ℹ</span>
          </div>
          <div class="card-hover-info">
            <h3>${movie.title}</h3>
            <p class="meta">${movie.year} • ${movie.genre}</p>
            <p class="desc">${shortDesc(movie)}</p>
          </div>
        </div>
      </div>
    </a>
    <div class="movie-info">
      <h3><a href="movie-details.html?id=${movie.id}">${movie.title}</a></h3>
      <p>${movie.year} • ${movie.genre}</p>
    </div>
  </article>`;
}

function renderMovies(id, movies){
  const c = document.getElementById(id);
  if(!c) return;
  if(!movies.length){
    c.innerHTML = `<p class="empty">Nothing to show yet.</p>`;
    return;
  }

  // Only convert home page rows into Netflix-style horizontal sliders.
  // Keep My List / Search / History as grids.
  const isHomeRow = c.classList.contains("movie-row") || 
                    ["topPicksRow","newNetflixRow","familiarRow","dramaRow","hindiRow",
                     "excitingRow","romanticRow","onlyNetflixRow","emotionalRow",
                     "continueRow","topSearchesRow","moviesRow"].includes(id);

  const parent = c.parentElement;
  if(isHomeRow && parent && !parent.classList.contains("row-slider")){
    const wrapper = document.createElement("div");
    wrapper.className = "row-slider";
    wrapper.innerHTML = `
      <button class="row-arrow left" aria-label="Previous">‹</button>
      <div class="movie-row" id="${id}">${movies.map(movieCard).join("")}</div>
      <button class="row-arrow right" aria-label="Next">›</button>`;
    parent.replaceChild(wrapper, c);
  } else {
    c.innerHTML = movies.map(movieCard).join("");
  }
}

function rankedMovieCard(movie, rank){
  // Exact Netflix look: hollow outlined number + poster overlapping it
  const added = isInList(movie.id);
  const img = movie.image || FALLBACK_POSTER;
  return `<article class="top10-card" data-id="${movie.id}">
    <span class="top10-number">${rank}</span>
    <a class="top10-poster-link" href="movie-details.html?id=${movie.id}">
      <div class="top10-poster-wrap">
        <img class="top10-poster" src="${img}" alt="${movie.title}" onerror="this.src='${FALLBACK_POSTER}'">
        <div class="card-hover top10-hover">
          <div class="card-hover-actions">
            <button class="ch-btn play" onclick="event.preventDefault();event.stopPropagation();playMovie(${movie.id})" title="Play">▶</button>
            <button class="ch-btn list" onclick="event.preventDefault();event.stopPropagation();toggleMyList(${movie.id});this.textContent=isInList(${movie.id})?'✓':'+'" title="My List">${added?"✓":"+"}</button>
            <span class="ch-btn info" title="More Info">ℹ</span>
          </div>
          <div class="card-hover-info">
            <h3>${movie.title}</h3>
            <p class="meta">${movie.year} • ${movie.genre}</p>
            <p class="desc">${shortDesc(movie)}</p>
          </div>
        </div>
      </div>
    </a>
  </article>`;
}

function renderTop10(){
  const c = document.getElementById("top10Row");
  if(!c) return;
  const list = (typeof TOP10 !== "undefined" && TOP10.length)
    ? movieByIds(TOP10)
    : MOVIES.slice(0,10);
  const parent = c.parentElement;
  if(parent && !parent.classList.contains("row-slider")){
    const wrapper = document.createElement("div");
    wrapper.className = "row-slider top10-slider";
    wrapper.innerHTML = `
      <button class="row-arrow left" aria-label="Previous">‹</button>
      <div class="top10-row" id="top10Row">${list.map((m,i)=>rankedMovieCard(m,i+1)).join("")}</div>
      <button class="row-arrow right" aria-label="Next">›</button>`;
    parent.replaceChild(wrapper, c);
  } else {
    c.innerHTML = list.map((m,i)=>rankedMovieCard(m,i+1)).join("");
  }
}

function initRowArrows(){
  document.querySelectorAll(".row-slider").forEach(slider=>{
    const row = slider.querySelector(".movie-row, .top10-row");
    const left = slider.querySelector(".row-arrow.left");
    const right = slider.querySelector(".row-arrow.right");
    if(!row || !left || !right) return;

    const scrollAmount = () => Math.max(row.clientWidth * 0.75, 280);

    left.onclick = () => row.scrollBy({left: -scrollAmount(), behavior:"smooth"});
    right.onclick = () => row.scrollBy({left: scrollAmount(), behavior:"smooth"});

    const updateArrows = () => {
      left.style.opacity = row.scrollLeft <= 8 ? "0.25" : "1";
      right.style.opacity = row.scrollLeft + row.clientWidth >= row.scrollWidth - 8 ? "0.25" : "1";
    };
    row.addEventListener("scroll", updateArrows);
    updateArrows();
  });
}

function renderAllMovieLists(){
  renderMovies("topSearchesRow", movieByIds(TOP_SEARCHES));
  renderTop10();
  Object.entries(HOME_SECTIONS).forEach(([id,ids])=>renderMovies(id, movieByIds(ids)));
  renderMovies("continueRow", getContinueMovies());
  renderMovies("historyRow", getHistoryMovies());
  renderMovies("myListGrid", MOVIES.filter(m=>getMyList().includes(m.id)));
  // delay slightly so DOM is ready
  setTimeout(initRowArrows, 50);
}

function applyTheme(){
 const t=localStorage.getItem("netfixTheme")||"dark";document.body.classList.toggle("light-theme",t==="light");
}
function toggleTheme(){const n=(localStorage.getItem("netfixTheme")||"dark")==="dark"?"light":"dark";localStorage.setItem("netfixTheme",n);applyTheme();return n;}

document.addEventListener("DOMContentLoaded",()=>{applyTheme();updateNavbar();renderAllMovieLists();});
