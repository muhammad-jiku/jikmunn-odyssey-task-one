export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
