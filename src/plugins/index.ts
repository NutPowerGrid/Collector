import { BaseModelObj, checkConfig, parseEnv } from '../env';
import { readdir } from 'node:fs/promises';
import logger from '../logger';
export const load = async (): Promise<Plugin[]> => {
  // List file from plugin folder
  const plugins = await readdir(__dirname);
  plugins.splice(
    plugins.findIndex((plugin) => plugin === 'index.js' || plugin === 'index.ts'),
    1,
  );

  // Require all plugin
  const pluginsClass = plugins.map((plugin) => require(`./${plugin}`));
  // Load env var
  const env_s = parseEnv(pluginsClass.map((plugin: any) => plugin.default._prefix));

  // Compare model of plugin to env var
  const validPlugins = pluginsClass.filter((plugin: any) => {
    const clAss = plugin.default;
    const env = env_s[clAss._prefix];
    try {
      checkConfig(env, clAss._model, clAss._prefix);
      return clAss;
    } catch (err: any) {
      logger.log({
        level: 'error',
        message: err.message,
      });
    }
  });

  const loaded = validPlugins.map((plugin: any) => {
    try {
      const clAss = plugin.default;
      const env = env_s[clAss._prefix];
      const obj = new clAss(env);
      return obj;
    } catch (err) {
      const error = err as Error;
      logger.log('warn', error);
      logger.log('warn', `${plugin.default._prefix} not loaded`);
    }
  });

  return loaded;
};

abstract class Plugin {
  static _model: BaseModelObj;
  static _prefix: string;
  static _loadEnv?: boolean = true;

  abstract send(d: UPS): void;
  abstract close(): void;
}

export default Plugin;
