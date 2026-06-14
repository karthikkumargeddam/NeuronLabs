const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('c:/Neuron/frontend/src').filter(f => f.endsWith('.js') || f.endsWith('.jsx'));

let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace `{ cache: 'no-store' }` with `{ next: { revalidate: 60 } }`
  content = content.replace(/{ cache: 'no-store' }/g, '{ next: { revalidate: 60 } }');
  
  // Replace `{ cache: "no-store" }` with `{ next: { revalidate: 60 } }`
  content = content.replace(/{ cache: "no-store" }/g, '{ next: { revalidate: 60 } }');
  
  // Replace `cache: 'no-store'` inside an object where there are linebreaks, if any.
  content = content.replace(/cache:\s*['"]no-store['"]/g, 'next: { revalidate: 60 }');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched cache config in', file);
    changed++;
  }
}
console.log('Total files patched for cache optimization:', changed);
