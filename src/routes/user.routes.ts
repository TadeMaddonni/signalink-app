// Rutas de usuario
export const USER_ROUTES = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  SEARCH: '/users/search',
} as const;

export type UserRouteKey = keyof typeof USER_ROUTES;
export type UserRoute = typeof USER_ROUTES[UserRouteKey];