# 📦 Instalación de Dependencias Bluetooth BLE

## 1. Instalar react-native-ble-plx

Ejecuta el siguiente comando en la terminal dentro de tu proyecto:

```bash
npm install react-native-ble-plx
```

o si usas yarn:

```bash
yarn add react-native-ble-plx
```

## 2. Configurar Permisos para Android

Edita el archivo `android/app/src/main/AndroidManifest.xml` y agrega estos permisos:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permisos BLE necesarios -->
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <!-- Para Android 12+ (API 31+) -->
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />

    <!-- Features requeridas -->
    <uses-feature
        android:name="android.hardware.bluetooth_le"
        android:required="true" />

    <application>
        <!-- ... resto de la configuración -->
    </application>
</manifest>
```

## 3. Configurar Info.plist para iOS

Edita el archivo `ios/[NombreDeTuApp]/Info.plist` y agrega:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Esta app usa Bluetooth para conectarse al guante SignaLink y recibir gestos en tiempo real.</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>Esta app necesita acceso a Bluetooth para comunicarse con el dispositivo guante SignaLink.</string>
```

## 4. Limpiar y Reconstruir

Después de instalar las dependencias, es recomendable limpiar y reconstruir:

### Para Android:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Para iOS:

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

## 5. Configurar el Guante (Raspberry Pi)

El guante debe configurarse como dispositivo periférico BLE con:

- **Nombre del dispositivo**: `SignaLinkCM4`
- **Service UUID**: `12345678-1234-5678-1234-56789abcdef0`
- **Characteristic UUID**: `12345678-1234-5678-1234-56789abcdef2`

El guante debe transmitir los datos como strings UTF-8 codificados en Base64.

## 6. Testear la Conexión

Puedes usar **nRF Connect** (disponible en Play Store/App Store) para:

1. Verificar que el guante aparece como dispositivo BLE
2. Conectarte manualmente al guante
3. Leer las características y verificar que envía datos
4. Confirmar que los UUIDs coinciden con los configurados

## ⚠️ Importante

- En dispositivos **Android 6+**, necesitas activar la ubicación para escanear BLE
- En **iOS**, los permisos se solicitan automáticamente al usar BLE por primera vez
- El guante debe estar **encendido y en modo advertise** antes de intentar conectar
- La app solo funciona en **dispositivos físicos**, no en simuladores/emuladores
