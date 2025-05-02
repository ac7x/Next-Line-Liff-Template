// This value object now holds an 'any' type, assuming the caller provides
// a valid LIFF plugin object. More robust typing would involve defining
// interfaces matching LiffPlugin structure.
export class LiffUse {
  constructor(
    private readonly pluginInstance: any // Simplified to hold the plugin object directly
  ) {
    if (!pluginInstance || typeof pluginInstance.install !== 'function') {
       throw new Error('Invalid LIFF plugin provided to LiffUse');
    }
  }

  public get value(): any {
    return this.pluginInstance;
  }
}
