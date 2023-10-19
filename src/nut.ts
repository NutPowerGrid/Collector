import dotParser from '@lv00/dot-parser';
import { promisify } from 'util';
import { exec } from 'node:child_process';
import { BaseModelObj, checkConfig, ipRegex, nameRegex, parseEnv, portRegex } from './env';

const run = promisify(exec);

const model: BaseModelObj = {
  ip: {
    type: 'string',
    default: '127.0.0.1',
    required: false,
    regex: ipRegex,
  },
  port: {
    type: 'string',
    default: '3493',
    required: false,
    regex: portRegex,
  },
  ups_name: {
    type: 'string',
    required: true,
    regex: nameRegex,
  },
};

export default class Nut {
  readonly ip: string;
  readonly port: string;
  readonly name: string;
  readonly CMD: string;

  constructor() {
    let config = parseEnv(['nut']).nut;
    config = checkConfig(config, model, 'nut');

    this.ip = config.IP;
    this.name = config.UPS_NAME;
    this.port = config.PORT;
    this.CMD = `upsc ${this.name}@${this.ip}:${this.port} 2>/dev/null`;
  }

  async readInterval(f: (data: UPS) => void, interval: number) {
    f(await this.read());
    setInterval(async () => {
      f(await this.read());
    }, interval);
  }

  async read() {
    const { stderr, stdout } = await run(this.CMD);
    if (stderr) throw new Error(stderr);
    const data = dotParser(stdout) as UPS;
    if (!data) throw new Error('Unable to parse data from Nut');
    return data;
  }
}
