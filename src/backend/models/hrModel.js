class HR {
  constructor({
    hr_id,
    hr_name,
    hr_vam_id,
    hr_email,
    assigned_ec,
    created_at,
    updated_at,
    created_by,
    updated_by,
  }) {
    this.hr_id = hr_id; // Auto-incrementing ID
    this.hr_name = hr_name; // Full name of the HR
    this.hr_vam_id = hr_vam_id; // Unique VAM ID of the HR
    this.hr_email = hr_email; // Unique email address of the HR
    this.assigned_ec = assigned_ec; // Assigned engineering center
    this.created_at = created_at; // Record creation timestamp
    this.updated_at = updated_at; // Last updated timestamp
    this.created_by = created_by; // User who created the record (FK → users(id))
    this.updated_by = updated_by; // User who last updated the record (FK → users(id))
  }
}

module.exports = HR;