const saveBtn = document.getElementById("save");
const editBtn = document.getElementById("edit");
const clearBtn = document.getElementById("clear");
const formSection = document.getElementById("formSection");
const displaySection = document.getElementById("displaySection");

// Load settings on popup open
window.addEventListener("load", () => {
  chrome.storage.local.get(["leetcodeUsername", "blockedSites"], (res) => {
    if (res.leetcodeUsername && res.blockedSites) {
      showDisplaySection(res.leetcodeUsername, res.blockedSites);
    } else {
      showFormSection();
    }
  });
});

function showFormSection() {
  formSection.style.display = "block";
  displaySection.classList.remove("active");
}

function showDisplaySection(username, sites) {
  document.getElementById("displayUsername").textContent = username;
  document.getElementById("displaySites").textContent = sites.join(", ");
  formSection.style.display = "none";
  displaySection.classList.add("active");
}

// Save button handler
saveBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const sites = document
    .getElementById("sites")
    .value
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (!username) {
    document.getElementById("status").textContent = "⚠️ Please enter username";
    return;
  }

  if (sites.length === 0) {
    document.getElementById("status").textContent = "⚠️ Please enter at least one site";
    return;
  }

  chrome.storage.local.set({
    leetcodeUsername: username,
    blockedSites: sites
  }, () => {
    document.getElementById("status").textContent = "✅ Saved successfully!";
    setTimeout(() => {
      showDisplaySection(username, sites);
    }, 500);
  });
});

// Edit button handler
editBtn.addEventListener("click", () => {
  chrome.storage.local.get(["leetcodeUsername", "blockedSites"], (res) => {
    document.getElementById("username").value = res.leetcodeUsername || "";
    document.getElementById("sites").value = (res.blockedSites || []).join(", ");
    document.getElementById("status").textContent = "";
    showFormSection();
  });
});

// Clear button handler
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all settings?")) {
    chrome.storage.local.remove(["leetcodeUsername", "blockedSites"], () => {
      document.getElementById("username").value = "";
      document.getElementById("sites").value = "";
      document.getElementById("status").textContent = "";
      showFormSection();
    });
  }
});
