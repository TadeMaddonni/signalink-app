import { API_ROUTES } from '../../routes';

// Configuración de la API
export const API_CONFIG = {
  // Siempre usa la URL de producción en Google Cloud
  BASE_URL:  'https://signalink-877641582061.us-central1.run.app/api', //''http://172.20.10.3:8080/api' ,
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
  // En desarrollo y producción usa BASE_URL
  return API_CONFIG.BASE_URL;
};

// Helper para construir URL completa
export const buildFullUrl = (route: string): string => {
  return `${getApiUrl()}${route}`;
};