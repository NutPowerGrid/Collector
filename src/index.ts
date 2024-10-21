import { load } from './plugins';
import Nut from './nut';
import logger from './logger';

const init = async () => {
  const loaded = await load();
  const message = loaded.map((plugin) => '\n • ' + plugin.constructor.name).join('');
  if (loaded.length === 0) {
    logger.log('No plugin loaded -> Exiting');
    process.exit(1);
  }
  logger.log('Power monitor enable');
  logger.log(`Loaded plugins (${loaded.length}):` + message);
  const nut = new Nut();

  const interval = nut.readInterval((data) => {
    loaded.forEach((plugin) => plugin.send(data));
  });

  function exitOnSignal(signal: string) {
    process.on(signal, function () {
      console.log();
      logger.log('Exiting gracefully 🍺');
      clearInterval(interval);
      loaded.forEach((plugin) => plugin.close());
      process.exit(0);
    });
  }

  exitOnSignal('SIGINT');
  exitOnSignal('SIGTERM');
};

init();
