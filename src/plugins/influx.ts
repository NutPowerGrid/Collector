import { InfluxDB, Point } from '@influxdata/influxdb-client';
import logger from '../logger';
import { BaseModelObj } from '../env';
import Plugin from './index';
import { hostname } from 'os';

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
    default: '',
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
      const writeApi = client.getWriteApi(ORG.toString(), BUCKET.toString()) || undefined;

      const tags = {
        host: HOST ? HOST.toString() : hostname(),
        serial: d.device.serial,
        model: d.device.model,
        mfr: d.device.mfr,
      };

      writeApi.useDefaultTags(tags);

      const points: Point[] = [];

      // general
      points.push(new Point('ups').intField('realpower', d.ups.realpower));
      points.push(new Point('ups').stringField('status', d.ups.status));
      points.push(new Point('ups').intField('runtime', Number.parseInt(d.battery.runtime)));

      // input
      points.push(new Point('ups').floatField('input_frequency', d.input.frequency));
      points.push(new Point('ups').floatField('input_voltage', d.input.voltage._value));

      // output
      points.push(new Point('ups').floatField('output_frequency', d.output.frequency._value));
      points.push(new Point('ups').floatField('output_voltage', d.output.voltage._value));

      writeApi.writePoints(points);
      writeApi.close().catch((err: Error) => {
        if (process.env.DEBUG) console.error(err);
        logger.log('error', 'Unable to access influx DB');
      });
    }
  }

  close(): void {
    logger.log('info', 'Influx plugin closed');
  }
}

export default Influx;
