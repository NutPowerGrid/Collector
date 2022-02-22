import { InfluxDB, Point } from '@influxdata/influxdb-client';

import VAR from './var';

const { BUCKET, ORG, TOKEN, URL, HOST } = VAR.INFLUX;

const client = new InfluxDB({
  url: URL,
  token: TOKEN,
});

export const send = (d: any) => {
  const writeApi = client.getWriteApi(ORG, BUCKET);

  if (!HOST) writeApi.useDefaultTags({ host: d.device.model });
  else writeApi.useDefaultTags({ host: HOST });

  const point = new Point('ups').intField('realpower', d.ups.realpower);

  writeApi.writePoint(point);
  writeApi.close().catch((e) => {
    console.error(e);
    console.log('\\nUnable to access influx DB');
  });
};
