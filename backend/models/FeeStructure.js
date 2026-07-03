const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  program: { type: String, required: true, unique: true }, // IIT, NEET, UPSC
  baseTuitionFee: { type: Number, required: true },
  studyMaterialFee: { type: Number, default: 0 },
  labResourceFee: { type: Number, default: 0 },
  examTrainingFee: { type: Number, default: 0 },
  totalFee: { type: Number, required: true },
  installmentsAllowed: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
