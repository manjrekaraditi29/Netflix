// ======================================================
// NETFIX PROFILE PAGE - Multi profile + features
// ======================================================

const AVATAR_COLORS = ["#e50914", "#046d8b", "#5b2c8a", "#1f7a3a", "#b45309", "#be185d"];

function getStoredUserForProfile() {
  const raw = localStorage.getItem("netfixUser");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function saveUser(user) {
  localStorage.setItem("netfixUser", JSON.stringify(user));
}

function ensureProfiles(user) {
  if (!user) return null;
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
    name: p.name || "User",
    avatar: (p.avatar || (p.name || "U")[0] || "U").toString().toUpperCase().slice(0, 1),
    color: p.color || AVATAR_COLORS[i % AVATAR_COLORS.length],
    kids: !!p.kids
  }));
  if (!user.activeProfileId || !user.profiles.some(p => p.id === user.activeProfileId)) {
    user.activeProfileId = user.profiles[0].id;
  }
  saveUser(user);
  return user;
}

function getActiveProfile(user) {
  return user.profiles.find(p => p.id === user.activeProfileId) || user.profiles[0];
}

function profileKeyLocal(prefix, profileId) {
  return prefix + "_" + profileId;
}

function loadProfilePage() {
  let user = getStoredUserForProfile();
  if (!user) {
    // demo guest so page still looks good
    user = {
      name: "Guest",
      email: "guest@netfix.com",
      plan: "Premium",
      profiles: [{ id: "profile_1", name: "Guest", avatar: "G", color: "#e50914", kids: false }],
      activeProfileId: "profile_1"
    };
    saveUser(user);
  }
  ensureProfiles(user);
  const profile = getActiveProfile(user);

  // Hero
  const av = document.getElementById("profileAvatar");
  if (av) {
    av.textContent = profile.avatar;
    av.style.background = profile.color || "#e50914";
  }
  setText("profileName", profile.name);
  setText("profileEmail", user.email || "guest@netfix.com");
  setText("profilePlan", user.plan || "Premium");
  setText("profilePlanBadge", user.plan || "Premium");

  const kidsBadge = document.getElementById("kidsBadge");
  if (kidsBadge) kidsBadge.style.display = profile.kids ? "inline-flex" : "none";

  // Form
  const nameInput = document.getElementById("profileNameInput");
  const emailInput = document.getElementById("profileEmailInput");
  if (nameInput) nameInput.value = profile.name;
  if (emailInput) emailInput.value = user.email || "";

  const kidsToggle = document.getElementById("kidsToggle");
  if (kidsToggle) kidsToggle.checked = !!profile.kids;

  // Color dots
  document.querySelectorAll(".color-dot").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.color === (profile.color || "#e50914"));
  });

  // Stats
  const listCount = JSON.parse(localStorage.getItem(profileKeyLocal("netfixMyList", profile.id)) || "[]").length;
  const histCount = JSON.parse(localStorage.getItem(profileKeyLocal("netfixHistory", profile.id)) || "[]").length;
  setText("statList", listCount);
  setText("statHistory", histCount);
  setText("statProfiles", user.profiles.length);

  // Plan description
  const planDesc = {
    Basic: "Good video quality • 1 screen • Mobile + tablet",
    Standard: "Full HD • 2 screens • All devices",
    Premium: "4K + HDR • 4 screens • Unlimited downloads"
  };
  setText("planDesc", planDesc[user.plan] || planDesc.Premium);

  // Theme
  const theme = localStorage.getItem("netfixTheme") || "dark";
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.checked = theme === "light";
  document.body.classList.toggle("light-theme", theme === "light");

  // Prefs
  const prefs = JSON.parse(localStorage.getItem("netfixPrefs") || "{}");
  setCheck("prefAutoplay", prefs.autoplay !== false);
  setCheck("prefPreview", prefs.preview !== false);
  setCheck("prefData", !!prefs.dataSaver);
  setCheck("prefSkip", prefs.skipIntro !== false);

  const lang = localStorage.getItem("netfixLang") || "en";
  const maturity = localStorage.getItem("netfixMaturity") || "all";
  const langSelect = document.getElementById("langSelect");
  const matSelect = document.getElementById("maturitySelect");
  if (langSelect) langSelect.value = lang;
  if (matSelect) matSelect.value = maturity;

  renderWhoGrid(user);
  renderProfilesList(user);
  if (typeof updateNavbar === "function") updateNavbar();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setCheck(id, value) {
  const el = document.getElementById(id);
  if (el) el.checked = !!value;
}

