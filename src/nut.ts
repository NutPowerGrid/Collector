import { ipRegex, nameRegex, portRegex } from './regex';
import dotParser from '../node_modules/@lv00/dot-parser/lib/cjs';
import { promisify } from 'util';
import { exec } from 'child_process';

const run = promisify(exec);

export default class Nut {
  readonly ip: string;
  readonly port: string;
  readonly name: string;
  readonly CMD: string;

  constructor({ NUT_UPS_NAME = 'ups', NUT_IP = '127.0.0.1', NUT_PORT = '3493' }) {
    if (NUT_IP.search(ipRegex)) throw new Error('Invalid Ip');
    if (NUT_PORT.search(portRegex)) throw new Error('Invalid Port');
    if (NUT_UPS_NAME.search(nameRegex)) throw new Error('Invalid Name');
    this.ip = NUT_IP;
    this.name = NUT_UPS_NAME;
    this.port = NUT_PORT;
    this.CMD = `upsc ${this.name}@${this.ip}:${this.port} 2>&1 | grep -v '^Init SSL'`;
    console.log(this.CMD);
  }

  async read() {
    const { stderr, stdout } = await run(this.CMD);
    if (stderr) throw new Error(stderr);
    const res = dotParser(stdout);
    if (!res) throw new Error('Unable to parse data from Nut');
    return res;
  }
}
