import { API_ROUTES } from '../../routes';

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.41:8080/api', // Cambia esto por la URL de tu backend
  ROUTES: API_ROUTES,
  TIMEOUT: 10000, // 10 segundos
  REQUEST_TIMEOUT: 30000, // 30 segundos para requests largos
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Headers para autenticación
export const getAuthHeaders = (token?: string) => ({
  ...DEFAULT_HEADERS,
  ...(token && { Authorization: `Bearer ${token}` }),
});

// Configuración de desarrollo vs producción
export const getApiUrl = (): string => {
  if (__DEV__) {
    // En desarrollo, puedes usar la IP de tu computadora
    // return 'http://192.168.1.100:3000'; // Reemplaza con tu IP local
    return API_CONFIG.BASE_URL;
  }
  
  // En producción, usa la URL real de tu API
  return 'https://your-production-api.com';
};

// Helper para construir URL completa
export const buildFullUrl = (route: string): string => {
  return `${getApiUrl()}${route}`;
};