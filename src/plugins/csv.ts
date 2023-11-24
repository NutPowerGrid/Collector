import Plugin from 'plugins';
import fs from 'fs';
import logger from 'logger';
import { BaseModelObj } from 'env';
import { CSV } from 'csv';

export default class CSVPlugin extends Plugin {
  static _prefix = 'CSV';
  static _model: BaseModelObj = {
    path: {
      type: 'string',
      required: true,
    },
  };

  path: string;
  csv: CSV;

  constructor({ PATH }: { PATH: string }) {
    super();
    this.path = PATH;

    const header = ['date'].concat(this.headerMapping.map((h) => h.name));
    this.csv = new CSV({ header });
  }

  send(d: UPS) {
    this.csv.addSequentially(new Date().toISOString());

    this.headerMapping.forEach(({ location }) => {
      const value = location.reduce((acc, cur) => (acc as any)[cur], d as any);
      this.csv.addSequentially(value);
    });

    // Write the CSV to the file
    if (!fs.existsSync(this.path) || fs.statSync(this.path).size === 0) {
      const csvString = this.csv.toString(';');
      fs.writeFileSync(this.path, csvString, 'utf8');
    } else {
      const csvString = '\r\n' + this.csv.toString(';', false);
      fs.appendFileSync(this.path, csvString, 'utf8');
      //remove points written to csv
      this.csv.clear();
    }
  }

  close() {
    // Nothing to do here
    logger.log('info', 'Closing CSV plugin');
  }
}
