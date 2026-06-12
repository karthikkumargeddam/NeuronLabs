/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const filesToRename = [
  { old: 'src/app/layout.tsx', new: 'src/app/layout.jsx' },
  { old: 'src/app/page.tsx', new: 'src/app/page.jsx' },
  { old: 'src/app/courses/page.tsx', new: 'src/app/courses/page.jsx' },
  { old: 'src/app/courses/[id]/page.tsx', new: 'src/app/courses/[id]/page.jsx' },
  { old: 'src/app/labs/page.tsx', new: 'src/app/labs/page.jsx' },
  { old: 'src/app/labs/[id]/page.tsx', new: 'src/app/labs/[id]/page.jsx' },
  { old: 'src/app/api/auth/[...nextauth]/route.ts', new: 'src/app/api/auth/[...nextauth]/route.js' },
  { old: 'src/lib/api.ts', new: 'src/lib/api.js' },
  { old: 'next.config.ts', new: 'next.config.mjs' }
];

filesToRename.forEach(f => {
  const oldPath = path.join(process.cwd(), f.old);
  const newPath = path.join(process.cwd(), f.new);
  if (!fs.existsSync(oldPath)) {
    console.log('File not found: ' + oldPath);
    return;
  }
  let content = fs.readFileSync(oldPath, 'utf8');
  
  // Cleanup TS specific code
  content = content.replace('import type { Metadata } from "next";', '');
  content = content.replace('export const metadata: Metadata =', 'export const metadata =');
  content = content.replace(/}: Readonly<\{[\s\S]*?\}>\)/g, '})');
  content = content.replace(', { NextAuthOptions }', '');
  content = content.replace('export const authOptions: NextAuthOptions =', 'export const authOptions =');
  content = content.replace(/\(user as any\)/g, 'user');
  content = content.replace(/\(session\.user as any\)/g, 'session.user');
  content = content.replace(/course: any/g, 'course');
  content = content.replace(/lab: any/g, 'lab');
  content = content.replace(/params }: \{ params: \{ id: string \} \}/g, 'params }');
  content = content.replace(/params: Record<string, unknown>/g, 'params');
  content = content.replace(/value as Record<string, unknown>/g, 'value');
  content = content.replace(/value as string \| number \| boolean/g, 'value');
  content = content.replace(/prefix = ''\): string/g, "prefix = ''");
  content = content.replace(/options: RequestInit = \{\}/g, 'options = {}');
  content = content.replace(/uuid: string/g, 'uuid');

  fs.writeFileSync(newPath, content);
  fs.unlinkSync(oldPath);
  console.log('Renamed and cleaned ' + f.old + ' -> ' + f.new);
});

if (fs.existsSync(path.join(process.cwd(), 'next-env.d.ts'))) {
  fs.unlinkSync(path.join(process.cwd(), 'next-env.d.ts'));
}
if (fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))) {
  fs.renameSync(path.join(process.cwd(), 'tsconfig.json'), path.join(process.cwd(), 'jsconfig.json'));
  console.log('Renamed tsconfig.json to jsconfig.json');
}
