import { config } from 'dotenv';

export const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g;
export const portRegex = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/g;
export const nameRegex = /^[a-zA-Z0-9/-]*$/g;

config();

export const API = () => {};

export const INTERVAL = () => {
  const { INTERVAL } = process.env;
  const DEFAULT = 20000;
  if (!INTERVAL) return DEFAULT;
  return Number.isInteger(Number.parseInt(INTERVAL)) ? Number.parseInt(INTERVAL) : DEFAULT;
};

export const NUT = () => {
  const { NUT_IP, NUT_PORT, NUT_UPS_NAME } = process.env;
  const DEFAULT = {
    IP: 'localhost',
    PORT: '3493',
    NAME: 'ups',
  };

  const IP = NUT_IP ? (NUT_IP.match(ipRegex)?.at(0) ? NUT_IP : DEFAULT.IP) : DEFAULT.IP;
  const PORT = NUT_PORT ? (NUT_PORT.match(portRegex)?.at(0) ? NUT_PORT : DEFAULT.PORT) : DEFAULT.PORT;
  const NAME = NUT_UPS_NAME ? (NUT_UPS_NAME.match(nameRegex)?.at(0) ? NUT_UPS_NAME : DEFAULT.NAME) : DEFAULT.NAME;

  return {
    IP,
    PORT,
    NAME,
  };
};
