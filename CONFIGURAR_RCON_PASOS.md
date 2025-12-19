# 🔧 Pasos para Habilitar RCON en tu Servidor

## 📋 Estado Actual

En tu `server.properties` veo:
- ❌ `enable-rcon=false` → **RCON está deshabilitado**
- ⚠️ `rcon.password=` → **Sin contraseña configurada**
- ✅ `rcon.port=25575` → **Puerto ya configurado**

## 🚀 Pasos para Habilitar

### Paso 1: Editar server.properties en HolyHosting

1. Ve al panel de HolyHosting: https://panel.holy.gg
2. Selecciona tu servidor
3. Ve a **"Archivos"** o **"File Manager"**
4. Abre el archivo `server.properties`
5. Busca estas líneas y cámbialas:

**Cambiar:**
```properties
enable-rcon=false
rcon.password=
```

**Por:**
```properties
enable-rcon=true
rcon.password=TuContraseñaSegura123!
```

### Paso 2: Elegir una Contraseña Segura

Ejemplo de contraseña segura:
- Mínimo 12 caracteres
- Combina mayúsculas, minúsculas, números y símbolos
- **Ejemplo:** `BotMC2025!Discord#RCON`

⚠️ **IMPORTANTE:** 
- Guarda esta contraseña en un lugar seguro
- La necesitarás para el bot
- NO la compartas públicamente

### Paso 3: Guardar y Reiniciar

1. **Guarda** el archivo `server.properties`
2. **Reinicia el servidor** desde el panel de HolyHosting
3. Espera a que el servidor termine de iniciar

### Paso 4: Configurar el Bot

Una vez que hayas configurado RCON en el servidor:

1. Abre el archivo `.env` en tu proyecto
2. Agrega estas líneas:

```env
RCON_PORT=25575
RCON_PASSWORD=TuContraseñaSegura123!
```

**⚠️ IMPORTANTE:** Usa la **misma contraseña** que pusiste en `server.properties`

### Paso 5: Reiniciar el Bot

```bash
# Detén el bot si está corriendo (Ctrl+C)
npm start
```

## ✅ Verificación

Después de configurar todo:

1. **El bot debería mostrar:**
   ```
   ✅ Conectado a RCON: sadistic.holy.gg:25575
   ```

2. **Prueba enviar un mensaje:**
   - Ve al canal `1049464791959339078` en Discord
   - Escribe cualquier mensaje
   - Deberías ver una reacción ✅
   - El mensaje debería aparecer en Minecraft

## 🔍 Si No Funciona

### Verifica:
1. ✅ `enable-rcon=true` en server.properties
2. ✅ `rcon.password=` tiene una contraseña (no está vacío)
3. ✅ La contraseña en `.env` es **exactamente** la misma
4. ✅ El servidor fue **reiniciado** después de cambiar server.properties
5. ✅ El bot fue **reiniciado** después de agregar las variables al .env

### Errores Comunes:
- **"RCON_PASSWORD no está configurado"** → Agrega la variable al .env
- **"No se pudo conectar a RCON"** → Verifica que enable-rcon=true y reinicia el servidor
- **"Autenticación fallida"** → La contraseña en .env no coincide con server.properties

---

¡Sigue estos pasos y RCON debería funcionar! 🎮

