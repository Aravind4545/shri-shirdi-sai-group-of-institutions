const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const middlewareDir = path.join(__dirname, 'middleware');
const controllersDir = path.join(__dirname, 'controllers'); // In case it exists

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace imports
  // const User = require('../models/User') -> const prisma = require('../prisma/client')
  // We'll replace all model requires with prisma client require if not already present
  let hasPrisma = content.includes("const prisma = require(");
  let modelsToReplace = [];
  
  const requireRegex = /const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*require\(['"]\.\.\/models\/[^'"]+['"]\);?/g;
  
  let match;
  while ((match = requireRegex.exec(content)) !== null) {
      modelsToReplace.push(match[1]);
  }

  if (modelsToReplace.length > 0) {
      // Remove all mongoose model requires
      content = content.replace(requireRegex, '');
      // Add prisma import at the top
      if (!hasPrisma) {
         let depth = filePath.includes('middleware') ? '../' : '../';
         content = `const prisma = require('${depth}prisma/client');\n` + content;
      }
  }

  // 2. Query Replacements for each found model
  // Because model names are like User, AssignmentSubmission, we need to map to lowerCamelCase: prisma.user, prisma.assignmentSubmission
function replaceMethodCall(content, modelName, methodName, replacementFn) {
    const searchString = `${modelName}.${methodName}(`;
    let result = '';
    let i = 0;
    while (i < content.length) {
        let idx = content.indexOf(searchString, i);
        if (idx === -1) {
            result += content.substring(i);
            break;
        }
        if (idx > 0 && /[a-zA-Z0-9_]/.test(content[idx - 1])) {
            result += content.substring(i, idx + searchString.length);
            i = idx + searchString.length;
            continue;
        }
        result += content.substring(i, idx);
        let argStart = idx + searchString.length;
        let pCount = 1;
        let argEnd = argStart;
        while (pCount > 0 && argEnd < content.length) {
            if (content[argEnd] === '(') pCount++;
            else if (content[argEnd] === ')') pCount--;
            argEnd++;
        }
        let args = content.substring(argStart, argEnd - 1);
        result += replacementFn(args);
        i = argEnd;
    }
    return result;
}

  for (const model of modelsToReplace) {
      const pModel = model.charAt(0).toLowerCase() + model.slice(1);

      content = replaceMethodCall(content, model, 'find', (args) => {
          if (!args.trim() || args.trim() === '{}') return `prisma.${pModel}.findMany()`;
          return `prisma.${pModel}.findMany({ where: ${args} })`;
      });

      content = replaceMethodCall(content, model, 'findById', (args) => {
          return `prisma.${pModel}.findUnique({ where: { id: ${args} } })`;
      });

      content = replaceMethodCall(content, model, 'findOne', (args) => {
          return `prisma.${pModel}.findFirst({ where: ${args} })`;
      });

      content = replaceMethodCall(content, model, 'create', (args) => {
          return `prisma.${pModel}.create({ data: ${args} })`;
      });

      // We need a custom replacer for new Model(...)
      const searchNew = `new ${model}(`;
      let i2 = 0;
      while (i2 < content.length) {
          let idx = content.indexOf(searchNew, i2);
          if (idx === -1) break;
          
          let argStart = idx + searchNew.length;
          let pCount = 1;
          let argEnd = argStart;
          while (pCount > 0 && argEnd < content.length) {
              if (content[argEnd] === '(') pCount++;
              else if (content[argEnd] === ')') pCount--;
              argEnd++;
          }
          let args = content.substring(argStart, argEnd - 1);
          let replacement = `/* TODO: Prisma create */ { data: ${args} }`;
          
          content = content.substring(0, idx) + replacement + content.substring(argEnd);
          i2 = idx + replacement.length;
      }

      // findByIdAndUpdate(id, data, opts)
      // For this one, the manual regex is hard, but we can do a simple replacement if it's two args.
      content = replaceMethodCall(content, model, 'findByIdAndUpdate', (args) => {
          const parts = args.split(',');
          const id = parts[0];
          const data = parts.slice(1).join(',').replace(/,\s*\{.*\}\s*$/, ''); // attempt to strip options
          return `prisma.${pModel}.update({ where: { id: ${id} }, data: ${data} })`;
      });

      content = replaceMethodCall(content, model, 'findByIdAndDelete', (args) => {
          return `prisma.${pModel}.delete({ where: { id: ${args} } })`;
      });

      content = replaceMethodCall(content, model, 'deleteMany', (args) => {
          if (!args.trim() || args.trim() === '{}') return `prisma.${pModel}.deleteMany()`;
          return `prisma.${pModel}.deleteMany({ where: ${args} })`;
      });

      content = replaceMethodCall(content, model, 'countDocuments', (args) => {
          if (!args.trim() || args.trim() === '{}') return `prisma.${pModel}.count()`;
          return `prisma.${pModel}.count({ where: ${args} })`;
      });

      content = replaceMethodCall(content, model, 'updateMany', (args) => {
          const firstBraceEnd = args.indexOf('}') + 1;
          const filter = args.substring(0, firstBraceEnd);
          const data = args.substring(firstBraceEnd).replace(/^,/, '').trim();
          return `prisma.${pModel}.updateMany({ where: ${filter}, data: ${data} })`;
      });

      const aggregateRegex = new RegExp(`\\b${model}\\.aggregate\\(`, 'g');
      content = content.replace(aggregateRegex, `/* TODO: Prisma aggregate/groupBy */ prisma.${pModel}.aggregate(`);
  }

  // Handle .populate(...) -> .populate is chained. It's too complex to safely regex replace with `include:`
  // because include goes inside the query object.
  // We'll just add a comment.
  content = content.replace(/\.populate\(/g, '/* TODO: replace populate with Prisma include */ .populate(');
  content = content.replace(/\.select\(/g, '/* TODO: replace select with Prisma select */ .select(');
  content = content.replace(/\.sort\(/g, '/* TODO: replace sort with Prisma orderBy */ .sort(');
  
  // .save() -> we can flag it
  content = content.replace(/\.save\(\)/g, '/* TODO: Prisma .save() replacement */ .save()');

  if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Migrated: ${filePath}`);
  }
}

function traverseAndMigrate(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseAndMigrate(fullPath);
        } else if (fullPath.endsWith('.js')) {
            migrateFile(fullPath);
        }
    }
}

traverseAndMigrate(routesDir);
traverseAndMigrate(middlewareDir);
if (fs.existsSync(controllersDir)) traverseAndMigrate(controllersDir);

console.log("Migration script complete.");
