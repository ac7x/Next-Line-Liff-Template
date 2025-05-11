export class LiffId {
    private readonly value: string;

    constructor(value: string) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
            throw new Error('LIFF ID 不可為空');
        }
        // 可加上格式驗證
        this.value = value.trim();
    }

    getValue(): string {
        return this.value;
    }

    equals(other: LiffId): boolean {
        return this.value === other.value;
    }
}