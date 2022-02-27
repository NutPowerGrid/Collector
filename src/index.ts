import Nut from './nut';
import * as influx from './influx';
import * as discord from './discordHook'
import CONST from './var';

const nut = new Nut(CONST.NUT);

nut.readInterval((data) => {
  if (CONST.INFLUX) influx.send(data);
  if (CONST.DISCORD) discord.send(data)
  console.log(data.ups.realpower);
}, CONST.INTERVAL);
