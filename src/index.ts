import Nut from './nut';
import * as influx from './influx';
import CONST from './var';

const nut = new Nut(CONST.NUT);

nut.readInterval((data) => {
  influx.send(data);
  console.log(data.ups.realpower);
}, CONST.INTERVAL);
