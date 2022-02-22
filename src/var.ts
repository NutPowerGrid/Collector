import { config } from 'dotenv-flow';

export const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g;
export const portRegex = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/g;
export const nameRegex = /^[a-zA-Z0-9/-]*$/g;

config();

const VAR = {
  INTERVAL: 20000,
  NUT: {
    IP: 'localhost',
    PORT: '3493',
    NAME: 'ups',
  },
  INFLUX: {
    URL: '',
    ORG: '',
    TOKEN: '',
    BUCKET: '',
    HOST: '',
  },
};

// Interval
const { INTERVAL } = process.env;
const DEFAULT = 20000;
const MIN = 20000;
if (INTERVAL) VAR.INTERVAL = Number.isInteger(Number.parseInt(INTERVAL)) && Number.parseInt(INTERVAL) >= MIN ? Number.parseInt(INTERVAL) : DEFAULT;

// Nut
const { NUT_IP, NUT_PORT, NUT_UPS_NAME } = process.env;

VAR.NUT.IP = NUT_IP ? (NUT_IP.match(ipRegex)?.at(0) ? NUT_IP : VAR.NUT.IP) : VAR.NUT.IP;
VAR.NUT.PORT = NUT_PORT ? (NUT_PORT.match(portRegex)?.at(0) ? NUT_PORT : VAR.NUT.PORT) : VAR.NUT.PORT;
VAR.NUT.NAME = NUT_UPS_NAME ? (NUT_UPS_NAME.match(nameRegex)?.at(0) ? NUT_UPS_NAME : VAR.NUT.NAME) : VAR.NUT.NAME;

// Influx
const { INFLUX_URL, INFLUX_ORG, INFLUX_TOKEN, INFLUX_BUCKET, HOST } = process.env;
VAR.INFLUX.URL = INFLUX_URL ? INFLUX_URL : '';
VAR.INFLUX.ORG = INFLUX_ORG ? INFLUX_ORG : '';
VAR.INFLUX.TOKEN = INFLUX_TOKEN ? INFLUX_TOKEN : '';
VAR.INFLUX.BUCKET = INFLUX_BUCKET ? INFLUX_BUCKET : '';
VAR.INFLUX.HOST = HOST ? HOST : '';

export default VAR;
