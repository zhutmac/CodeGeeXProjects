// Material Audit Application Data

const PROJECTS = [
  {
    id: "P-001", 
    name: "SSG503 – Kwun Tong HQ & Ops Base", 
    owner: "EMSD", 
    status: "In Progress", 
    number: "#12345", 
    createdBy: "John Doe", 
    createdDate: "2025-08-01",
    materials: [
      {
        id: "M-1", 
        type: "Electrical Cable", 
        name: "XLPE/SWA/Cable", 
        brand: "Keystone", 
        model: "FDB185", 
        date: "26/8/2025", 
        status: "Approved", 
        detail: {
          vendor: "MAS"
        }
      }
    ]
  },
  {
    id: "P-002", 
    name: "Haven of Hope Hospital Expansion", 
    owner: "Hospital Authority", 
    status: "Pending", 
    number: "#12346", 
    createdBy: "Jane Smith", 
    createdDate: "2025-07-15",
    materials: [
      {
        id: "M-2", 
        type: "Electrical Cable", 
        name: "Single Core PVC", 
        brand: "Michelle", 
        model: "6491X 1×10mm²", 
        date: "15/8/2025", 
        status: "Rejected", 
        detail: {
          vendor: "Michelle"
        }
      }
    ]
  }
];

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROJECTS };
} else {
  window.PROJECTS = PROJECTS;
}