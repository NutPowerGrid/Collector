import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { UPS } from 'global';
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
    required: true,
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

      // input
      points.push(new Point('input').stringField('frequency', d.input.frequency));
      points.push(new Point('input').stringField('voltage', d.input.voltage));
      // output
      points.push(new Point('output').stringField('frequency', d.input.frequency));
      points.push(new Point('output').stringField('voltage', d.input.voltage));

      writeApi.writePoints(points);
      writeApi.close().catch((e) => {
        if (process.env.DEBUG) console.error(e);
        console.log('\\nUnable to access influx DB');
      });
    }
  }
}

export default Influx;
