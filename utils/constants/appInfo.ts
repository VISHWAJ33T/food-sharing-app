export enum APP_ROUTES {
  home = '/',
  login = '/login',
  logout = '/logout',
  signup = '/signup'
}
export enum GLOBAL_ROUTES {}
export enum APP_SOCIAL {}

export enum LOCAL_STORAGE {
  user = 'app_user'
}

export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'
