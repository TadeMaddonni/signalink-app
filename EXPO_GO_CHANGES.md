# Cambios temporales para usar Expo Go

## Cambios realizados para poder usar Expo Go en lugar de development build:

### eas.json
- ❌ Eliminado: `"developmentClient": true` del perfil "development"

### app.json  
- ❌ Eliminado: `"expo-dev-client"` de la lista de plugins

## Para volver al development build:

### eas.json
Agregar de nuevo en el perfil "development":
```json
"developmentClient": true,
```

### app.json
Agregar de nuevo en plugins (después de "expo-router"):
```json
"expo-dev-client",
```

## Notas:
- Con estos cambios, ahora puedes escanear el QR con la app **Expo Go** desde la App Store
- Recuerda que algunas funcionalidades nativas (como Bluetooth) pueden no funcionar completamente en Expo Go
- Para funcionalidad completa, deberás volver al development build y construir la app