// Importar las rutas
import { AUTH_ROUTES } from './auth.routes';
import { GROUP_ROUTES } from './group.routes';
import { MESSAGE_ROUTES } from './message.routes';
import { USER_ROUTES } from './user.routes';

// Exportar todas las rutas desde un punto central
export { AUTH_ROUTES } from './auth.routes';
export { GROUP_ROUTES } from './group.routes';
export { MESSAGE_ROUTES } from './message.routes';
export { USER_ROUTES } from './user.routes';

// Exportar tipos
export type { AuthRoute, AuthRouteKey } from './auth.routes';
export type { GroupRoute, GroupRouteKey } from './group.routes';
export type { MessageRoute, MessageRouteKey } from './message.routes';
export type { UserRoute, UserRouteKey } from './user.routes';

// Todas las rutas agrupadas
export const API_ROUTES = {
  AUTH: AUTH_ROUTES,
  USER: USER_ROUTES,
  GROUP: GROUP_ROUTES,
  MESSAGE: MESSAGE_ROUTES,
} as const;

// Helper para construir URLs con parámetros
export const buildRouteWithParams = (route: string, params: Record<string, string | number>): string => {
  let finalRoute = route;

  Object.entries(params).forEach(([key, value]) => {
    finalRoute = finalRoute.replace(`:${key}`, String(value));
  });

  return finalRoute;
};

// Ejemplo: buildRouteWithParams('/user/:id/profile', { id: 123 }) => '/user/123/profile'