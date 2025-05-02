export class LiffContext {
  constructor(
    private readonly context: {
      // Added 'square_chat' and 'external' based on potential SDK values
      type: 'utou' | 'room' | 'group' | 'none' | 'square_chat' | 'external';
      viewType: 'compact' | 'tall' | 'full';
      userId?: string;
      utouId?: string;
      roomId?: string;
      groupId?: string;
      // Add other potential properties like squareChatId, availability
      squareChatId?: string;
      availability?: {
         shareTargetPicker?: {
           permission: boolean;
           minVer: string;
         }
      }
    }
  ) {}

  public get value() {
    return this.context;
  }

  public isOneToOne(): boolean {
    return this.context.type === 'utou';
  }

  public isRoom(): boolean {
    return this.context.type === 'room';
  }

  public isGroup(): boolean {
    return this.context.type === 'group';
  }

  public isSquareChat(): boolean {
    return this.context.type === 'square_chat';
  }

  public isExternal(): boolean {
    return this.context.type === 'external';
  }
}
