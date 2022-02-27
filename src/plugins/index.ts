import { BaseModelObj, checkConfig, parseEnv } from '../env';
import { readdir } from 'fs/promises';

export const load = async ():Promise<Plugin[]> => {
  const plugins = await readdir(__dirname);
  plugins.splice(plugins.findIndex(plugin => plugin === "index.js" || plugin === "index.ts"), 1)

  const pluginsClass = plugins.map(plugin => require(`./${plugin}`))
  const env_s = parseEnv(pluginsClass.map((plugin: any) => plugin.default.__prefix))

  return pluginsClass.map((plugin: any) => {
    const clAss = plugin.default;
    const env = env_s[clAss.__prefix]
    if (clAss.__model) checkConfig(env, clAss.__model, clAss.__prefix)
    return new clAss(env)
  })

}

abstract class Plugin {
  model?: BaseModelObj
  static __prefix: string;
  abstract send(d: any): void
}

export default Plugin;