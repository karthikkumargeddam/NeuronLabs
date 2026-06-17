'use strict';

// A stateless mock file system for the terminal
const MOCK_FS = {
  '/home/researcher': ['project_alpha', 'dataset.csv', 'notes.txt', 'scripts'],
  '/home/researcher/project_alpha': ['main.py', 'model.h5', 'requirements.txt'],
  '/home/researcher/scripts': ['train.sh', 'eval.sh', 'deploy.sh'],
  '/etc': ['passwd', 'hosts'],
  '/': ['bin', 'boot', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'root', 'run', 'sbin', 'srv', 'sys', 'tmp', 'usr', 'var']
};

const FILE_CONTENTS = {
  '/home/researcher/notes.txt': 'Meeting at 3PM.\nDiscuss the new Transformer architecture.',
  '/home/researcher/project_alpha/requirements.txt': 'tensorflow==2.14.0\npandas\nnumpy\nscikit-learn',
  '/home/researcher/scripts/train.sh': '#!/bin/bash\necho "Starting training..."\npython main.py --epochs 100',
  '/etc/hosts': '127.0.0.1\tlocalhost\n127.0.1.1\tneuron-instance',
};

module.exports = {
  async execute(ctx) {
    try {
      const { command, cwd = '/home/researcher' } = ctx.request.body;

      if (!command) {
        return ctx.badRequest('No command provided');
      }

      const args = command.trim().split(/\s+/);
      const cmd = args[0].toLowerCase();

      let output = '';
      let newCwd = cwd;

      switch (cmd) {
        case 'pwd':
          output = newCwd;
          break;

        case 'whoami':
          output = 'researcher';
          break;

        case 'ls':
          const targetDir = args[1] || newCwd;
          const absoluteTarget = targetDir.startsWith('/') ? targetDir : (newCwd === '/' ? '/' + targetDir : newCwd + '/' + targetDir);
          
          if (MOCK_FS[absoluteTarget]) {
            output = MOCK_FS[absoluteTarget].join('  ');
          } else {
            output = `ls: cannot access '${targetDir}': No such file or directory`;
          }
          break;

        case 'cd':
          const targetPath = args[1] || '/home/researcher';
          let attemptCwd = targetPath.startsWith('/') ? targetPath : (newCwd === '/' ? '/' + targetPath : newCwd + '/' + targetPath);
          
          if (targetPath === '..') {
            const parts = newCwd.split('/').filter(Boolean);
            parts.pop();
            attemptCwd = '/' + parts.join('/');
          } else if (targetPath === '.') {
            attemptCwd = newCwd;
          } else if (targetPath === '~') {
            attemptCwd = '/home/researcher';
          }

          if (attemptCwd === '') attemptCwd = '/';

          if (MOCK_FS[attemptCwd]) {
            newCwd = attemptCwd;
          } else {
            output = `bash: cd: ${targetPath}: No such file or directory`;
          }
          break;

        case 'cat':
          if (!args[1]) {
            output = 'cat: missing operand';
            break;
          }
          const fileTarget = args[1].startsWith('/') ? args[1] : (newCwd === '/' ? '/' + args[1] : newCwd + '/' + args[1]);
          if (FILE_CONTENTS[fileTarget]) {
            output = FILE_CONTENTS[fileTarget];
          } else if (MOCK_FS[fileTarget]) {
             output = `cat: ${args[1]}: Is a directory`;
          } else {
            output = `cat: ${args[1]}: No such file or directory`;
          }
          break;

        case 'echo':
          output = args.slice(1).join(' ').replace(/["']/g, '');
          break;

        case 'clear':
          output = '\x1b[2J\x1b[3J\x1b[H'; // ANSI clear screen
          break;

        case 'help':
          output = 'NeuronLabs Web Shell\nAvailable mock commands: ls, cd, pwd, cat, echo, whoami, clear, help';
          break;

        default:
          output = `bash: ${cmd}: command not found`;
      }

      ctx.send({
        output,
        cwd: newCwd
      });

    } catch (err) {
      ctx.throw(500, err);
    }
  }
};