function renderWhoGrid(user) {
  const grid = document.getElementById("whoGrid");
  if (!grid) return;

  grid.innerHTML = user.profiles.map(p => `
    <div class="who-card ${p.id === user.activeProfileId ? "active" : ""}" data-id="${p.id}">
      <button class="who-avatar" style="background:${p.color || "#e50914"}" onclick="switchProfile('${p.id}')">
        ${p.avatar}
        ${p.kids ? '<span class="kids-tag">KIDS</span>' : ""}
      </button>
      <p class="who-name">${p.name}</p>
      <div class="who-card-actions">
        <button class="mini-btn" onclick="event.stopPropagation();openEditProfile('${p.id}')" title="Edit">✎</button>
        ${user.profiles.length > 1 ? `<button class="mini-btn danger" onclick="event.stopPropagation();deleteProfile('${p.id}')" title="Delete">×</button>` : ""}
      </div>
    </div>
  `).join("") + (user.profiles.length < 5 ? `
    <div class="who-card add-card">
      <button class="who-avatar add-avatar" id="whoAddBtn">＋</button>
      <p class="who-name">Add Profile</p>
    </div>
  ` : "");

  document.getElementById("whoAddBtn")?.addEventListener("click", openAddProfile);
}

function renderProfilesList(user) {
  // kept for compatibility if any old list exists
  const container = document.getElementById("profilesList");
  if (!container) return;
  container.innerHTML = user.profiles.map(p => `
    <div class="profile-choice ${p.id === user.activeProfileId ? "selected" : ""}">
      <button class="profile-choice-main" onclick="switchProfile('${p.id}')">
        <span class="profile-choice-avatar" style="background:${p.color || "#e50914"}">${p.avatar}</span>
        <span>${p.name}${p.kids ? " (Kids)" : ""}</span>
      </button>
      ${user.profiles.length > 1 ? `<button class="profile-delete" onclick="deleteProfile('${p.id}')">×</button>` : ""}
    </div>
  `).join("");
}

function switchProfile(id) {
  const user = ensureProfiles(getStoredUserForProfile());
  if (!user) return;
  user.activeProfileId = id;
  saveUser(user);
  loadProfilePage();
}

function deleteProfile(id) {
  const user = ensureProfiles(getStoredUserForProfile());
  if (!user || user.profiles.length <= 1) return alert("At least one profile is required.");
  if (!confirm("Delete this profile? My List and history for this profile stay in the browser.")) return;
  user.profiles = user.profiles.filter(p => p.id !== id);
  if (user.activeProfileId === id) user.activeProfileId = user.profiles[0].id;
  saveUser(user);
  loadProfilePage();
}

// Modal
let editingId = null;

function openAddProfile() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "Add Profile";
  document.getElementById("modalName").value = "";
  document.getElementById("modalKids").checked = false;
  document.getElementById("profileModal").style.display = "flex";
  document.getElementById("modalName").focus();
}

function openEditProfile(id) {
  const user = ensureProfiles(getStoredUserForProfile());
  const p = user.profiles.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById("modalTitle").textContent = "Edit Profile";
  document.getElementById("modalName").value = p.name;
  document.getElementById("modalKids").checked = !!p.kids;
  document.getElementById("profileModal").style.display = "flex";
  document.getElementById("modalName").focus();
}

function closeModal() {
  document.getElementById("profileModal").style.display = "none";
  editingId = null;
}

