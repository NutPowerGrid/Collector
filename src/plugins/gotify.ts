import { BaseModelObj } from '../env';
import Plugin from './index';
import logger from '../logger';

const model: BaseModelObj = {
  url: {
    type: 'string',
    required: true,
  },
  token: {
    type: 'string',
    required: true,
  },
};

const message: { [key: string]: string } = {
  STARTUP: 'Power monitor enable',
  OL: 'Power was restored on',
  OB: 'Power outage on',
  LB: 'Low battery on',
};

const priority: { [key: string]: number } = {
  STARTUP: 2,
  OL: 4,
  OB: 4,
  LB: 4,
};

class Gotify extends Plugin {
  config: { URL: string; TOKEN: string };

  static _prefix = 'gotify';
  static _model = model;

  previousState = '';

  constructor({ URL, TOKEN }: { [key: string]: string }) {
    super();
    this.config = {
      URL,
      TOKEN,
    };
    const body = {
      message: `${message.STARTUP}`,
      title: message.STARTUP,
      priority: priority.STARTUP,
    };
    fetch(`${URL}/message`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'X-Gotify-Key': TOKEN },
    }).catch((err) => {
      if (process.env.DEBUG) console.error(err);
      logger.log('error', 'Unable to access gotify');
    });
  }

  send(d: UPS) {
    const { URL, TOKEN } = this.config;
    const powerState = d.ups.status;
    const upsName = d.device.model;

    if (!this.previousState) this.previousState = powerState;
    if (this.previousState == powerState) return;

    const body = {
      message: `${message[powerState]} ${upsName}`,
      title: `${upsName} (${powerState})`,
      priority: priority[powerState],
    };
    fetch(`${URL}/message`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'X-Gotify-Key': TOKEN },
    }).catch((err) => {
      if (process.env.DEBUG) console.error(err);
      logger.log('error', 'Unable to access gotify');
    });

    this.previousState = powerState;
  }

  close(): void {
    logger.log('info', 'Gotify plugin closed');
  }
}

export default Gotify;
