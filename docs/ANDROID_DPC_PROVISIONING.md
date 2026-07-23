# Guía de Provisionamiento Android Device Owner & Google Enterprise EMM

Documento oficial de procedimientos para asignar el agente `io.centryx.mdm` como **Device Owner** (Propietario del Dispositivo) en los 500 teléfonos corporativos.

---

## 🔒 1. Métodos de Provisionamiento Soportados

Existen 3 métodos para enrolar dispositivos en modo **Device Owner**:

### Método A: Enrolamiento vía Código QR (Recomendado para equipos nuevos de fábrica)
1. En la pantalla de Bienvenida de Android (recién formateado / *Factory Reset*), presiona **6 veces seguidas** en cualquier espacio en blanco.
2. Se activará la cámara del lector de QR corporativo de Android Enterprise.
3. Escanea el código QR generado desde la sección **Estructura → Generar QR** del Dashboard Web de Centryx.
4. El teléfono descargará e instalará automáticamente `centryx-mdm-latest.apk`, otorgará todos los permisos sin intervención humana y se vinculará a la empresa correspondiente.

### Método B: Enrolamiento por Comando ADB (Desarrollo y Pruebas en Laboratorio)
Si el teléfono ya está encendido y tiene la opción **Depuración USB (ADB)** activada:

```bash
# 1. Instalar la APK de Centryx MDM
adb install -r centryx-mdm-latest.apk

# 2. Conceder permisos especiales de estadísticas de uso
adb shell pm grant io.centryx.mdm android.permission.PACKAGE_USAGE_STATS

# 3. Asignar Centryx como Device Owner absoluto del dispositivo
adb shell dpm set-device-owner io.centryx.mdm/.CentryxDeviceAdminReceiver
```

### Método C: Knox Mobile Enrollment / Google Zero-Touch (Despliegue Masivo >100 Equipos)
- Vinculación directa mediante el IMEI o Número de Serie a través del portal de Samsung Knox / Google Zero-Touch. El teléfono se configura sólo al conectarse a Wi-Fi por primera vez.

---

## 🔑 2. Permisos Críticos del Agente Android (`io.centryx.mdm`)

| Permiso Android | Función en Centryx MDM | Estado |
|---|---|---|
| `BIND_DEVICE_ADMIN` | Control absoluto del dispositivo (Bloqueo forzado, Wiping de datos, deshabilitar cámara) | Otorgado por Device Owner |
| `PACKAGE_USAGE_STATS` | Monitoreo de aplicaciones activas en primer plano e Índice de Foco | Otorgado por Device Owner |
| `ACCESS_FINE_LOCATION` | Coordenadas GPS exactas para mapas en vivo y geocercas | Otorgado en segundo plano |
| `FOREGROUND_SERVICE` | Garantiza que Android no mate el servicio de telemetría en segundo plano | Servicio Persistente |