function saveModalProfile() {
  const name = document.getElementById("modalName").value.trim();
  if (name.length < 1) return alert("Please enter a name.");
  const kids = document.getElementById("modalKids").checked;
  const user = ensureProfiles(getStoredUserForProfile());

  if (editingId) {
    const p = user.profiles.find(x => x.id === editingId);
    if (p) {
      p.name = name.slice(0, 20);
      p.avatar = name[0].toUpperCase();
      p.kids = kids;
    }
  } else {
    if (user.profiles.length >= 5) return alert("Maximum 5 profiles allowed.");
    const id = "profile_" + Date.now();
    user.profiles.push({
      id,
      name: name.slice(0, 20),
      avatar: name[0].toUpperCase(),
      color: AVATAR_COLORS[user.profiles.length % AVATAR_COLORS.length],
      kids
    });
  }
  saveUser(user);
  closeModal();
  loadProfilePage();
}

// Save active profile from form
function saveActiveProfile() {
  const user = ensureProfiles(getStoredUserForProfile());
  if (!user) return;
  const profile = getActiveProfile(user);
  const name = document.getElementById("profileNameInput").value.trim();
  if (name.length < 1) return alert("Name cannot be empty.");
  profile.name = name.slice(0, 20);
  profile.avatar = name[0].toUpperCase();
  profile.kids = document.getElementById("kidsToggle")?.checked || false;

  const selectedColor = document.querySelector(".color-dot.selected");
  if (selectedColor) profile.color = selectedColor.dataset.color;

  // also update root name if first profile
  if (user.profiles[0].id === profile.id) user.name = profile.name;

  saveUser(user);
  alert("Profile saved!");
  loadProfilePage();
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfilePage();

  document.getElementById("saveProfile")?.addEventListener("click", saveActiveProfile);
  document.getElementById("addProfileBtn")?.addEventListener("click", openAddProfile);
  document.getElementById("modalCancel")?.addEventListener("click", closeModal);
  document.getElementById("modalSave")?.addEventListener("click", saveModalProfile);
  document.getElementById("profileModal")?.addEventListener("click", e => {
    if (e.target.id === "profileModal") closeModal();
  });

  // Color pick
  document.getElementById("colorRow")?.addEventListener("click", e => {
    const btn = e.target.closest(".color-dot");
    if (!btn) return;
    document.querySelectorAll(".color-dot").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    const av = document.getElementById("profileAvatar");
    if (av) av.style.background = btn.dataset.color;
  });

  // Theme
  document.getElementById("themeToggle")?.addEventListener("change", e => {
    const theme = e.target.checked ? "light" : "dark";
    localStorage.setItem("netfixTheme", theme);
    document.body.classList.toggle("light-theme", theme === "light");
  });

  // Prefs
  ["prefAutoplay", "prefPreview", "prefData", "prefSkip"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", () => {
      const prefs = {
        autoplay: document.getElementById("prefAutoplay")?.checked,
        preview: document.getElementById("prefPreview")?.checked,
        dataSaver: document.getElementById("prefData")?.checked,
        skipIntro: document.getElementById("prefSkip")?.checked
      };
      localStorage.setItem("netfixPrefs", JSON.stringify(prefs));
    });
  });

  document.getElementById("langSelect")?.addEventListener("change", e => {
    localStorage.setItem("netflixLang", e.target.value);
  });
  document.getElementById("maturitySelect")?.addEventListener("change", e => {
    localStorage.setItem("netflixMaturity", e.target.value);
  });

  // Plan change
  document.getElementById("changePlan")?.addEventListener("click", () => {
    const user = ensureProfiles(getStoredUserForProfile());
    if (!user) return;
    const plans = ["Basic", "Standard", "Premium"];
    const next = plans[(plans.indexOf(user.plan || "Premium") + 1) % plans.length];
    user.plan = next;
    saveUser(user);
    loadProfilePage();
    alert("Plan changed to " + next);
  });

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    if (!confirm("Sign out from this browser?")) return;
    localStorage.removeItem("netflixLoggedIn");
    localStorage.removeItem("netflixLastLogin");
    window.location.href = "index.html";
  });
});
