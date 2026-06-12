import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    const { language, code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    const uniqueId = crypto.randomUUID();
    let stdout = '';
    let stderr = '';
    
    try {
      if (language === 'python') {
        const filePath = path.join(tempDir, `script_${uniqueId}.py`);
        await fs.writeFile(filePath, code);
        const { stdout: out, stderr: err } = await execAsync(`python "${filePath}"`, { timeout: 10000 });
        stdout = out;
        stderr = err;
        await fs.unlink(filePath).catch(() => {});
      } 
      else if (language === 'javascript') {
        const filePath = path.join(tempDir, `script_${uniqueId}.js`);
        await fs.writeFile(filePath, code);
        const { stdout: out, stderr: err } = await execAsync(`node "${filePath}"`, { timeout: 10000 });
        stdout = out;
        stderr = err;
        await fs.unlink(filePath).catch(() => {});
      }
      else if (language === 'java') {
        // Extract public class name or default to Main
        const classNameMatch = code.match(/public\s+class\s+([a-zA-Z0-9_]+)/);
        const className = classNameMatch ? classNameMatch[1] : 'Main';
        const dirPath = path.join(tempDir, `java_${uniqueId}`);
        await fs.mkdir(dirPath);
        const filePath = path.join(dirPath, `${className}.java`);
        await fs.writeFile(filePath, code);
        
        // Compile
        await execAsync(`javac "${filePath}"`, { timeout: 10000 });
        // Run
        const { stdout: out, stderr: err } = await execAsync(`java -cp "${dirPath}" ${className}`, { timeout: 10000 });
        stdout = out;
        stderr = err;
        
        // Cleanup
        await fs.rm(dirPath, { recursive: true, force: true }).catch(() => {});
      }
      else if (language === 'c') {
        const dirPath = path.join(tempDir, `c_${uniqueId}`);
        await fs.mkdir(dirPath);
        const filePath = path.join(dirPath, `main.c`);
        const exePath = path.join(dirPath, `main.exe`);
        await fs.writeFile(filePath, code);
        
        // Compile
        await execAsync(`gcc "${filePath}" -o "${exePath}"`, { timeout: 10000 });
        // Run
        const { stdout: out, stderr: err } = await execAsync(`"${exePath}"`, { timeout: 10000 });
        stdout = out;
        stderr = err;
        
        // Cleanup
        await fs.rm(dirPath, { recursive: true, force: true }).catch(() => {});
      }
      else {
        return NextResponse.json({ 
          error: `Language '${language}' is not configured for local execution yet. Please install the compiler natively on your machine to use it.` 
        }, { status: 400 });
      }

      return NextResponse.json({ output: stdout, error: stderr });
    } catch (execError) {
      // If the command fails (e.g. compilation error or runtime error)
      return NextResponse.json({ 
        output: execError.stdout || '', 
        error: execError.stderr || execError.message || 'Execution failed' 
      });
    }

  } catch (err) {
    console.error("Execution error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
