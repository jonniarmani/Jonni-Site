import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: any | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
}

// Simple state management for auth
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user: user }),
}));

// OAuth Initialization Helper
declare const google: any;

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "";
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send'
].join(' ');

export const initializeTokenClient = (callback: (token: string) => void) => {
  if (typeof google === 'undefined') {
    console.error('Google Identity Services script not loaded');
    return null;
  }

  return google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: any) => {
      if (response.access_token) {
        callback(response.access_token);
      }
    },
  });
};
