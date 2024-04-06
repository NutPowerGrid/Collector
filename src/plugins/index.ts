import { BaseModelObj, checkConfig, parseEnv } from '../env';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import logger from '../logger';

abstract class Plugin {
  static _model: BaseModelObj;
  static _prefix: string;
  static _loadEnv?: boolean = true;

  message = {
    STARTUP: 'Power monitor enable',
    OL: 'Power was restored',
    OB: 'Power outage',
    LB: 'Low battery',
  };

  headerMapping: Array<{ name: string; location: string[] }> = [
    { name: 'status', location: ['ups', 'status'] },
    { name: 'runtime', location: ['battery', 'runtime'] },
    { name: 'battery_charge', location: ['battery', 'charge', '_value'] },
    { name: 'load', location: ['ups', 'load'] },
    { name: 'realpower', location: ['ups', 'realpower'] },
    { name: 'input_frequency', location: ['input', 'frequency'] },
    { name: 'input_voltage', location: ['input', 'voltage', '_value'] },
    { name: 'output_frequency', location: ['output', 'frequency', '_value'] },
    { name: 'output_voltage', location: ['output', 'voltage', '_value'] },
  ];

  abstract send(d: UPS): void;
  abstract close(): void;
}

export default Plugin;

export const load = async (): Promise<Plugin[]> => {
  // Get rid of index.ts and index.test.ts
  const plugins = (await readdir(__dirname)).filter((file) => !file.includes('index'));

  const validPlugins = await Promise.all(
    plugins.map(async (plugin) => {
      const pluginPath = path.join(__dirname, plugin);
      const pluginModule = await import(pluginPath);
      const pluginClass = pluginModule.default;

      // Ignore non-plugin files
      if (!(pluginClass.prototype instanceof Plugin)) {
        logger.log({
          level: 'warn',
          message: `${plugin} is not a valid plugin`,
        });
        return null;
      }

      // Default prefix is the plugin class name is fot defined explicitly
      const envPrefix = pluginClass._prefix || pluginClass.name;
      const env = parseEnv(envPrefix);

      try {
        checkConfig(env, pluginClass._model, envPrefix);
        const pluginInstance = new pluginClass(env); // Inject env in constructor
        return pluginInstance;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error.';
        logger.log({
          level: 'warn',
          message,
        });
        return null;
      }
    }),
  );

  return validPlugins.filter((plugin) => plugin !== null) as Plugin[];
};
