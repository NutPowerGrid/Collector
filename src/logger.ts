import { Log } from '@lv00/toolkit';

const { Logger, Console, File, Level } = Log;

const l = [
  Level.INFO,
  Level.WARN,
  Level.ERROR,
  Level.OK,
];

if (process.env.NODE_ENV === 'development') {
  l.push(Level.DEBUG);
}

const logger = new Logger(
  {
    t: [
      new Console({ l }),
      new File({ l, path: 'info.log' }),
    ]
  }
);


export default logger;
export { Level };