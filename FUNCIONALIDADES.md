# 🎮 Nuevas Funcionalidades del Bot

## 📋 Índice

1. [Mensajes Discord → Minecraft](#mensajes-discord--minecraft)
2. [Reproductor de Música (Spotify/YouTube)](#reproductor-de-música)
3. [Otras Funcionalidades del Servidor](#otras-funcionalidades)

---

## 💬 Mensajes Discord → Minecraft

### Descripción
Los mensajes enviados en un canal específico de Discord se envían automáticamente al chat del servidor de Minecraft usando el comando `tellraw`.

### Configuración

1. **Habilitar RCON en tu servidor Minecraft:**
   - Edita `server.properties`
   - Establece `enable-rcon=true`
   - Establece `rcon.port=25575` (o el puerto que prefieras)
   - Establece `rcon.password=tu_password_seguro`
   - Reinicia el servidor

2. **Configurar variables de entorno:**
   ```env
   RCON_PORT=25575
   RCON_PASSWORD=tu_password_rcon
   DISCORD_TO_MC_CHANNEL_ID=id_del_canal_discord
   ```

3. **Formato del mensaje en Minecraft:**
   - Los mensajes aparecen como: `Usuario: Mensaje`
   - Color: Rojo
   - Estilo: Negrita
   - Comando usado: `tellraw @a {"text":"MENSAJE","color":"red","bold":true}`

### Uso

1. Configura el canal en `.env` con `DISCORD_TO_MC_CHANNEL_ID`
2. Escribe cualquier mensaje en ese canal
3. El bot enviará el mensaje automáticamente a Minecraft
4. Verás una reacción ✅ si se envió correctamente, o ❌ si hubo error

### Requisitos

- Servidor Minecraft con RCON habilitado
- Puerto RCON accesible desde donde corre el bot
- Permisos del bot para leer mensajes en el canal de Discord

---

## 🎵 Reproductor de Música

### Descripción
Reproduce música desde Spotify o YouTube en canales de voz de Discord.

### Comandos Disponibles

#### `/play <canción>`
Reproduce una canción desde Spotify o YouTube.

**Ejemplos:**
- `/play Bohemian Rhapsody`
- `/play https://open.spotify.com/track/...`
- `/play https://www.youtube.com/watch?v=...`

#### `/stop`
Detiene la reproducción y limpia la cola.

#### `/pause`
Pausa o reanuda la reproducción actual.

#### `/queue`
Muestra las próximas 10 canciones en la cola.

### Requisitos

- El bot necesita permisos para:
  - Conectarse a canales de voz
  - Hablar en canales de voz
- El usuario debe estar en un canal de voz para usar los comandos
- FFmpeg instalado en el sistema (se instala automáticamente con las dependencias)

### Instalación de FFmpeg

**Windows:**
```bash
# Se instala automáticamente con ffmpeg-static
npm install
```

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### Notas

- El bot puede reproducir desde:
  - Spotify (URLs y búsquedas)
  - YouTube (URLs y búsquedas)
  - Cualquier fuente soportada por discord-player
- La música se reproduce en el canal de voz donde está el usuario
- Si el bot se desconecta, simplemente vuelve a usar `/play`

---

## 🎮 Otras Funcionalidades del Servidor

### Funcionalidades Actuales

1. **Monitoreo de Estado**
   - Actualización automática cada minuto
   - Notificaciones de cambios de estado
   - Estadísticas del servidor

2. **Mensajes Discord → Minecraft**
   - Envío automático de mensajes
   - Formato personalizado

3. **Reproductor de Música**
   - Spotify y YouTube
   - Cola de reproducción
   - Control de reproducción

### Funcionalidades Sugeridas (Futuras)

1. **Comandos del Servidor desde Discord**
   - Ejecutar comandos de Minecraft desde Discord
   - Ejemplo: `/mc-command say Hola`

2. **Notificaciones de Eventos**
   - Notificar cuando un jugador se une/sale
   - Notificar muertes importantes
   - Notificar logros

3. **Estadísticas de Jugadores**
   - Ver estadísticas de jugadores desde Discord
   - Top jugadores
   - Tiempo de juego

4. **Sincronización de Roles**
   - Sincronizar roles de Discord con rangos de Minecraft
   - Automatizar permisos

5. **Whitelist desde Discord**
   - Agregar/quitar jugadores de la whitelist
   - Ver lista de jugadores permitidos

---

## 🔧 Configuración Completa

### Variables de Entorno Necesarias

```env
# Discord (Requerido)
DISCORD_TOKEN=tu_token
DISCORD_CLIENT_ID=tu_client_id
GUILD_ID=tu_guild_id
CHANNEL_ID=canal_estado

# Minecraft (Requerido)
MC_HOST=sadistic.holy.gg
MC_PORT=25621

# RCON (Opcional - Para mensajes Discord → MC)
RCON_PORT=25575
RCON_PASSWORD=tu_password

# Canales (Opcional)
DISCORD_TO_MC_CHANNEL_ID=canal_para_mensajes
UPDATE_INTERVAL=60000
```

### Permisos del Bot en Discord

El bot necesita los siguientes permisos:

- ✅ Ver canales
- ✅ Enviar mensajes
- ✅ Gestionar mensajes
- ✅ Leer historial de mensajes
- ✅ Conectarse (canales de voz)
- ✅ Hablar (canales de voz)
- ✅ Usar comandos slash

### Permisos en el Servidor Minecraft

- RCON habilitado y configurado
- Puerto RCON accesible desde donde corre el bot

---

## 🐛 Solución de Problemas

### RCON no se conecta

1. Verifica que RCON esté habilitado en `server.properties`
2. Verifica que el puerto sea correcto
3. Verifica que la contraseña sea correcta
4. Asegúrate de que el firewall permita conexiones al puerto RCON

### La música no reproduce

1. Verifica que FFmpeg esté instalado
2. Asegúrate de estar en un canal de voz
3. Verifica que el bot tenga permisos de voz
4. Revisa los logs para ver errores específicos

### Los mensajes no se envían a Minecraft

1. Verifica que `DISCORD_TO_MC_CHANNEL_ID` esté configurado
2. Verifica que el bot pueda leer mensajes en ese canal
3. Verifica la conexión RCON
4. Revisa los logs del bot

---

## 📝 Notas Adicionales

- El bot puede manejar múltiples servidores de Discord
- Cada servidor tiene su propia cola de música
- Los mensajes a Minecraft se envían a todos los jugadores (`@a`)
- El formato de mensajes en Minecraft puede personalizarse editando `src/rcon.js`

---

¡Disfruta de las nuevas funcionalidades! 🎉

