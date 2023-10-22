import dotParser from '@lv00/dot-parser';
import { promisify } from 'util';
import { exec } from 'node:child_process';
import { BaseModelObj, checkConfig, ipRegex, nameRegex, parseEnv, portRegex } from './env';
import logger from 'logger';

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
  interval: {
    type: 'number',
    default: 20000,
    required: false,
  },
  retries: {
    type: 'number',
    default: 5,
    required: false,
  },
};

export default class Nut {
  readonly ip: string;
  readonly port: string;
  readonly name: string;
  readonly CMD: string;
  readonly interval: number;
  readonly retries: number;

  errorCount = 0;

  constructor() {
    let config = parseEnv(['nut']).nut;
    config = checkConfig(config, model, 'nut');

    this.ip = config.IP;
    this.name = config.UPS_NAME;
    this.port = config.PORT;
    this.interval = config.INTERVAL;
    this.retries = config.RETRIES;
    this.CMD = `upsc ${this.name}@${this.ip}:${this.port} 2>/dev/null`;
  }

  readInterval(f: (data: UPS) => void, interval?: number) {
    const fn = async () => {
      try {
        const data = await this.read();
        f(data);
        this.errorCount = 0;
      } catch (e) {
        this.errorCount++;
        if (this.errorCount > this.retries) {
          logger.log({ level: 'error', message: `Unable to read data from Nut after ${this.retries} retries -> Exiting` });
          clearInterval(inter);
          process.exit(1);
        } else {
          logger.log({ level: 'error', message: 'Unable to read data from Nut' });
        }
      }
    };
    fn();
    const inter = setInterval(() => fn(), interval || this.interval);
    return inter;
  }

  async read() {
    const { stderr, stdout } = await run(this.CMD);
    if (stderr) throw new Error(stderr);
    const data = dotParser(stdout) as UPS;
    if (!data) throw new Error('Unable to parse data from Nut');
    return data;
  }
}
