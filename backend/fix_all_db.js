require('dotenv').config();
const mongoose = require('mongoose');

async function fixAll() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Aravind:Aravind123@cluster0.v8wnt.mongodb.net/shirdi_sai?retryWrites=true&w=majority');
  
  const replaceMap = {
    'Lakshya': 'IIT',
    'Deekshya': 'NEET',
    'DAFNE': 'UPSC',
    'Dafne': 'UPSC'
  };

  function recursivelyReplace(obj) {
    let modified = false;
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i] === 'string' && replaceMap[obj[i]]) {
          obj[i] = replaceMap[obj[i]];
          modified = true;
        } else if (typeof obj[i] === 'object' && obj[i] !== null) {
          if (recursivelyReplace(obj[i])) modified = true;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && replaceMap[obj[key]]) {
          obj[key] = replaceMap[obj[key]];
          modified = true;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (recursivelyReplace(obj[key])) modified = true;
        }
      }
    }
    return modified;
  }

  const collections = await mongoose.connection.db.collections();
  
  for (const collection of collections) {
    const docs = await collection.find({}).toArray();
    let count = 0;

    for (const doc of docs) {
      if (recursivelyReplace(doc)) {
        await collection.updateOne({ _id: doc._id }, { $set: doc });
        count++;
      }
    }

    if (count > 0) {
      console.log(`Updated ${count} documents in collection ${collection.collectionName}`);
    }
  }

  console.log("Deep database rebranding complete.");
  process.exit(0);
}

fixAll();
