import Plugin from 'plugins';
import fs from 'fs';
import logger from 'logger';
import { BaseModelObj } from 'env';

export default class Json extends Plugin {
  static _prefix = 'JSON';
  static _model: BaseModelObj = {
    path: {
      type: 'string',
      required: true,
    },
  };

  path: string;

  constructor({ PATH }: { PATH: string }) {
    super();
    this.path = PATH;
  }

  send(d: UPS) {
    const data = {
      date: new Date().toISOString(),
      data: d,
    };

    // Read the existing data from the file
    try {
      let dataArray = [];

      if (fs.existsSync(this.path)) {
        try {
          const fileData = fs.readFileSync(this.path, 'utf8');
          dataArray = JSON.parse(fileData);
        } catch (error) {
          logger.log({
            level: 'error',
            message: 'Malformed JSON file',
          });
        }
      }

      dataArray.push(data);
      fs.writeFileSync(this.path, JSON.stringify(dataArray), 'utf8');
    } catch (error) {
      logger.log({
        level: 'error',
        message: 'Unale to write data to JSON file',
      });
    }
  }

  close() {
    // Nothing to do here
    logger.log('info', 'Closing JSON plugin');
  }
}
