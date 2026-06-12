const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiName = 'code-snippet';
const singularName = 'code-snippet';
const pluralName = 'code-snippets';

console.log(`Generating Strapi API: ${apiName}...`);

// Generate API via strapi CLI
try {
  execSync(`npx strapi generate api ${apiName} --id ${apiName}`, { stdio: 'inherit' });
} catch (err) {
  console.log(`Failed to generate API using CLI, creating files manually...`);
  // Manual fallback just in case
  const apiDir = path.join(__dirname, 'src', 'api', apiName);
  
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(path.join(apiDir, 'content-types', apiName), { recursive: true });
    fs.mkdirSync(path.join(apiDir, 'controllers'), { recursive: true });
    fs.mkdirSync(path.join(apiDir, 'routes'), { recursive: true });
    fs.mkdirSync(path.join(apiDir, 'services'), { recursive: true });
  }
}

// Modify schema manually to ensure fields
const schemaPath = path.join(__dirname, 'src', 'api', apiName, 'content-types', apiName, 'schema.json');
const schema = {
  kind: 'collectionType',
  collectionName: pluralName.replace('-', '_'),
  info: {
    singularName: singularName,
    pluralName: pluralName,
    displayName: 'Code Snippet',
    description: 'Saved code snippets from users practicing in the code editor'
  },
  options: {
    draftAndPublish: true
  },
  pluginOptions: {},
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    language: {
      type: 'string',
      required: true
    },
    code: {
      type: 'text',
      required: true
    },
    userEmail: {
      type: 'string',
      required: false
    }
  }
};

fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

console.log('✅ code-snippet API created and schema defined successfully!');
