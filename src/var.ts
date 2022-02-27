import { config } from 'dotenv-flow';

export const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g;
export const portRegex = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/g;
export const nameRegex = /^[a-zA-Z0-9/-]*$/g;

config();

interface modelValue {
  default?: string | Number,
  required?: boolean
}

interface NumberModel extends modelValue {
  min: Number,
  max: Number,
}

interface StringModel extends modelValue {
  regex?: RegExp
}

const interval: NumberModel = {
  default: 20000,
  min: 20000,
  max: 0,
  required: false,
}

const nut: { [key: string]: StringModel } = {
  ip: {
    default: "127.0.0.1",
    required: false,
    regex: ipRegex
  },
  port: {
    default: "3493",
    required: false,
    regex: portRegex
  },
  name: {
    required: true,
    regex: nameRegex
  }
}

const influx: { [key: string]: StringModel } = {
  url: {
    required: true
  },
  org: {
    required: true
  },
  token: {
    required: true
  },
  bucket: {
    required: true
  },
  host: {
    required: true
  }
}

const model = {
  interval,
  nut,
  influx,
}

export const check = (value: Object | string | Number, model: { [key: string]: StringModel | NumberModel } | StringModel | NumberModel) => {

  const checkValue = (v: string | Number) => {

  }

  const checkObj = (v: Object) => {
    Object.keys(value).forEach(v => {
      if (typeof value !== 'object') checkValue(value)
      else checkObj(v)
    })
  }

  if (!value || !model) return undefined;

  if (typeof value !== 'object') checkValue(value)
  else checkObj(value)
}

const NUT: {
  IP: string,
  PORT: string,
  NAME: string,
} = {
  IP: 'localhost',
  PORT: '3493',
  NAME: 'ups',
}

const INFLUX = {
  URL: '',
  ORG: '',
  TOKEN: '',
  BUCKET: '',
  HOST: '',
}

const DISCORD = {
  URL: ''
}

let VAR = {
  INTERVAL: 20000,
  NUT,
  INFLUX,
  DISCORD
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
if (INFLUX_URL && INFLUX_ORG && INFLUX_TOKEN && INFLUX_BUCKET) {
  VAR.INFLUX = {
    URL: INFLUX_URL ? INFLUX_URL : '',
    ORG: INFLUX_ORG ? INFLUX_ORG : '',
    TOKEN: INFLUX_TOKEN ? INFLUX_TOKEN : '',
    BUCKET: INFLUX_BUCKET ? INFLUX_BUCKET : '',
    HOST: HOST ? HOST : '',
  }
  if (Object.keys(VAR.INFLUX).find(a => !a)) throw new Error(`Missing influx info`)
}

// Discord
const { DISCORD_URL } = process.env;
VAR.DISCORD.URL = DISCORD_URL ? DISCORD_URL : '';

export default VAR;
