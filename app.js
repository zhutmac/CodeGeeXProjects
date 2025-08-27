// Material Audit Application Logic

let CUR_PROJECT = null;
let CUR_MATERIAL = null;

// Utility function to get element by ID
function qs(id) {
  return document.getElementById(id);
}

// Show/hide elements
function show(id) {
  qs(id).classList.remove("hidden");
}

function hide(id) {
  qs(id).classList.add("hidden");
}

// Render projects table
function renderProjects() {
  const tbody = qs("projects-tbody");
  tbody.innerHTML = "";

  (window.PROJECTS || []).forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.number}</td>
      <td>${p.createdBy}</td>
      <td>${p.createdDate}</td>
      <td>${translateStatus(p.status)}</td>
      <td></td>
    `;
    const btn = document.createElement("button");
    btn.textContent = t("view");
    btn.className = "btn";
    btn.addEventListener("click", () => openMaterials(p.id));
    tr.children[5].appendChild(btn);
    tbody.appendChild(tr);
  });
}

// Translate status text based on current language
function translateStatus(status) {
  console.log("Translating status:", status, "for language:", currentLanguage);
  
  if (!status) {
    console.warn("Status is empty or undefined");
    return "";
  }
  
  if (currentLanguage === 'zh') {
    switch(status) {
      case 'Approved': return t('approved');
      case 'Rejected': return t('rejected');
      case 'Pending': return t('pending');
      case 'In Progress': return t('inProgress');
      default: return status;
    }
  }
  return status;
}

// Open materials view for a specific project
function openMaterials(pid) {
  console.log("Opening materials for project:", pid);
  console.log("Available projects:", window.PROJECTS);
  
  window.CUR_PROJECT = (window.PROJECTS || []).find(p => p.id === pid);
  console.log("Found project:", window.CUR_PROJECT);
  
  if (!window.CUR_PROJECT) {
    console.error("Project not found with ID:", pid);
    alert("Project not found");
    return;
  }

  // Hide all views first
  hide("view-projects");
  hide("view-audit");

  // Hide modal if it's open
  const modal = document.getElementById("modal-add-material");
  if (modal) {
    modal.classList.add("hidden");
    resetAddMaterialModal();
  }

  // Show materials view
  show("view-materials");

  // Update project title and subtitle
  qs("mat-proj-title").innerText = window.CUR_PROJECT.name;
  qs("mat-proj-sub").innerText = `Owner: ${window.CUR_PROJECT.owner} · Project No.: ${window.CUR_PROJECT.number}`;

  // Render materials table
  renderMaterials();
}

// Open audit view for a specific material
function openAudit(mid) {
  CUR_MATERIAL = CUR_PROJECT.materials.find(m => m.id === mid);
  hide("view-materials");
  show("view-audit");

  qs("audit-title").innerText = CUR_PROJECT.name;
  qs("audit-sub").innerText = `Material: ${CUR_MATERIAL.name} (${CUR_MATERIAL.model}) · Vendor: ${CUR_MATERIAL.detail.vendor}`;

  // Populate audit form with material data
  qs("audit-type").value = CUR_MATERIAL.type;
  qs("audit-name").value = CUR_MATERIAL.name;
  qs("audit-brand").value = CUR_MATERIAL.brand;
  qs("audit-model").value = CUR_MATERIAL.model;
  qs("audit-vendor").value = CUR_MATERIAL.detail.vendor;
  qs("audit-date").value = CUR_MATERIAL.date;
  qs("audit-status").value = CUR_MATERIAL.status;

  // Reset form fields
  qs("audit-result").value = "";
  qs("audit-comments").value = "";

  // Add event listener to submit button
  qs("btn-submit-audit").addEventListener("click", submitAudit);
}

// Submit audit form
function submitAudit() {
  const result = qs("audit-result").value;
  const comments = qs("audit-comments").value;

  if (!result) {
    alert(t("pleaseSelectResult"));
    return;
  }

  if (!comments.trim()) {
    alert(t("pleaseProvideComments"));
    return;
  }

  // Update material status
  CUR_MATERIAL.status = result.charAt(0).toUpperCase() + result.slice(1);
  CUR_MATERIAL.auditDate = new Date().toLocaleDateString();
  CUR_MATERIAL.auditComments = comments;
  CUR_MATERIAL.auditedBy = "Current User"; // In a real app, this would be the logged-in user

  // Show confirmation message
  alert(`${t("auditSuccess")} ${CUR_MATERIAL.status}`);

  // Go back to materials view
  show("view-materials");
  hide("view-audit");
}

// Function to simulate material file recognition
function recognizeMaterialFile(file) {
  // In a real application, this would use OCR or AI to extract text from the file
  // For this demo, we'll return mock data based on the file name
  const fileName = file.name.toLowerCase();

  if (fileName.includes("cable")) {
    return {
      type: "Electrical Cable",
      name: "XLPE/SWA/Cable",
      brand: "Keystone",
      model: "FDB185",
      vendor: ""
    };
  } else if (fileName.includes("pvc")) {
    return {
      type: "Electrical Cable",
      name: "Single Core PVC",
      brand: "Michelle",
      model: "6491X 1×10mm²",
      vendor: ""
    };
  } else {
    // Default mock data
    return {
      type: "Electrical Component",
      name: "Unknown Component",
      brand: "Unknown Brand",
      model: "Unknown Model",
      vendor: ""
    };
  }
}

// Function to add a new material to the current project
function addNewMaterial(materialData) {
  const newMaterial = {
    id: "M-" + (CUR_PROJECT.materials.length + 1),
    type: materialData.type,
    name: materialData.name,
    brand: materialData.brand,
    model: materialData.model,
    date: new Date().toLocaleDateString(),
    status: "Pending",
    detail: {
      vendor: "N/A" // Vendor will be added by Agent later
    }
  };

  // Add to project
  CUR_PROJECT.materials.push(newMaterial);

  // Re-render materials table
  renderMaterials();

  // Show success message
  alert(`${t("materialAddedSuccessfully") || "Material added successfully!"}`);
}

// Function to render materials table
function renderMaterials() {
  console.log("Rendering materials for project:", window.CUR_PROJECT);
  
  const tbody = qs("materials-tbody");
  if (!tbody) {
    console.error("materials-tbody element not found");
    return;
  }
  
  tbody.innerHTML = "";
  
  if (!window.CUR_PROJECT || !window.CUR_PROJECT.materials || !Array.isArray(window.CUR_PROJECT.materials)) {
    console.error("No materials found for project:", window.CUR_PROJECT ? window.CUR_PROJECT.name : "No current project");
    return;
  }
  
  console.log("Materials to render:", window.CUR_PROJECT.materials);

  window.CUR_PROJECT.materials.forEach(m => {
    const tr = document.createElement("tr");
    
    // Create cells for each material property
    tr.innerHTML = `
      <td>${m.type}</td>
      <td>${m.name}</td>
      <td>${m.brand}</td>
      <td>${m.model}</td>
      <td>${m.date}</td>
      <td>${translateStatus(m.status)}</td>
      <td><button class="btn" onclick="openAudit('${m.id}')">${t("view")}</button></td>
    `;
    
    tbody.appendChild(tr);
  });
  
  console.log("Materials table rendered successfully");
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load saved language or default to English
  const savedLang = localStorage.getItem('appLanguage') || 'en';
  setLanguage(savedLang);

  // Highlight active language button
  updateLanguageButtons(savedLang);

  // Wire events without inline handlers
  qs("btn-login").addEventListener("click", () => {
    const email = qs("email").value;
    const password = qs("pwd").value;

    if (!email || !password) {
      alert(t("pleaseEnterEmailPassword") || "Please enter email and password");
      return;
    }

    hide("view-login");
    show("view-projects");
    renderProjects();
  });

  qs("btn-back-projects").addEventListener("click", () => {
    show("view-projects");
    hide("view-materials");
  });

  qs("btn-back-materials").addEventListener("click", () => {
    show("view-materials");
    hide("view-audit");
  });

  // Add Material button
  qs("btn-add-material").addEventListener("click", () => {
    console.log("Add Material button clicked");
    show("modal-add-material");
  });

  // Function to reset the add material modal
  function resetAddMaterialModal() {
    qs("material-file").value = "";
    qs("file-name").textContent = "";
    hide("material-preview");
    hide("processing-indicator");
    qs("btn-confirm-add-material").disabled = true;
    window.currentMaterialData = null;
  }

  // Close Add Material modal
  document.addEventListener("click", function(event) {
    // Check if the close button was clicked
    if (event.target.id === "close-add-material" || event.target.classList.contains("close")) {
      console.log("Close button clicked");
      const modal = document.getElementById("modal-add-material");
      if (modal) {
        modal.classList.add("hidden");
        resetAddMaterialModal();
      }
    }

    // Check if the cancel button was clicked
    if (event.target.id === "btn-cancel-add-material") {
      console.log("Cancel button clicked");
      const modal = document.getElementById("modal-add-material");
      if (modal) {
        modal.classList.add("hidden");
        resetAddMaterialModal();
      }
    }

    // Check if clicked outside of modal
    if (event.target.id === "modal-add-material") {
      console.log("Clicked outside modal");
      event.target.classList.add("hidden");
      resetAddMaterialModal();
    }
  });

  // Handle file upload
  qs("material-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show file name
      qs("file-name").textContent = file.name;

      // Show processing indicator
      show("processing-indicator");
      hide("material-preview");

      // Simulate file processing delay
      setTimeout(() => {
        // Simulate file recognition
        const materialData = recognizeMaterialFile(file);

        // Hide processing indicator
        hide("processing-indicator");

        // Show material preview
        show("material-preview");

        // Update preview fields
        qs("preview-type").textContent = materialData.type;
        qs("preview-name").textContent = materialData.name;
        qs("preview-brand").textContent = materialData.brand;
        qs("preview-model").textContent = materialData.model;

        // Enable confirm button
        qs("btn-confirm-add-material").disabled = false;

        // Store material data for later use
        window.currentMaterialData = materialData;
      }, 1500); // Simulate 1.5 seconds processing time
    }
  });

  // Confirm Add Material
  qs("btn-confirm-add-material").addEventListener("click", () => {
    if (window.currentMaterialData) {
      // Add new material
      addNewMaterial(window.currentMaterialData);

      // Close modal
      const modal = document.getElementById("modal-add-material");
      if (modal) {
        modal.classList.add("hidden");
      }

      // Reset form
      resetAddMaterialModal();
    }
  });

  // Language switch buttons
  qs("btn-lang-en").addEventListener("click", () => {
    setLanguage('en');
    localStorage.setItem('appLanguage', 'en');
    updateLanguageButtons('en');
  });

  qs("btn-lang-zh").addEventListener("click", () => {
    setLanguage('zh');
    localStorage.setItem('appLanguage', 'zh');
    updateLanguageButtons('zh');
  });
});

// Update language button styles
function updateLanguageButtons(activeLang) {
  if (activeLang === 'en') {
    qs("btn-lang-en").style.background = 'var(--brand)';
    qs("btn-lang-en").style.color = '#fff';
    qs("btn-lang-zh").style.background = '#f3f4f6';
    qs("btn-lang-zh").style.color = '#111';
  } else {
    qs("btn-lang-en").style.background = '#f3f4f6';
    qs("btn-lang-en").style.color = '#111';
    qs("btn-lang-zh").style.background = 'var(--brand)';
    qs("btn-lang-zh").style.color = '#fff';
  }
}
