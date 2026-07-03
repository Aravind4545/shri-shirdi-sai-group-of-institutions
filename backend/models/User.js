const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date },
  
  academicInfo: {
    intermediateYear: { type: String },
    collegeName: { type: String },
    state: { type: String }
  },

  programInfo: {
    program: { type: String, default: 'IIT' },
    stream: { type: String, default: 'MPC' },
    exams: [{ type: String }]
  },

  role: {
    type: String,
    enum: ['Student', 'Teacher', 'HOD', 'Admin', 'SuperAdmin'],
    default: 'Student'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  faceEmbedding: { 
    type: [Number], 
    select: false 
  },
  profileImage: {
    type: String
  },
  faceLoginEnabled: {
    type: Boolean,
    default: true
  },

  // Teacher Specific Fields
  assignedProgram: { type: String, enum: ['IIT', 'NEET', 'UPSC', 'All'] },
  designation: { type: String },
  profilePhoto: { type: String },
  teacherId: { type: String },
  employeeId: { type: String },
  subject: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },

  // AASHVEE Academic Companion Settings
  companionSettings: {
    style: { type: String, enum: ['Tech Visionary', 'Anime Warrior', 'Pop Star Energy', 'Elite Achiever', 'Strategic Genius'], default: 'Tech Visionary' },
    companionName: { type: String, default: 'Jarvis' },
    studentNickname: { type: String, default: 'Superstar' },
    isConfigured: { type: Boolean, default: false }
  },

  createdAt: { type: Date, default: Date.now }
});

// Performance Indexing
userSchema.index({ email: 1 });
userSchema.index({ role: 1, 'programInfo.program': 1 });

module.exports = mongoose.model('User', userSchema);
