import { LiffProfile as LiffProfileType } from '@/domain/liff/valueObjects/LiffProfile';

interface LiffProfileProps {
  profile: LiffProfileType; // 使用領域值物件作為類型
  friendship: { friendFlag: boolean };
}

export function LiffProfile({ profile, friendship }: LiffProfileProps) {
  return (
    <div className="w-full rounded bg-white p-4 shadow">
      <h4 className="mb-2 text-lg font-bold">Profile</h4>
      <div>userId: {profile?.userId}</div>
      <div>displayName: {profile?.displayName}</div>
      <div>statusMessage: {profile?.statusMessage}</div>
      {profile?.pictureUrl && (
        <img
          src={profile?.pictureUrl}
          alt="pictureUrl"
          className="mt-4 h-24 w-24 rounded-full object-cover"
        />
      )}
      <div className="mt-2">Is OA&apos;s Friend: {friendship?.friendFlag ? 'true' : 'false'}</div>
    </div>
  );
}
