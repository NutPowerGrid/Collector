import { WebhookClient, MessageEmbed, ColorResolvable } from 'discord.js';
import logger from '../logger';
import { BaseModelObj } from '../env';
import Plugin from './index';

const model: BaseModelObj = {
  url: {
    type: 'string',
    required: true,
  },
};

const color: { [key: string]: ColorResolvable } = {
  STARTUP: '#0099ff',
  OL: '#00D166',
  OB: '#F93A2F',
  LB: '#E67E22',
};


class DiscordHook extends Plugin {
  webhookClient: WebhookClient;
  config: { URL: string };

  static _prefix = 'discord';
  static _model = model;

  previousState = '';

  constructor({ URL }: { [key: string]: string }) {
    super();
    this.config = { URL };
    this.webhookClient = new WebhookClient({ url: URL });
    const embed = new MessageEmbed().setTitle(this.message['STARTUP']).setColor(color['STARTUP']);
    this.webhookClient
      .send({
        embeds: [embed],
      })
      .catch((err) => logger.log('error', 'Unable to access discord'));
  }

  send(d: UPS): void {
    const upsName = d.device.model;
    const powerState = d.ups.status;

    if (!this.previousState) this.previousState = powerState;
    if (this.previousState == powerState) return;

    const embed = new MessageEmbed().setTitle(`${this.message[powerState]} ${upsName}`).setColor(color[powerState]);
    this.webhookClient
      .send({
        embeds: [embed],
      })
      .catch((err) => {
        if (process.env.DEBUG) console.error(err);
        logger.log('error', 'Unable to access discord');
      });

    this.previousState = powerState;
  }

  close(): void {
    this.webhookClient.destroy();
    logger.log('info', 'Discord plugin closed');
  }
}

export default DiscordHook;
