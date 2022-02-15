import { promisify } from "util"
import { exec } from "child_process"
import parseDot from '@lv00/dot-parser'

const run = promisify(exec)

export default class Nut {
  readonly ip: string
  readonly port: string
  readonly name: string
  readonly CMD: string

  constructor({ NUT_UPS_NAME = "ups", NUT_IP = "127.0.0.1", NUT_PORT = "3493" }) {
    this.ip = NUT_IP;
    this.name = NUT_UPS_NAME;
    this.port = NUT_PORT;
    this.CMD = `upsc ${this.name}@${this.ip}:${this.port}`
    console.log(this.CMD)
  }

  async read() {
    const { stderr, stdout } = await run(this.CMD)
    if (stderr) throw new Error(stderr)
    const res = parseDot(stdout)
    if (!res) throw new Error('Unable to parse data from Nut')
    return res
  }
}

