import { BaseModelObj } from 'env';
import Plugin from './';
import Elysia, { t } from 'elysia';

class Buffer<t> extends Array<t> {
  protected max;
  constructor(max = 100) {
    super(0);
    this.max = max;
  }

  push(d: t) {
    this.unshift(d);
    if (this.length > this.max) this.pop();
    return this.length;
  }

  toString(): string {
    return JSON.stringify(this, null, 2);
  }

  toJSON(): t[] {
    return this.slice();
  }
}

export default class Api extends Plugin {
  static _prefix = 'Api';
  static _model: BaseModelObj = {
    port: {
      type: 'number',
      required: false,
      default: 3000,
    },
    buffer_size: {
      type: 'number',
      required: false,
      default: 100,
    },
  };

  app: Elysia | undefined;
  buffer;
  index = 0;

  constructor({ PORT, BUFFER_SIZE }: { PORT: number; BUFFER_SIZE: number }) {
    super();
    this.buffer = new Buffer<UPS>(BUFFER_SIZE);
    this.app = new Elysia()
      .get(
        '/',
        ({ query }) => {
          const max = parseInt(query.max || "10");
          return this.buffer.slice(0, max).toString();
        },
        {
          query: t.Partial(
            t.Object({
              max: t.String({ default: '10', }),
            })),
        },
      )
      .listen(PORT);
  }

  send(d: UPS): void {
    this.buffer.push(d);
  }
  close(): void {
    this.app?.stop();
  }
}
