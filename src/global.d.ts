export interface UPS {
  battery: Battery;
  device: Device;
  driver: Driver;
  input: Input;
  outlet: Outlet;
  output: Output;
  ups: UPSClass;
}

export interface Battery {
  charge: Charge;
  runtime: string;
  type: string;
}

export interface Charge {
  _value: string;
  low: string;
}

export interface Device {
  mfr: string;
  model: string;
  serial: string;
  type: string;
}

export interface Driver {
  name: string;
  parameter: Parameter;
  version: Version;
}

export interface Parameter {
  pollfreq: string;
  pollinterval: string;
  port: string;
  synchronous: string;
}

export interface Version {
  _value: string;
  data: string;
  internal: string;
}

export interface Input {
  frequency: string;
  transfer: Transfer;
  voltage: Voltage;
}

export interface Transfer {
  high: string;
  low: string;
}

export interface Voltage {
  _value: string;
  extended: string;
}

export interface Outlet {
  '1': The1;
  '2': The1;
  desc: string;
  id: string;
  switchable: string;
}

export interface The1 {
  desc: string;
  id: string;
  status: string;
  switchable: string;
}

export interface Output {
  frequency: Frequency;
  voltage: Frequency;
}

export interface Frequency {
  _value: string;
  nominal: string;
}

export interface UPSClass {
  beeper: Beeper;
  delay: Delay;
  firmware: string;
  load: string;
  mfr: string;
  model: string;
  power: Frequency;
  productid: string;
  realpower: string;
  serial: string;
  status: string;
  timer: Delay;
  vendorid: string;
}

export interface Beeper {
  status: string;
}

export interface Delay {
  shutdown: string;
  start: string;
}
