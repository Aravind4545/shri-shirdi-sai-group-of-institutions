require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MockTest = require('./models/MockTest');
const Admission = require('./models/Admission');
const AIConversation = require('./models/AIConversation');
const Announcement = require('./models/Announcement');
const Assignment = require('./models/Assignment');
const CMSContent = require('./models/CMSContent');
const FeeStructure = require('./models/FeeStructure');
const KnowledgeBase = require('./models/KnowledgeBase');
const TopicAnalytics = require('./models/TopicAnalytics');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Aravind:Aravind123@cluster0.v8wnt.mongodb.net/shirdi_sai?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    const replaceMap = {
      'Lakshya': 'IIT',
      'Deekshya': 'NEET',
      'DAFNE': 'UPSC',
      'Dafne': 'UPSC',
      'lakshya': 'IIT',
      'deekshya': 'NEET',
      'dafne': 'UPSC'
    };

    // Helper function to update documents
    async function updateDocs(Model, fieldPath) {
      console.log(`Updating ${Model.modelName} for field ${fieldPath}...`);
      const docs = await Model.find({});
      let count = 0;
      for (const doc of docs) {
        // Handle nested fields if necessary, assuming flat for now
        const currentVal = doc[fieldPath];
        if (currentVal && replaceMap[currentVal]) {
          doc[fieldPath] = replaceMap[currentVal];
          await doc.save();
          count++;
        }
      }
      console.log(`Updated ${count} documents in ${Model.modelName}`);
    }

    // Handle array enum fields
    async function updateDocsArray(Model, fieldPath) {
      console.log(`Updating ${Model.modelName} for array field ${fieldPath}...`);
      const docs = await Model.find({});
      let count = 0;
      for (const doc of docs) {
        const arr = doc[fieldPath];
        if (arr && Array.isArray(arr)) {
          let modified = false;
          for (let i = 0; i < arr.length; i++) {
            if (replaceMap[arr[i]]) {
              arr[i] = replaceMap[arr[i]];
              modified = true;
            }
          }
          if (modified) {
            doc[fieldPath] = arr;
            await doc.save();
            count++;
          }
        }
      }
      console.log(`Updated ${count} documents in ${Model.modelName}`);
    }

    await updateDocs(User, 'program');
    await updateDocs(User, 'assignedProgram');
    await updateDocs(MockTest, 'targetProgram');
    await updateDocs(Admission, 'program');
    await updateDocs(AIConversation, 'program');
    await updateDocs(Announcement, 'targetProgram');
    await updateDocsArray(Assignment, 'targetPrograms'); // Assignment uses targetPrograms array
    await updateDocs(CMSContent, 'page');
    await updateDocs(FeeStructure, 'program');
    await updateDocs(KnowledgeBase, 'program');
    await updateDocs(TopicAnalytics, 'program');

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
