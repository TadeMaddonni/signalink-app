# Sideloading iOS Apps (Sin Mac)

## Opción A: AltStore

### Requisitos:

- iPhone/iPad
- PC Windows o Mac
- Cable USB

### Pasos:

1. **Instala AltServer** en tu PC
2. **Instala AltStore** en iPhone vía AltServer
3. **Genera .ipa** usando EAS Build
4. **Sideload** con AltStore

```bash
# Generar .ipa
eas build --platform ios --profile production --non-interactive
```

## Opción B: Sideloadly

### Pasos:

1. **Descarga Sideloadly** (sideloadly.io)
2. **Conecta iPhone** a PC
3. **Carga .ipa** en Sideloadly
4. **Instala** usando tu Apple ID

## Limitaciones:

- ✅ Bluetooth funciona perfectamente
- ✅ No requiere Mac
- ✅ Funciona con Apple ID gratuito
- ❌ 7 días de validez (renovable)
- ❌ Máximo 3 apps simultáneas

## Comandos útiles:

```bash
# Build para sideloading
eas build --platform ios --profile production

# Ver builds
eas build:list --platform ios
```
