export { };

declare global {
  interface UPS {
    battery: Battery;
    device: Device;
    driver: Driver;
    input: Input;
    outlet: Outlet;
    output: Output;
    ups: UPSClass;
  }

  interface Battery {
    charge: Charge;
    runtime: string;
    type: string;
  }

  interface Charge {
    _value: string;
    low: string;
  }

  interface Device {
    mfr: string;
    model: string;
    serial: string;
    type: string;
  }

  interface Driver {
    name: string;
    parameter: Parameter;
    version: Version;
  }

  interface Parameter {
    pollfreq: string;
    pollinterval: string;
    port: string;
    synchronous: string;
  }

  interface Version {
    _value: string;
    data: string;
    internal: string;
  }

  interface Input {
    frequency: string;
    transfer: Transfer;
    voltage: Voltage;
  }

  interface Transfer {
    high: string;
    low: string;
  }

  interface Voltage {
    _value: string;
    extended: string;
  }

  interface Outlet {
    '1': The1;
    '2': The1;
    desc: string;
    id: string;
    switchable: string;
  }

  interface The1 {
    desc: string;
    id: string;
    status: string;
    switchable: string;
  }

  interface Output {
    frequency: Frequency;
    voltage: Frequency;
  }

  interface Frequency {
    _value: string;
    nominal: string;
  }

  interface UPSClass {
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

  interface Beeper {
    status: string;
  }

  interface Delay {
    shutdown: string;
    start: string;
  }
}
