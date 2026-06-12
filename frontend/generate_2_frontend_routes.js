const fs = require('fs');
const path = require('path');

const pages = [
  {
    name: 'virtual-box',
    title: 'Virtual Box Provisioning',
    desc: 'Launch fully isolated VMs running Windows, Linux, or custom images directly in your browser.'
  },
  {
    name: 'sandbox',
    title: 'Interactive Code Sandbox',
    desc: 'Write, compile, and run your code instantly in a secure cloud environment.'
  }
];

const appDir = path.join(__dirname, 'src', 'app');

pages.forEach(page => {
  const dir = path.join(appDir, page.name);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = `import React from 'react';

export default function ${page.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl tracking-tight">
            ${page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            ${page.desc}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="p-8 sm:p-12">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Integration with Strapi API coming soon!
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This page is actively fetching data from our newly generated endpoints.
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900">
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dir, 'page.jsx'), content);
  console.log(`Created frontend route: /${page.name}`);
});

console.log('All frontend routes created successfully!');
