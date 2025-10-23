// Rutas de autenticación
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
} as const;

export type AuthRouteKey = keyof typeof AUTH_ROUTES;
export type AuthRoute = typeof AUTH_ROUTES[AuthRouteKey];