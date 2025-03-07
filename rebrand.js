// replace-branding.js
// Run this script to replace all instances of "AdventureKids" with "Kidobee"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory to search
const searchDir = path.join(__dirname, 'src');

// Define replacements
const replacements = [
  { from: /AdventureKids/g, to: 'Kidobee' },
  { from: /Adventure Kids/g, to: 'Kidobee' },
  { from: /Adventure[\s]?Kids/g, to: 'Kidobee' },
  { from: /adventurekids\.com/g, to: 'kidobee.com' },
];

// Function to recursively search through directories
function searchFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      searchFiles(filePath); // Recursively search subdirectories
    } else if (stats.isFile() && 
              (filePath.endsWith('.js') || 
               filePath.endsWith('.jsx') || 
               filePath.endsWith('.ts') || 
               filePath.endsWith('.tsx') || 
               filePath.endsWith('.html') || 
               filePath.endsWith('.css'))) {
      replaceInFile(filePath);
    }
  });
}

// Function to replace text in files
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanged = false;

    replacements.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        hasChanged = true;
      }
    });

    if (hasChanged) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Start the search
console.log('Starting rebranding process...');
searchFiles(searchDir);
console.log('Rebranding complete!');