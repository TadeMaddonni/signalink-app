// Rutas relacionadas con grupos
export const GROUP_ROUTES = {
  CREATE: '/groups/',
  UPDATE: '/groups/:group_id',
  GET_BY_USER: '/groups/user/:user_id',  // Obtener grupos del usuario (miembro)
  GET_BY_OWNER: '/groups/owner/:owner_id', // Obtener grupos del propietario (deprecated, usar GET_BY_USER)
  GET_MEMBERS: '/groups/:group_id/members',
  ADD_MEMBER: '/groups/:group_id/members',
  DELETE_MEMBER: '/groups/:group_id/members/:user_id',
} as const;

// Tipos para las rutas de grupos
export type GroupRoute = typeof GROUP_ROUTES[keyof typeof GROUP_ROUTES];
export type GroupRouteKey = keyof typeof GROUP_ROUTES;