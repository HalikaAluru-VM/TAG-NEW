class Candidate {
  constructor({
    id,
    candidate_name,
    candidate_email,
    candidate_phone,
    primary_skill,
    prescreening_status,
    role,
    recruitment_phase,
    resume_score,
    resume,
    date,
    offer_status,
    hr_id,
    hr_email,
    uan_number,
    candidate_image_url,
    rrf_id,
    eng_center,
    visible,
    created_at,
    updated_at,
    created_by,
    updated_by,
  }) {
    this.id = id; // Auto-incrementing ID
    this.candidate_name = candidate_name; // Full name of the candidate
    this.candidate_email = candidate_email; // Email address
    this.candidate_phone = candidate_phone; // Contact number
    this.primary_skill = primary_skill; // Primary skill
    this.prescreening_status = prescreening_status; // Status of prescreening
    this.role = role; // Candidate’s job role
    this.recruitment_phase = recruitment_phase; // Current recruitment phase
    this.resume_score = resume_score; // Resume evaluation score
    this.resume = resume; // Resume file link
    this.date = date; // Application submission date
    this.offer_status = offer_status; // Offer issued or not
    this.hr_id = hr_id; // HR managing the candidate (FK → hr_details(hr_id))
    this.hr_email = hr_email; // Candidate info uploaded HR email
    this.uan_number = uan_number; // Universal Account Number (numeric)
    this.candidate_image_url = candidate_image_url; // URL of the uploaded candidate image
    this.rrf_id = rrf_id; // References RRF ID (FK → rrf_details(rrf_id))
    this.eng_center = eng_center; // Engineering center name
    this.visible = visible; // Candidate visibility in reports
    this.created_at = created_at; // Record creation timestamp
    this.updated_at = updated_at; // Last updated timestamp
    this.created_by = created_by; // User who created the record (FK → users(id))
    this.updated_by = updated_by; // User who last updated the record (FK → users(id))
  }
}

module.exports = Candidate;
