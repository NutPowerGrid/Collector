import { checkConfig, EnvError, BaseModelObj } from './env';
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
      regex: /^[a-zA-Z0-9/-]*$/g,
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
    expect(checkConfig({ PORT: 3000, IP: '127.0.0.1' }, { ...model, NAME: { type: 'string', required: false, default: 'default-name' } }, 'TestModel')).toEqual({
      PORT: 3000,
      IP: '127.0.0.1',
      NAME: 'default-name',
    });
  });
});
