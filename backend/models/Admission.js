const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Waitlisted'], default: 'Pending' },
  applicationDate: { type: Date, default: Date.now },
  assignedStudentId: { type: String }, // e.g. SSSI-2026-001
  
  // Applicant Details
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  program: { type: String, required: true }, // IIT, NEET, UPSC
  stream: { type: String, required: true },
  examTargets: [{ type: String }],
  
  // Parent Details
  parentName: { type: String, required: true },
  parentMobile: { type: String, required: true },
  address: { type: String, required: true },
  
  // Identity & Academics
  aadhaarNumber: { type: String, required: true },
  previousSchool: { type: String },
  previousMarks: { type: String },

  // Document URLs (Mocked as strings for now)
  documents: {
    passportPhoto: { type: String },
    aadhaarProof: { type: String },
    marksMemo: { type: String },
    transferCertificate: { type: String }
  },

  reviewerNotes: { type: String }
});

module.exports = mongoose.model('Admission', admissionSchema);
