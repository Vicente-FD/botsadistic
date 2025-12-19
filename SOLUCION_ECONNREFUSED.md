# 🔧 Solución: Error ECONNREFUSED

## ❌ Error Actual
```
❌ Error al conectar RCON: connect ECONNREFUSED 38.58.176.91:26318
```

Esto significa que el servidor está **rechazando la conexión** en el puerto 26318.

## 🔍 Posibles Causas

### 1. RCON no está habilitado o puerto incorrecto
- Verifica que en `server.properties` tengas:
  ```properties
  enable-rcon=true
  rcon.port=26318
  rcon.password=BotMC2025!Discord
  ```

### 2. El servidor no fue reiniciado
- **IMPORTANTE:** Después de cambiar `server.properties`, debes **reiniciar el servidor**
- Los cambios no se aplican hasta que reinicies

### 3. El puerto no está abierto en HolyHosting
- Verifica que el puerto 26318 esté en la lista de allocations
- Debe estar marcado como "Primary" o disponible

### 4. El puerto en server.properties no coincide
- El puerto en `server.properties` debe ser **exactamente** 26318
- No puede ser 25575 u otro puerto

## ✅ Pasos para Solucionar

### Paso 1: Verificar server.properties

En HolyHosting, abre `server.properties` y verifica:

```properties
enable-rcon=true
rcon.port=26318
rcon.password=BotMC2025!Discord
```

**⚠️ IMPORTANTE:** 
- `rcon.port` debe ser **exactamente** `26318` (no 25575)
- `rcon.password` debe ser **exactamente** `BotMC2025!Discord` (sin espacios)

### Paso 2: Verificar Allocation en HolyHosting

1. Ve a **Network** > **Manage allocation**
2. Verifica que el puerto **26318** esté en la lista
3. Si no está, créalo:
   - Haz clic en **"Create Allocation"**
   - Asigna el puerto **26318**
   - Guarda

### Paso 3: Reiniciar el Servidor

**CRÍTICO:** Después de cambiar `server.properties`:
1. Guarda el archivo
2. Ve al panel de HolyHosting
3. Haz clic en **"Restart"** o **"Reiniciar"**
4. Espera a que el servidor termine de iniciar (puede tardar 1-2 minutos)

### Paso 4: Verificar Logs del Servidor

Después de reiniciar, revisa los logs del servidor. Deberías ver algo como:
```
RCON running on 0.0.0.0:26318
```

Si ves esto, RCON está funcionando correctamente.

### Paso 5: Reiniciar el Bot

Después de que el servidor esté completamente iniciado:
```bash
npm start
```

## 🧪 Verificación

Cuando todo esté correcto, deberías ver:
```
✅ Conectado a RCON: na36.holy.gg:26318
🔌 RCON configurado - Los mensajes se enviarán a Minecraft
```

## 🔍 Checklist

- [ ] `enable-rcon=true` en server.properties
- [ ] `rcon.port=26318` en server.properties (no 25575)
- [ ] `rcon.password=BotMC2025!Discord` en server.properties
- [ ] Puerto 26318 está en las allocations de HolyHosting
- [ ] Servidor fue **reiniciado** después de cambiar server.properties
- [ ] El servidor terminó de iniciar completamente
- [ ] Bot fue reiniciado

## 🆘 Si Aún No Funciona

### Opción 1: Verificar que RCON esté escuchando

En los logs del servidor, busca:
- `RCON running on...` → RCON está funcionando
- Si no aparece → RCON no está habilitado o hay un error

### Opción 2: Probar con otro puerto

Si el puerto 26318 no funciona:
1. Crea una nueva allocation (ej: 26319)
2. Actualiza `rcon.port=26319` en server.properties
3. Actualiza `RCON_PORT=26319` en .env
4. Reinicia servidor y bot

### Opción 3: Contactar Soporte de HolyHosting

Pregunta:
> "Necesito habilitar RCON en el puerto 26318. He configurado server.properties pero la conexión es rechazada. ¿Hay alguna configuración adicional necesaria?"

---

¡Sigue estos pasos y debería funcionar! 🚀

