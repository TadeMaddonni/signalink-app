# 🧪 Guía de Testeo - Conectividad Bluetooth SignaLink

## 📱 Cómo Testear el Flujo Completo

### 1. Preparación del Entorno

**Requisitos:**

- ✅ Dispositivo Android/iOS físico (no emulador)
- ✅ Guante SignaLink encendido y funcionando
- ✅ Permisos de Bluetooth y ubicación otorgados
- ✅ Usuario registrado como `glove_user`

### 2. Testeo Paso a Paso

#### Paso 1: Verificar la UI

1. **Abrir la app** y hacer login con usuario `glove_user`
2. **Navegar** a cualquier grupo o chat
3. **Verificar** que aparece el botón **"Conectar Guante"** con ícono de mano 🖐️
4. **Confirmar** que no hay botón de transcripción de voz

#### Paso 2: Probar Conexión

1. **Presionar "Conectar Guante"**
2. **Observar** los estados en pantalla:
   ```
   🔍 Buscando guante SignaLink...
   🔄 Conectando al guante...
   ✅ Conectado a SignaLinkCM4 (-XX dBm)
   ```
3. **El botón** debe cambiar a **"Desconectar"** con ícono Bluetooth 🔵

#### Paso 3: Recibir Datos

1. **Activar gestos** en el guante
2. **Verificar** que aparece el texto recibido:
   ```
   🧤 Texto del guante:
   [Texto procesado desde la Raspberry]
   ```
3. **Confirmar** que el texto se envía **automáticamente** como mensaje al chat
4. **El texto** debe aparecer en el chat como mensaje normal

#### Paso 4: Probar Reconexión

1. **Apagar/alejar** el guante para simular desconexión
2. **Verificar** mensaje de error: `❌ Conexión perdida`
3. **Observar** intentos automáticos de reconexión
4. **Volver a encender** el guante y confirmar reconexión automática

### 3. Casos de Prueba Específicos

#### ✅ Test 1: Primera Conexión

```
Input: Usuario presiona "Conectar Guante"
Expected: Escaneo → Conexión → "✅ Conectado"
```

#### ✅ Test 2: Recepción de Datos

```
Input: Guante envía "Hola mundo"
Expected: Aparece en preview → Se envía automáticamente al chat
```

#### ✅ Test 3: Desconexión Manual

```
Input: Usuario presiona "Desconectar"
Expected: Desconexión inmediata → Botón vuelve a "Conectar Guante"
```

#### ✅ Test 4: Pérdida de Conexión

```
Input: Guante se aleja/apaga
Expected: "❌ Conexión perdida" → Reintentos automáticos
```

#### ✅ Test 5: Permisos Denegados

```
Input: Usuario niega permisos Bluetooth
Expected: "Permisos de Bluetooth requeridos"
```

### 4. Logs de Debugging

Busca estos logs en la consola para debug:

```bash
# Conexión exitosa
✅ 🔍 Iniciando escaneo del guante...
✅ 🧤 Guante detectado: SignaLinkCM4 (aa:bb:cc:dd:ee:ff)
✅ 📶 RSSI: -45 dBm
✅ 🔗 Conectando al guante SignaLinkCM4...
✅ ✅ Conectado al guante
✅ 📡 Configurando recepción de datos...
✅ 📩 Texto recibido: "Hola desde SignaLinkCM4"

# Errores comunes
❌ Tiempo de escaneo agotado. ¿El guante está encendido?
❌ Permisos de Bluetooth requeridos
❌ Bluetooth desactivado. Actívalo para continuar.
```

### 5. Testeo con nRF Connect

**Para verificar el guante por separado:**

1. **Instalar nRF Connect** desde Play Store/App Store
2. **Escanear dispositivos** BLE cercanos
3. **Buscar "SignaLinkCM4"** en la lista
4. **Conectarse** manualmente al dispositivo
5. **Verificar Service UUID**: `12345678-1234-5678-1234-56789abcdef0`
6. **Suscribirse** a la característica: `12345678-1234-5678-1234-56789abcdef2`
7. **Activar notificaciones** y verificar que llegan datos

### 6. Solución de Problemas

#### 🚨 Problema: "Guante no encontrado"

- ✅ Verificar que el guante está encendido
- ✅ Confirmar que está en modo advertise
- ✅ Comprobar los UUIDs de servicio y característica
- ✅ Probar con nRF Connect primero

#### 🚨 Problema: "No se conecta"

- ✅ Verificar permisos de ubicación (Android)
- ✅ Confirmar que Bluetooth está activado
- ✅ Reiniciar Bluetooth en el dispositivo
- ✅ Comprobar que no hay otras apps conectadas al guante

#### 🚨 Problema: "Datos no llegan"

- ✅ Verificar que la característica tiene notificaciones habilitadas
- ✅ Confirmar que el guante envía datos en Base64 UTF-8
- ✅ Comprobar logs de la app para errores de decodificación

### 7. Criterios de Éxito

Una implementación exitosa debe cumplir:

- ✅ **Detección automática** del guante en <10 segundos
- ✅ **Conexión estable** con reconexión automática
- ✅ **Recepción en tiempo real** de datos del guante
- ✅ **Envío automático** de mensajes al chat
- ✅ **UI responsive** con indicadores claros de estado
- ✅ **Manejo de errores** con mensajes informativos
- ✅ **Cleanup apropiado** al salir de la pantalla

¡Con esta configuración, tu app SignaLink estará lista para recibir gestos del guante en tiempo real! 🎉
