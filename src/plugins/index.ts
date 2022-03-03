import { BaseModelObj, checkConfig, parseEnv } from '../env';
import { readdir } from 'fs/promises';
import { PluginError } from '../term';
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
  let errors: PluginError[] = [];
  const validPlugins = pluginsClass.filter((plugin: any) => {
    const clAss = plugin.default;
    const env = env_s[clAss._prefix];
    try {
      checkConfig(env, clAss._model, clAss._prefix);
      return clAss;
    } catch (err) {
      const error = err as PluginError;
      errors.push(error);
    }
  });

  PluginError.print(errors);

  const loaded = validPlugins.map((plugin: any) => {
    try {
      const clAss = plugin.default;
      const env = env_s[clAss.__prefix];
      return new clAss(env);
    } catch (err) {
      const error = err as Error;
      console.log(`${error.message} -> ${plugin.default.__prefix} not loaded`);
    }
  });

  return loaded;
};

abstract class Plugin {
  static _model: BaseModelObj;
  static _prefix: string;
  static _loadEnv?: boolean = true;
  abstract send(d: any): void;
}

export default Plugin;
