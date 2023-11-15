import { load } from './plugins';
import Nut from './nut';
import logger from './logger';
import { getMemoryUsage } from 'unit';

const init = async () => {
  const loaded = await load();
  const message = loaded.map((plugin) => '\n • ' + plugin.constructor.name).join('');
  logger.log({ level: 'info', message: 'Power monitor enable' });
  logger.log({ level: 'info', message: `Loaded plugins (${loaded.length}):` + message });
  if (loaded.length === 0) {
    logger.log({ level: 'warn', message: 'No plugin loaded -> Exiting' });
    process.exit(1);
  }
  const nut = new Nut();

  const interval = nut.readInterval((data) => {
    loaded.forEach((plugin) => plugin.send(data));
  });

  function exitOnSignal(signal: string) {
    process.on(signal, function () {
      console.log();
      logger.log({ level: 'info', message: 'Exiting gracefully 🍺' });
      clearInterval(interval);
      loaded.forEach((plugin) => plugin.close());
      process.exit(0);
    });
  }

  exitOnSignal('SIGINT')
  exitOnSignal('SIGTERM')
};

init();
