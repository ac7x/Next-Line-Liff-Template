// Removed import: import type { Message } from '@line/liff';

// Define a minimal interface or use any if structure is complex/variable
type LiffMessageContent = any;

export class LiffMessage {
  // Accept a more generic type
  constructor(private readonly messages: LiffMessageContent[]) {
    if (!messages || messages.length === 0 || messages.length > 5) {
      throw new Error('Messages cannot be empty and must be 1 to 5 messages.');
    }
    this.validateMessages(messages);
  }

  private validateMessages(messages: LiffMessageContent[]): void {
    for (const message of messages) {
      if (!message.type) {
        throw new Error('Message type is required');
      }
    }
  }

  // Return the generic type
  public get value(): LiffMessageContent[] {
    return this.messages;
  }
}
