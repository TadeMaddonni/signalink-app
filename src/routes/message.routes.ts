// Rutas relacionadas con mensajes
export const MESSAGE_ROUTES = {
  // Mensajes en grupos - Nuevas rutas según API
  GET_GROUP_MESSAGES: (groupId: number) => `/groups/${groupId}/messages`,
  CREATE_GROUP_MESSAGE: (groupId: number) => `/groups/${groupId}/messages`,

  // Text-to-Speech
  TEXT_TO_SPEECH: '/messages/text-to-speech',

  // Rutas legacy (mantener por compatibilidad)
  SEND_TEXT: '/messages/text',
  SEND_AUDIO: '/messages/audio',
  GET_CONVERSATION: '/messages/conversation/:user1_id/:user2_id',
  GET_GROUP_MESSAGES_LEGACY: '/messages/group/:group_id',
} as const;

export type MessageRoute = typeof MESSAGE_ROUTES[keyof typeof MESSAGE_ROUTES];
export type MessageRouteKey = keyof typeof MESSAGE_ROUTES;