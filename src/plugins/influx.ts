import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { BaseModelObj } from '../env';
import Plugin from './';

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

  send(d: { device: { model: string }; ups: { realpower: string } }): void {
    const { client } = this;
    const { BUCKET, ORG, HOST } = this.config;
    if (!client) console.warn('client not ready');
    else {
      const writeApi = client.getWriteApi(ORG.toString(), BUCKET.toString());

      if (!HOST) writeApi.useDefaultTags({ host: d.device.model });
      else writeApi.useDefaultTags({ host: HOST.toString() });

      const point = new Point('ups').intField('realpower', d.ups.realpower);

      writeApi.writePoint(point);
      writeApi.close().catch((e) => {
        console.error(e);
        console.log('\\nUnable to access influx DB');
      });
    }
  }
}

export default Influx;
