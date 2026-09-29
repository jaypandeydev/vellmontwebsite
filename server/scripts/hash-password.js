// Usage: npm run hash-password            (prompts, input hidden)
//        npm run hash-password -- 'pw'    (argument)
import { hashPassword } from '../src/auth.js';
import readline from 'node:readline';

async function main() {
  let pw = process.argv[2];
  if (!pw) {
    pw = await new Promise((resolve) => {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
      process.stdout.write('Reviewer password: ');
      rl.stdoutMuted = true;
      rl._writeToOutput = () => {};
      rl.question('', (a) => { rl.close(); process.stdout.write('\n'); resolve(a); });
    });
  }
  if (!pw || pw.length < 12) {
    process.stderr.write('Use at least 12 characters.\n');
    process.exit(1);
  }
  process.stdout.write(`REVIEW_PASSWORD_HASH=${hashPassword(pw)}\n`);
}
main();
