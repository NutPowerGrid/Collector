import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [
    new transports.File({ filename: 'log/error.log', level: 'error' }),
    new transports.Console()
  ]
})

export default logger