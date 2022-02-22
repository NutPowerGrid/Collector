import dotParser from '@lv00/dot-parser';
import { promisify } from 'util';
import { exec } from 'child_process';

const run = promisify(exec);

export default class Nut {
  readonly ip: string;
  readonly port: string;
  readonly name: string;
  readonly CMD: string;

  constructor({ IP = '', NAME = '', PORT = '' }) {
    this.ip = IP;
    this.name = NAME;
    this.port = PORT;
    this.CMD = `upsc ${this.name}@${this.ip}:${this.port} 2>/dev/null`;
  }

  async readInterval(f: { (data: any): void; (arg0: {}): void }, interval: number) {
    f(await this.read());
    setInterval(async () => {
      f(await this.read());
    }, interval);
  }

  async read() {
    const { stderr, stdout } = await run(this.CMD);
    if (stderr) throw new Error(stderr);
    const res = dotParser(stdout);
    if (!res) throw new Error('Unable to parse data from Nut');
    return res;
  }
}
