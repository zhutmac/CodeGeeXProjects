// Material Audit Application Languages

const LANGUAGES = {
  en: {
    // Login
    title: "Material Audit",
    subtitle: "Demo (Projects → Materials → Audit)",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    anyEmailPassword: "* Any email/password works",
    pleaseEnterEmailPassword: "Please enter email and password",

    // Projects
    allProjects: "All Projects",
    selectProject: "Select a project to view its materials.",
    projectName: "Project Name",
    projectNumber: "Project Number",
    createdBy: "Created By",
    createdDate: "Created Date",
    status: "Status",
    action: "Action",
    view: "View",

    // Materials
    materials: "Materials",
    materialType: "Material Type",
    materialName: "Material Name",
    brand: "Brand",
    model: "Model",
    lastSubmission: "Last Submission",
    back: "← Back",
    addMaterial: "Add Material",
    addNewMaterial: "Add New Material",
    uploadMaterialFile: "Upload Material File",
    chooseFile: "Choose File",
    vendor: "Vendor",
    confirmAdd: "Confirm",
    cancel: "Cancel",
    processingNote: "* System will automatically extract material information from the uploaded file",
    processingFile: "Processing file, please wait...",
    materialPreview: "Material Information",
    materialAddedSuccessfully: "Material added successfully!",

    // Audit
    auditPage: "Material Audit",
    auditResult: "Audit Result",
    comments: "Comments",
    submitAudit: "Submit Audit",
    auditCommentsRequired: "* Audit comments are required",
    auditSuccess: "Audit submitted successfully! Material status updated to:",
    pleaseSelectResult: "Please select an audit result",
    pleaseProvideComments: "Please provide audit comments",

    // Status
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending Review",
    inProgress: "In Progress"
  },

  zh: {
    // Login
    title: "材料審計",
    subtitle: "演示 (項目 → 材料 → 審計)",
    email: "電子郵件",
    password: "密碼",
    signIn: "登入",
    anyEmailPassword: "* 任意電子郵件/密碼均可",
    pleaseEnterEmailPassword: "請輸入電子郵件和密碼",

    // Projects
    allProjects: "所有項目",
    selectProject: "選擇項目查看其材料。",
    projectName: "項目名稱",
    projectNumber: "項目編號",
    createdBy: "創建者",
    createdDate: "創建日期",
    status: "狀態",
    action: "操作",
    view: "查看",

    // Materials
    materials: "材料",
    materialType: "材料類型",
    materialName: "材料名稱",
    brand: "品牌",
    model: "型號",
    lastSubmission: "最後提交",
    back: "← 返回",
    addMaterial: "添加物料",
    addNewMaterial: "添加新物料",
    uploadMaterialFile: "上傳物料文件",
    chooseFile: "選擇文件",
    vendor: "供應商",
    confirmAdd: "確認",
    cancel: "取消",
    processingNote: "* 系统将自动从上传的文件中提取物料信息",
    processingFile: "正在处理文件，请稍候...",
    materialPreview: "物料信息",
    materialAddedSuccessfully: "物料添加成功！",

    // Audit
    auditPage: "材料審計",
    auditResult: "審計結果",
    comments: "評論",
    submitAudit: "提交審計",
    auditCommentsRequired: "* 審計評論為必填",
    auditSuccess: "審計提交成功！材料狀態已更新為：",
    pleaseSelectResult: "請選擇審計結果",
    pleaseProvideComments: "請提供審計評論",

    // Status
    approved: "已批准",
    rejected: "已拒絕",
    pending: "待審核",
    inProgress: "進行中"
  }
};

// Current language setting
let currentLanguage = 'en';

// Function to set language
function setLanguage(lang) {
  if (LANGUAGES[lang]) {
    currentLanguage = lang;
    updateUI();
    return true;
  }
  return false;
}

// Function to get translated text
function t(key) {
  return LANGUAGES[currentLanguage][key] || key;
}

// Function to update UI with current language
function updateUI() {
  document.title = t('title');

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (element.tagName === 'INPUT' && element.type !== 'button') {
      element.placeholder = t(key);
    } else {
      element.textContent = t(key);
    }
  });

  // Update select options
  const auditResultSelect = document.getElementById('audit-result');
  if (auditResultSelect) {
    const options = auditResultSelect.options;
    options[1].text = t('approved');
    options[2].text = t('rejected');
    options[3].text = t('pending');
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LANGUAGES, setLanguage, t, updateUI };
} else {
  window.LANGUAGES = LANGUAGES;
  window.setLanguage = setLanguage;
  window.t = t;
  window.updateUI = updateUI;
}