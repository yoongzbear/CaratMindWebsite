import { SessionUser } from '@/types/user';
// import type { CognitoTokens, CognitoUserProfile } from '@/lib/cognito/server';

// export type SessionUser = {
//   username: string;
//   email?: string;
//   preferredUsername?: string;
// };

export type CognitoTokens = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
};
export type UserProfile = {
  username: string;
  email: string;
  preferredUsername: string;
  completedOnboarding: string;
};

export function buildSessionPayload(
  tokens: CognitoTokens,
  profile: UserProfile,
) {
  const user: SessionUser = {
    username: profile.username,
    email: profile.email,
    preferredUsername: profile.preferredUsername,
    completedOnboarding: profile.completedOnboarding,
  };

  return {
    accessToken: tokens.accessToken,
    expiresIn: tokens.expiresIn,
    user,
  };
}
