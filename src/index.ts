import { load } from './plugins';
import Nut from './nut';
import logger from './logger';

const init = async () => {
  const loaded = await load();
  if (loaded.length === 0) {
    logger.log({ level: 'warn', message: 'No plugin loaded -> Exiting' });
    process.exit(1);
  }
  const nut = new Nut();

  nut.readInterval((data) => {
    loaded.forEach((plugin) => plugin.send(data));
  });
};

init();
