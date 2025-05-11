export class LiffFriendship {
  constructor(private readonly friendFlag: boolean) {}

  public get value(): boolean {
    return this.friendFlag;
  }
}
