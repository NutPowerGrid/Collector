export const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g;
export const portRegex = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/g;
export const nameRegex = /^[a-zA-Z0-9/-]*$/g;

export interface modelValue {
  default?: string | number | boolean;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  min?: number;
  max?: number;
  regex?: RegExp;
}

export interface BaseModelObj {
  [key: string]: modelValue;
}

export const parseEnv = (prefix: string[]) => {
  const { env } = process;
  const res: { [key: string]: any } = {};
  prefix.forEach((pre) => {
    const checkValue = (v: string) => {
      const value = v.split(pre.toUpperCase(), 2)[1];
      if (!res[pre]) res[pre] = {};
      res[pre][value.slice(1)] = env[v];
    };
    Object.keys(env).forEach((v) => {
      if (v.includes(pre.toUpperCase())) checkValue(v);
    });
  });
  return res;
};

class EnvError extends Error {
  constructor(msg: string, modelN: string) {
    super(`${msg} -> ${modelN}`);
  }
}

export const checkConfig = (obj: { [key: string]: string | number | boolean }, model: BaseModelObj, modelName: string) => {
  if (!obj) throw new EnvError('No env var found', modelName);
  Object.keys(obj).forEach((v) => {
    const cProperty = model[v.toLocaleLowerCase()];
    const cValue = obj[v];
    if (cProperty) {
      if (!cValue && cProperty.required) throw new EnvError(`Missing ${v}`, modelName);
      else if (!cValue && cProperty.default) obj[v] = cProperty.default;
      else if (cProperty.type === 'boolean' && !(cValue === 'true' || cValue === 'false')) throw new EnvError(`Value ${v} should be an boolean (true, false)`, modelName);
      else if (cProperty.type === 'number') {
        const parsedInt = Number.parseInt(cValue.toString());
        if (Number.isNaN(parsedInt)) throw new Error(`Value ${v} should be an int (number)`);
        else if (cProperty.min && cProperty.min > parsedInt) throw new EnvError(`Value ${v} should be bigger than ${cProperty.min}`, modelName);
        else if (cProperty.max && cProperty.max < parsedInt) throw new EnvError(`Value ${v} should be lower than ${cProperty.max}`, modelName);
      } else if (cProperty.regex && !cValue.toString().match(cProperty.regex)) throw new EnvError(`Value ${v} don't respect naming rules`, modelName);
    } else throw new EnvError(`missing value '${v.toLocaleLowerCase()}'`, modelName);
  });
  return obj;
};
