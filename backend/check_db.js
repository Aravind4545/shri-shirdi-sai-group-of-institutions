require('dotenv').config();
const mongoose = require('mongoose');

async function searchAll() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Aravind:Aravind123@cluster0.v8wnt.mongodb.net/shirdi_sai?retryWrites=true&w=majority');
  
  const collections = await mongoose.connection.db.collections();
  let found = false;

  for (const collection of collections) {
    const docs = await collection.find({
      $or: [
        { "programInfo.program": { $in: ["Lakshya", "DAFNE", "Deekshya"] } },
        { "program": { $in: ["Lakshya", "DAFNE", "Deekshya"] } },
        { "assignedProgram": { $in: ["Lakshya", "DAFNE", "Deekshya"] } }
      ]
    }).toArray();

    if (docs.length > 0) {
      console.log(`Found ${docs.length} documents in collection ${collection.collectionName}`);
      found = true;
    }
  }

  if (!found) {
    console.log("No documents found with old branding.");
  }
  process.exit(0);
}

searchAll();
