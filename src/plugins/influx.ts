import { InfluxDB, Point } from '@influxdata/influxdb-client';
import logger from '../logger';
import { BaseModelObj } from '../env';
import Plugin from './index';

const model: BaseModelObj = {
  url: {
    type: 'string',
    required: true,
  },
  org: {
    type: 'string',
    required: true,
  },
  token: {
    type: 'string',
    required: true,
  },
  bucket: {
    type: 'string',
    required: true,
  },
  host: {
    type: 'string',
    required: false,
    default : "",
  },
};

class Influx extends Plugin {
  static _prefix = 'influx';
  static _model = model;

  client?: InfluxDB;
  config: { URL: string; TOKEN: string; ORG: string; BUCKET: string; HOST: string };

  constructor({ URL, TOKEN, ORG, BUCKET, HOST }: { [key: string]: string }) {
    super();
    this.config = {
      URL,
      TOKEN,
      ORG,
      BUCKET,
      HOST,
    };
    this.client = new InfluxDB({
      url: URL.toString(),
      token: TOKEN.toString(),
    });
  }

  send(d: UPS): void {
    const { client } = this;
    const { BUCKET, ORG, HOST } = this.config;
    if (!client) console.warn('client not ready');
    else {
      const writeApi = client.getWriteApi(ORG.toString(), BUCKET.toString());

      if (!HOST) writeApi.useDefaultTags({ host: d.device.model });
      else writeApi.useDefaultTags({ host: HOST.toString() });

      const points = [];

      // ups
      points.push(new Point('ups').intField('realpower', d.ups.realpower));
      points.push(new Point('ups').stringField('status', d.ups.status));
      points.push(new Point('ups').intField('runtime', Number.parseInt(d.battery.runtime)));

      // input
      points.push(new Point('input').floatField('frequency', d.input.frequency));
      points.push(new Point('input').floatField('voltage', d.input.voltage._value));

      // output
      points.push(new Point('output').floatField('frequency', d.output.frequency._value));
      points.push(new Point('output').floatField('voltage', d.output.voltage._value));

      writeApi.writePoints(points);
      writeApi.flush().catch((err) => {
        if (process.env.DEBUG) console.error(err);
        logger.log('error', 'Unable to access influx DB');
      });
    }
  }
}

export default Influx;
