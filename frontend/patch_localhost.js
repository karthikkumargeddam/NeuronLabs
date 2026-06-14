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

  // Replace double quotes
  content = content.replace(/"http:\/\/127\.0\.0\.1:1337([^"`]*)"/g, '`${process.env.NEXT_PUBLIC_STRAPI_URL || \'http://127.0.0.1:1337\'}$1`');
  
  // Replace single quotes
  content = content.replace(/'http:\/\/127\.0\.0\.1:1337([^'`]*)'/g, '`${process.env.NEXT_PUBLIC_STRAPI_URL || \'http://127.0.0.1:1337\'}$1`');
  
  // Replace backticks
  content = content.replace(/`http:\/\/127\.0\.0\.1:1337([^`]*)`/g, '`${process.env.NEXT_PUBLIC_STRAPI_URL || \'http://127.0.0.1:1337\'}$1`');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched', file);
    changed++;
  }
}
console.log('Total files patched:', changed);
