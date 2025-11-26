# SignaLink App 🧤

SignaLink es una aplicación móvil desarrollada con **Expo** y **React Native** que permite la comunicación mediante señas, conectando con un guante inteligente vía Bluetooth para traducir gestos a texto en tiempo real.

## 📋 Características principales

- 🧤 **Conexión Bluetooth** con guante SignaLink
- 💬 **Chat en tiempo real** con traducción de señas
- 👥 **Grupos de conversación**
- 🌍 **Soporte multi-idioma** (i18n)
- 🎨 **Interfaz moderna** con React Native Paper
- 📱 **Compatible con Android e iOS**

## 🚀 Instalación y configuración

### Prerrequisitos

- **Node.js** 18+
- **npm** o **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI**: `npm install -g eas-cli`

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configuración para Development Build

Para usar las funcionalidades de Bluetooth, necesitas una **Development Build**:

```bash
# Configurar EAS (solo la primera vez)
eas login
eas build:configure

# Generar build para Android
eas build --profile development --platform android
```

### 3. Ejecutar la aplicación

```bash
npx expo start --clear
```

## 📱 Ejecutar en Android

### Opción 1: Development Build (Recomendado para Bluetooth)

1. **Descarga e instala** la APK generada por EAS Build
2. **Ejecuta el servidor de desarrollo:**
   ```bash
   npx expo start
   ```
3. **Conecta la app:**
   - Abre la app SignaLink en tu dispositivo
   - Conecta a la URL mostrada (ej: `http://192.168.1.15:8081`)
   - O escanea el código QR desde la app

### Opción 2: Expo Go (Limitado)

```bash
npx expo start
# Presiona 's' para cambiar a Expo Go
# Escanea el QR con la app Expo Go
```

⚠️ **Nota:** Expo Go no soporta Bluetooth nativo, usar solo para desarrollo UI.

## 🔵 Configuración Bluetooth

### Dependencias instaladas

```json
{
  "react-native-ble-plx": "^3.5.0"
}
```

### Permisos Android

Los siguientes permisos están configurados en `app.json`:

```json
{
  "permissions": [
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.BLUETOOTH_SCAN",
    "android.permission.BLUETOOTH_CONNECT",
    "android.permission.BLUETOOTH_ADVERTISE"
  ]
}
```

### Configuración del guante SignaLink

El servicio Bluetooth está configurado para conectarse con:

- **Nombre del dispositivo:** `SignaLinkCM4`
- **Service UUID:** `12345678-1234-5678-1234-56789abcdef0`
- **Characteristic UUID:** `12345678-1234-5678-1234-56789abcdef2`

### Uso del servicio Bluetooth

```typescript
import BluetoothBLEService from "./src/services/bluetooth/BluetoothBLEService";

const bluetoothService = BluetoothBLEService.getInstance();

// Conectar al guante
await bluetoothService.connectToGlove({
  onDataReceived: (text: string) => {
    console.log("Texto recibido:", text);
  },
  onStatusChange: (status) => {
    console.log("Estado:", status);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});
```

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
├── contexts/           # Context API (Auth, etc.)
├── hooks/              # Custom hooks
├── screens/            # Pantallas de la app
├── services/           # Servicios (API, Bluetooth, etc.)
│   └── bluetooth/      # Servicio de conexión Bluetooth
├── types/              # Definiciones de tipos TypeScript
└── utils/              # Utilidades
```

## 🔧 Scripts disponibles

```bash
# Desarrollo
npm start                    # Iniciar servidor Expo
npm run android             # Ejecutar en Android (requiere emulador/dispositivo)
npm run ios                 # Ejecutar en iOS (requiere simulador/dispositivo)
npm run web                 # Ejecutar en navegador

# Build y deploy
eas build --platform android   # Build para Android
eas build --platform ios      # Build para iOS
eas submit --platform android # Subir a Play Store

# Utilidades
npm run reset-project       # Reset proyecto a estado inicial
npm run lint               # Ejecutar ESLint
```

## 🐛 Troubleshooting

### Error: "adb no se reconoce como comando"

Si obtienes este error al presionar 'a' en Expo CLI:

- **Solución:** Usa la Development Build directamente, no necesitas ADB
- **Alternativa:** Instala Android Studio y configura ANDROID_HOME

### Bluetooth no funciona en Expo Go

- **Causa:** Expo Go no soporta librerías nativas como `react-native-ble-plx`
- **Solución:** Usa Development Build con `eas build`

### Error de permisos Bluetooth en Android

- **Verifica** que los permisos estén en `app.json`
- **Acepta** los permisos cuando la app los solicite
- **En Android 12+:** Los permisos NEARBY_DEVICES se solicitan automáticamente

## 🔗 Recursos útiles

- [Expo documentation](https://docs.expo.dev/)
- [React Native BLE PLX](https://github.com/innoveit/react-native-ble-plx)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
