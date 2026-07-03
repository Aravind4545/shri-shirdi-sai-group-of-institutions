const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));

let prismaSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

`;

function mapMongooseTypeToPrisma(instance, pathName, schemaOptions) {
  if (pathName === '_id') return 'String @id @default(uuid())';
  if (pathName === '__v') return null;

  let isArray = false;
  let typeName = instance;

  if (instance === 'Array') {
    isArray = true;
    // Assuming simple arrays of strings for now unless it's ObjectId
    // Need to look deeper into the schema options if possible
    typeName = 'String'; 
    if (schemaOptions && schemaOptions.caster && schemaOptions.caster.instance) {
      typeName = schemaOptions.caster.instance;
    }
  }

  let prismaType = 'String';
  switch (typeName) {
    case 'String': prismaType = 'String'; break;
    case 'Number': prismaType = 'Float'; break;
    case 'Date': prismaType = 'DateTime'; break;
    case 'Boolean': prismaType = 'Boolean'; break;
    case 'ObjectID': 
    case 'ObjectId': prismaType = 'String'; break;
    case 'Mixed': prismaType = 'Json'; break;
    default: prismaType = 'Json'; break; // fallback
  }

  let suffix = '';
  if (isArray) suffix = '[]';
  else if (schemaOptions && !schemaOptions.required && pathName !== '_id') suffix = '?';

  return `${prismaType}${suffix}`;
}

const relations = [];

for (const file of files) {
  const modelName = file.replace('.js', '');
  try {
    const Model = require(path.join(modelsDir, file));
    const schema = Model.schema;
    if (!schema) continue;

    prismaSchema += `model ${modelName} {\n`;
    prismaSchema += `  id String @id @default(uuid()) @map("_id")\n`;

    const paths = schema.paths;
    
    // Convert paths to a structured object to handle nested fields
    const fields = {};
    for (const [pathName, schemaType] of Object.entries(paths)) {
      if (pathName === '_id' || pathName === '__v') continue;
      
      const cleanPath = pathName.replace(/\./g, '_');
      
      let pType = mapMongooseTypeToPrisma(schemaType.instance, pathName, schemaType.options);
      
      if (schemaType.options && schemaType.options.ref) {
         // It's a relation!
         const refModel = schemaType.options.ref;
         prismaSchema += `  ${cleanPath} String?\n`;
         
         // field already output above
      } else {
         if (pType) prismaSchema += `  ${cleanPath} ${pType}\n`;
      }
    }
    prismaSchema += `}\n\n`;
  } catch (e) {
    console.error(`Error processing ${file}:`, e);
  }
}

fs.writeFileSync(path.join(__dirname, 'prisma', 'schema.prisma'), prismaSchema);
console.log('Generated prisma/schema.prisma successfully!');
