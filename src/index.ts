import { load } from './plugins';
import Nut from './nut';

process.on('SIGINT', () => {
  process.exit(0);
});

const init = async () => {
  const loaded = await load();
  if (loaded.length === 0) throw new Error('No plugin loaded -> Exiting');
  const nut = new Nut();

  nut.readInterval((data) => {
    loaded.forEach((plugin) => plugin.send(data));
  }, 20000);
};

init();

// import * as influx from './influx';
// import * as discord from './discordHook'

// const nut = new Nut(CONST.NUT);

// nut.readInterval((data) => {
//   //if (CONST.INFLUX) influx.send(data);
//   //if (CONST.DISCORD) discord.send(data)
//   console.log(data.ups.realpower);
// }, CONST.INTERVAL);
