// Define a minimal interface or use any
type LiffShareMessageContent = any;

export class LiffShareTargetPicker {
  // Accept a more generic type
  constructor(private readonly messages: LiffShareMessageContent[]) {
    if (!messages || messages.length === 0 || messages.length > 5) {
      throw new Error('Messages cannot be empty and must be 1 to 5 messages.');
    }
    // Add further validation if needed based on LIFF specs
  }

  // Return the generic type
  public get value(): LiffShareMessageContent[] {
    return this.messages;
  }
}
