export class PluginError extends Error {
  reason: string;
  pluginName: any;
  constructor(reason: string, pluginName: string) {
    super(`[ERROR] ${reason} -> ${pluginName}`);
    this.reason = reason;
    this.pluginName = pluginName;
  }

  static print(errors: PluginError[]) {
    const maxLengthReason = Math.max(...errors.map((err) => err.reason.length));
    errors.forEach((err) => {
      let message = err.reason.concat([''].fill(' ', 0, maxLengthReason - err.reason.length).toString());
      if (message.length !== err.reason.length) message += ' ';
      console.error(`[Error] ${message} -> ${err.pluginName}`);
    });
  }
}
