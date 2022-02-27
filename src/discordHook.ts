import { WebhookClient, MessageEmbed } from 'discord.js'
import CONST from './var'


const webhookClient = new WebhookClient({ url: CONST.DISCORD.URL });

export const send = (d: any) => {
  const upsName = d.device.model;
  const powerState = d.ups.status;

  if (powerState !== 'OL') {
    const embed = new MessageEmbed()
      .setTitle(upsName)
      .setColor('#0099ff');
    webhookClient.send({
      content: `Power outage (${powerState})`,
      embeds: [embed],
    })
  }
  }
}