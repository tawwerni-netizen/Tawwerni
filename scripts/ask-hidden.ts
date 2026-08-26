import { createInterface } from "node:readline";

/**
 * Reads a line from the terminal without echoing it.
 *
 * Secrets passed as command arguments end up in the shell's history file,
 * readable by anyone who later opens the machine. Asking for them keeps them
 * out of it.
 */
export function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });

    // readline echoes the prompt and then every keystroke. Writing the prompt
    // ourselves and then silencing the output hides the typing, not the question.
    process.stdout.write(question);
    const internals = rl as unknown as { _writeToOutput: (s: string) => void };
    internals._writeToOutput = () => {};

    rl.question("", (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}
