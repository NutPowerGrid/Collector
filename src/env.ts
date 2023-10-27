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

export const parseEnv = (prefix: string) => {
  const { env } = process;
  const res: { [key: string]: string | undefined } = {};
  Object.keys(env).forEach((v) => {
    if (v.includes(prefix.toUpperCase())) {
      const value = v.split(prefix.toUpperCase(), 2)[1];
      res[value.slice(1)] = env[v];
    }
  });
  return res;
};

export class EnvError extends Error {
  constructor(msg: string, modelN: string) {
    super(`${msg} -> ${modelN}`);
  }
}

export const checkConfig = (obj: { [key: string]: string | undefined }, model: BaseModelObj, modelName: string) => {
  if (!obj) throw new EnvError('No env var found', modelName);

  const checkedObj: { [key: string]: string | number | boolean } = {};

  Object.entries(model).forEach(([key, value]) => {
    const uKey = key.toUpperCase();
    const envVarValue = obj[uKey];

    if (value.required && !envVarValue) {
      throw new EnvError(`Missing required environment variable: ${uKey}`, modelName);
    }

    if (!envVarValue && value.default) {
      checkedObj[uKey] = value.default;
      return;
    }
    else if (!envVarValue) {
      return;
    }

    if (value.type === 'boolean') {
      if (envVarValue === 'true') {
        checkedObj[uKey] = true;
      } else if (envVarValue === 'false') {
        checkedObj[uKey] = false;
      } else {
        throw new EnvError(`Invalid boolean value for ${uKey}: ${envVarValue}`, modelName);
      }
    } else if (value.type === 'number') {
      const parsedValue = parseInt(envVarValue.toString(), 10);

      if (isNaN(parsedValue)) {
        throw new EnvError(`Invalid number value for ${uKey}: ${envVarValue}`, modelName);
      }

      if (value.min !== undefined && parsedValue < value.min) {
        throw new EnvError(`Value for ${uKey} must be greater than or equal to ${value.min}`, modelName);
      }

      if (value.max !== undefined && parsedValue > value.max) {
        throw new EnvError(`Value for ${uKey} must be less than or equal to ${value.max}`, modelName);
      }

      checkedObj[uKey] = parsedValue;
    } else if (value.type === 'string') {
      if (value.regex && !envVarValue.toString().match(value.regex)) {
        throw new EnvError(`Invalid value for ${uKey}: ${envVarValue}`, modelName);
      }

      checkedObj[uKey] = envVarValue;
    }
  });

  return checkedObj;
};
