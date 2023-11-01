import { checkConfig, EnvError, BaseModelObj, parseEnv } from './env';
import { describe, it, expect } from 'bun:test';

describe('checkConfig', () => {
  const model: BaseModelObj = {
    PORT: {
      type: 'number',
      required: true,
      min: 3000,
      max: 4000,
    },
    IP: {
      type: 'string',
      required: true,
      regex: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g,
    },
    NAME: {
      type: 'string',
      required: false,
      default: 'test',
      regex: /^[a-zA-Z0-9/-]*$/g,
    },
    DEBUG: {
      type: 'boolean',
      required: false,
    },
  };

  it('should throw an error if no env var found', () => {
    expect(() => checkConfig({}, model, 'TestModel')).toThrow(EnvError);
  });

  it('should throw an error if a required env var is missing', () => {
    expect(() => checkConfig({ PORT: 3000 }, model, 'TestModel')).toThrow(EnvError);
  });

  it('should throw an error if a boolean env var is not a boolean', () => {
    expect(() => checkConfig({ PORT: 3000, IP: '127.0.0.1', NAME: 'test', DEBUG: 'not-a-boolean' }, { ...model, DEBUG: { type: 'boolean', required: true } }, 'TestModel')).toThrow(EnvError);
  });

  it('should throw an error if a number env var is not a number', () => {
    expect(() => checkConfig({ PORT: 'not-a-number', IP: '127.0.0.1', NAME: 'test' }, model, 'TestModel')).toThrow(EnvError);
  });

  it('should throw an error if a number env var is lower than the minimum', () => {
    expect(() => checkConfig({ PORT: 2999, IP: '127.0.0.1', NAME: 'test' }, model, 'TestModel')).toThrow(EnvError);
  });

  it('should throw an error if a number env var is higher than the maximum', () => {
    expect(() => checkConfig({ PORT: 4001, IP: '127.0.0.1', NAME: 'test' }, model, 'TestModel')).toThrow(EnvError);
  });

  it('should throw an error if a string env var does not match the regex', () => {
    expect(() => checkConfig({ PORT: 3000, IP: '127.0.0.1', NAME: 'test!' }, model, 'TestModel')).toThrow(EnvError);
  });

  it('should return the config object if all env vars are valid', () => {
    expect(checkConfig({ PORT: 3000, IP: '127.0.0.1', NAME: 'test' }, model, 'TestModel')).toEqual({ PORT: 3000, IP: '127.0.0.1', NAME: 'test' });
  });

  it('should set a default value if an optional env var is missing', () => {
    expect(checkConfig({ PORT: 3000, IP: '127.0.0.1', TEST: 'false' }, { ...model, TEST: { type: 'boolean', required: true } }, 'TestModel')).toEqual({
      PORT: 3000,
      IP: '127.0.0.1',
      TEST: false,
      NAME: 'test',
    });
  });
});

describe('parseEnv', () => {
  const prefix = 'TEST';

  process.env[`${prefix}_PORT`] = '3000';
  process.env[`${prefix}_IP`] = '127.0.0.1';
  process.env[`${prefix}_NAME`] = 'test';

  const expected = {
    PORT: '3000',
    IP: '127.0.0.1',
    NAME: 'test',
  };

  it('should return an object with the expected keys and values', () => {
    expect(parseEnv(prefix)).toEqual(expected);
  });

  it('should return an empty object if no matching env vars found', () => {
    const prefix2 = 'TEST2';
    expect(parseEnv(prefix2)).toEqual({});
  });

  it('should ignore env vars with incorrect prefix', () => {
    process.env['OTHER_PREFIX_PORT'] = '3000';
    expect(parseEnv(prefix)).toEqual(expected);
  });
});
