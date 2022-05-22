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

class Gotify extends Plugin {
  static _prefix = 'gotify';
  static _model = model;

  config: { URL: string; TOKEN: string };

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

    if (powerState !== 'OB') return;

    const body = {
      message: `Power outage on ${upsName}`,
      title: `${upsName} (${powerState})`,
    };

    fetch(`${URL}/message`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'X-Gotify-Key': TOKEN },
    });
  }
}

export default Gotify;
