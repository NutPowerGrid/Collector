import { WebhookClient, MessageEmbed } from 'discord.js';
import { BaseModelObj } from '../env';
import Plugin from './index';

const model: BaseModelObj = {
  url: {
    type: 'string',
    required: true,
  },
};

class DiscordHook extends Plugin {
  webhookClient: WebhookClient;
  config: { URL: string };

  static _prefix = 'discord';
  static _model = model;

  constructor({ URL }: { [key: string]: string }) {
    super();
    this.config = { URL };
    this.webhookClient = new WebhookClient({ url: URL });
    this.webhookClient.send({
      content: 'Power monitor enable',
    });
  }

  send(d: UPS): void {
    const upsName = d.device.model;
    const powerState = d.ups.status;

    if (powerState !== 'OB') return;

    const embed = new MessageEmbed().setTitle(upsName).setColor('#0099ff');
    this.webhookClient
      .send({
        content: `Power outage (${powerState})`,
        embeds: [embed],
      })
      .catch((err) => {
        if (process.env.DEBUG) console.error(err);
        Plugin._logger.log('error', 'Unable to access discord');
      });
  }
}

export default DiscordHook;
