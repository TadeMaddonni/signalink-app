// Rutas relacionadas con mensajes
export const MESSAGE_ROUTES = {
  // Mensajes de texto
  SEND_TEXT: '/messages/text',
  
  // Mensajes de audio
  SEND_AUDIO: '/messages/audio',
  
  // Conversaciones
  GET_CONVERSATION: '/messages/conversation/:user1_id/:user2_id',
  
  // Mensajes por grupo
  GET_GROUP_MESSAGES: '/messages/group/:group_id',
} as const;

export type MessageRoute = typeof MESSAGE_ROUTES[keyof typeof MESSAGE_ROUTES];
export type MessageRouteKey = keyof typeof MESSAGE_ROUTES;