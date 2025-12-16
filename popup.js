const saveBtn = document.getElementById("save");
const clearBtn = document.getElementById("clear");
const addSiteBtn = document.getElementById("addSiteBtn");
const popularSitesSelect = document.getElementById("popularSites");
const sitesTextarea = document.getElementById("sites");
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
  
  // Setup dropdown add button listener
  if (addSiteBtn) {
    addSiteBtn.addEventListener("click", addPopularSite);
  }
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

// Add popular site to textarea
function addPopularSite() {
  if (!popularSitesSelect || !sitesTextarea) return;
  
  const selectedSite = popularSitesSelect.value;
  
  if (!selectedSite) return;

  try {
    const textareaValue = String(sitesTextarea.value || "").trim();
    const currentSites = textareaValue.length > 0 
      ? textareaValue.split(",").map(s => s.trim())
      : [];

    // Avoid duplicates
    if (!currentSites.includes(selectedSite)) {
      currentSites.push(selectedSite);
      sitesTextarea.value = currentSites.join(", ");
    }

    // Reset dropdown
    popularSitesSelect.value = "";
  } catch (error) {
    console.error("Error adding popular site:", error);
  }
}

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
  try {
    const username = document.getElementById("username").value.trim();
    
    if (!username) {
      document.getElementById("status").textContent = "⚠️ Please enter username";
      return;
    }

    if (!sitesTextarea || !sitesTextarea.value || sitesTextarea.value.trim().length === 0) {
      document.getElementById("status").textContent = "⚠️ Please enter at least one site";
      return;
    }

    const textareaValue = String(sitesTextarea.value || "").trim();
    const sites = textareaValue
      .split(",")
      .map(s => String(s).trim())
      .filter(s => s.length > 0);

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
  } catch (error) {
    console.error("Error saving settings:", error);
    document.getElementById("status").textContent = "❌ Error saving settings";
  }
});

// Clear button handler
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all settings?")) {
    chrome.storage.local.remove(["leetcodeUsername", "blockedSites"], () => {
      document.getElementById("username").value = "";
      sitesTextarea.value = "";
      document.getElementById("status").textContent = "";
      if (popularSitesSelect) {
        popularSitesSelect.value = "";
      }
      showFormSection();
    });
  }
});
