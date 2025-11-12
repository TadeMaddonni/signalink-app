# 📱 Guía Simple para Testear en iOS - SignaLink

## 🎯 Opciones Recomendadas (Sin Cuenta Apple Developer)

### Opción 1: TestFlight con Build Simulado (Recomendado)

Si tienes un iPhone y quieres la experiencia completa:

#### 1. Crear el Build

```bash
# En tu terminal
eas build --platform ios --profile preview --no-wait
```

Cuando te pregunte por login de Apple, responde **"no"**.
EAS usará credenciales temporales automáticamente.

#### 2. Una vez que termine el build:

1. **Recibirás una URL** con el archivo `.ipa`
2. **Sube a TestFlight** o usa **Diawi** para distribución:
   - Ve a [diawi.com](https://www.diawi.com/)
   - Sube el archivo `.ipa`
   - Comparte el link generado contigo mismo
   - Abre en Safari desde tu iPhone y descarga

#### 3. Instalar en iPhone:

1. **Configuración > General > VPN y gestión de dispositivos**
2. **Confía en el perfil** de desarrollador
3. **Abre la app** SignaLink

### Opción 2: Solo UI Testing con Expo Go

Para testear rápidamente la interfaz (sin Bluetooth):

#### 1. Instalar Expo Go

Descarga **Expo Go** desde la App Store

#### 2. Iniciar servidor

```bash
npx expo start
```

#### 3. Escanear QR

- **Abre Expo Go** en tu iPhone
- **Escanea el QR** que aparece en terminal
- ⚠️ **Limitación**: La conexión Bluetooth NO funcionará

### Opción 3: Simulador iOS (Solo Interfaz)

Si tienes Mac o acceso a uno:

```bash
npx expo run:ios
```

⚠️ **Limitación**: Solo para testear interfaz, Bluetooth no funciona en simulador.

## 🔧 Testing Específico para iOS

### Con Build Completo (Opción 1):

1. **Testa la UI completa** siguiendo `BLUETOOTH_TESTING.md`
2. **Verifica permisos** de Bluetooth (aparecerán automáticamente)
3. **Conecta al guante** SignaLink y prueba recepción de datos
4. **Confirma integración** con el chat

### Con Expo Go (Opción 2):

1. **Solo testa la interfaz** - botones, navegación, estados
2. **Simula conexión** - los estados de UI deberían aparecer
3. **NO** intentes conectar al guante (dará error)

## 🚀 Recomendación

**Para testing completo**: Usa la **Opción 1** (EAS Build + TestFlight/Diawi)

**Para testing rápido de UI**: Usa la **Opción 2** (Expo Go)

## ❓ ¿Necesitas ayuda?

Si tienes problemas con cualquiera de estos métodos, puedo ayudarte paso a paso con el que prefieras.
