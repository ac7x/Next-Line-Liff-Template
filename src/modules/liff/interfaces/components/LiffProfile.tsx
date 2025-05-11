import { LiffProfile as LiffProfileType } from '@/modules/liff/domain/valueObjects/liff-profile';

interface LiffProfileProps {
  profile: LiffProfileType;
  friendship: { friendFlag: boolean };
}

export function LiffProfile({ profile, friendship }: LiffProfileProps) {
  return (
    <div className="w-full max-w-md mx-auto rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-start space-x-6">
        {/* Profile Image Section */}
        <div className="flex-shrink-0">
          {profile?.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl">No Image</span>
            </div>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-800 mb-2">{profile?.displayName}</h4>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">ID:</span>
              <span className="ml-2">{profile?.userId}</span>
            </div>
            {profile?.statusMessage && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>
                <p className="mt-1 text-gray-700">{profile.statusMessage}</p>
              </div>
            )}
            <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm
              ${friendship?.friendFlag ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {friendship?.friendFlag ? '已成為好友' : '尚未成為好友'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
