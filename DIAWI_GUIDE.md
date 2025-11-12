# Guía Diawi para iOS Testing

## ¿Qué es Diawi?

Servicio que permite instalar apps iOS sin App Store ni TestFlight.

## Pasos:

### 1. Crear build local con Xcode (requiere Mac)

```bash
npx expo run:ios --configuration Release
```

### 2. Generar .ipa

- Abrir Xcode
- Product → Archive
- Distribute → Ad Hoc
- Exportar .ipa

### 3. Subir a Diawi

- Ve a diawi.com
- Sube el .ipa
- Obtén link de instalación

### 4. Instalar en iPhone

- Abre Safari en iPhone
- Ve al link de Diawi
- Toca "Instalar"
- Confía en el perfil en Configuración

## Limitaciones:

- ✅ Bluetooth funciona
- ✅ No requiere Apple Developer pago
- ❌ Requiere Mac con Xcode
- ❌ 7 días de validez
- ❌ Solo tu dispositivo
