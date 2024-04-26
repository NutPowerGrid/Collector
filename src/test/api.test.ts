import { describe, it, expect, beforeAll } from 'bun:test';
import API from '../plugins/api';
import Plugin from 'plugins';

describe('API', () => {
  let api: Plugin;

  beforeAll(() => {
    api = new API({ PORT: 3000, BUFFER_SIZE: 100 });
  })

  it('should create an instance of the API class', () => {
    expect(api).toBeInstanceOf(API);
  });

  it('should add data to the buffer', () => {
    const data: UPS = {
      battery: { charge: { _value: "100" } },
    }
    for (let i = 0; i < 102; i++) {
      api.send(data);
    }
  });

  it('should return the data from the buffer', async () => {
    const json = await fetch('http://localhost:3000/')
      .then((res) => {
        return res.json();
      })

    expect(json).toBeArray();
    expect(json).toHaveLength(10);
    expect(json).toEqual(Array(10).fill({
      battery: { charge: { _value: "100" } },
    }));
  })

  it('should return the data from the buffer with a limit', async () => {
    const json = await fetch('http://localhost:3000/?max=105')
      .then((res) => {
        return res.json();
      })

    expect(json).toBeArray();
    expect(json).toHaveLength(100);
    expect(json).toEqual(Array(100).fill({
      battery: { charge: { _value: "100" } },
    }));
  })

  it('should close the API', () => {
    api.close();
  });

});
