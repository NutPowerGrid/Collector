import { BaseModelObj } from '../env';
import fetch from 'node-fetch';
import Plugin from './index';

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
      Plugin._logger.log('error', 'Unable to access gotify');
    });

    this.previousState = powerState;
  }
}

export default Gotify;
