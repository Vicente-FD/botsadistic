# 🔌 ¿Qué es RCON?

## 📖 Definición

**RCON** (Remote Console) es un protocolo que permite ejecutar comandos en un servidor de Minecraft de forma remota, sin necesidad de estar físicamente en el servidor o tener acceso directo a la consola.

## 🎯 ¿Para qué sirve?

RCON te permite:
- ✅ Ejecutar comandos de Minecraft desde fuera del servidor
- ✅ Automatizar tareas del servidor
- ✅ Integrar el servidor con bots y aplicaciones externas
- ✅ Controlar el servidor sin acceder directamente a él

## 🔧 En tu Bot de Discord

En tu bot, RCON se usa para:

### **Enviar Mensajes de Discord → Minecraft**

Cuando alguien escribe un mensaje en el canal configurado (`1049464791959339078`), el bot:

1. **Lee el mensaje** de Discord
2. **Se conecta al servidor** usando RCON
3. **Ejecuta el comando** `tellraw @a {"text":"MENSAJE","color":"red","bold":true}`
4. **El mensaje aparece** en el chat de Minecraft para todos los jugadores

### Ejemplo Visual:

```
Discord (Canal 1049464791959339078):
👤 Usuario: "¡Hola desde Discord!"

↓ (Bot usa RCON)

Minecraft (Chat del servidor):
🔴 Usuario: ¡Hola desde Discord! (en rojo, negrita)
```

## ⚙️ Cómo Funciona

### 1. Configuración en el Servidor

En el archivo `server.properties` de tu servidor Minecraft:

```properties
# Habilitar RCON
enable-rcon=true

# Puerto RCON (por defecto 25575)
rcon.port=25575

# Contraseña RCON (¡debe ser segura!)
rcon.password=tu_password_super_seguro_123
```

### 2. Configuración en el Bot

En tu archivo `.env`:

```env
# Puerto RCON (debe coincidir con server.properties)
RCON_PORT=25575

# Contraseña RCON (debe coincidir con server.properties)
RCON_PASSWORD=tu_password_super_seguro_123
```

### 3. Conexión

El bot se conecta al servidor usando:
- **Host:** `sadistic.holy.gg` (tu MC_HOST)
- **Puerto:** `25575` (tu RCON_PORT)
- **Contraseña:** Tu RCON_PASSWORD

## 🔒 Seguridad

⚠️ **IMPORTANTE:**
- RCON permite ejecutar **cualquier comando** en el servidor
- La contraseña debe ser **muy segura**
- **NO compartas** tu contraseña RCON públicamente
- Solo permite conexiones RCON desde IPs confiables si es posible

## 📊 Comparación

### Sin RCON:
- ❌ No puedes enviar mensajes de Discord a Minecraft
- ❌ No puedes ejecutar comandos automáticamente
- ❌ El bot solo puede **leer** el estado del servidor

### Con RCON:
- ✅ Puedes enviar mensajes de Discord a Minecraft
- ✅ Puedes ejecutar comandos automáticamente
- ✅ El bot puede **leer y escribir** en el servidor

## 🎮 Comandos que Puedes Ejecutar

Con RCON, el bot puede ejecutar cualquier comando de Minecraft, por ejemplo:

- `tellraw @a {"text":"Mensaje"}` - Enviar mensaje a todos
- `say Hola` - Mensaje en el chat del servidor
- `give @p diamond 1` - Dar items (si el bot tuviera permisos)
- `tp @p 0 64 0` - Teletransportar jugadores
- Y cualquier otro comando de Minecraft

## ❓ ¿Es Necesario?

**NO es obligatorio.** El bot funciona perfectamente sin RCON para:
- ✅ Monitorear el estado del servidor
- ✅ Reproducir música
- ✅ Mostrar estadísticas

**SÍ es necesario** si quieres:
- ✅ Enviar mensajes de Discord a Minecraft
- ✅ Ejecutar comandos automáticamente
- ✅ Integración bidireccional Discord ↔ Minecraft

## 🚀 Resumen

**RCON = Puente entre Discord y Minecraft**

- Permite que el bot **ejecute comandos** en el servidor
- Se usa principalmente para **enviar mensajes** de Discord a Minecraft
- Es **opcional** - el bot funciona sin él
- Requiere **configuración** en el servidor y en el bot

---

¿Tienes más preguntas sobre RCON? 🤔

