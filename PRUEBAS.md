# 🧪 Guía de Pruebas

## 📋 Configuración Inicial

### 1. Variables de Entorno Configuradas

El archivo `.env` ya tiene configurado:
- ✅ `DISCORD_TO_MC_CHANNEL_ID=1049464791959339078` - Canal para mensajes Discord → MC

### 2. Configurar RCON en el Servidor Minecraft

Para que los mensajes se envíen a Minecraft, necesitas:

1. **Editar `server.properties`** en tu servidor:
   ```properties
   enable-rcon=true
   rcon.port=25575
   rcon.password=tu_password_seguro
   ```

2. **Agregar al `.env`**:
   ```env
   RCON_PORT=25575
   RCON_PASSWORD=tu_password_seguro
   ```

3. **Reiniciar el servidor** para aplicar los cambios

---

## 💬 Probar: Mensajes Discord → Minecraft

### Pasos:

1. **Ve al canal con ID `1049464791959339078`** en Discord
2. **Escribe cualquier mensaje** en ese canal
3. **El bot debería:**
   - Reaccionar con ✅ si se envió correctamente
   - Reaccionar con ❌ si hubo error
4. **En Minecraft**, deberías ver el mensaje aparecer como:
   ```
   Usuario: Tu mensaje
   ```
   - Color: Rojo
   - Estilo: Negrita

### Ejemplo:
```
Discord: "Hola desde Discord!"
Minecraft: Usuario: Hola desde Discord! (en rojo, negrita)
```

### Solución de Problemas:

- **❌ No se envía el mensaje:**
  - Verifica que RCON esté habilitado en el servidor
  - Verifica que `RCON_PASSWORD` sea correcto
  - Verifica que el puerto RCON sea accesible
  - Revisa los logs del bot para ver errores

- **❌ El bot no reacciona:**
  - Verifica que el bot tenga permisos para leer mensajes en ese canal
  - Verifica que `DISCORD_TO_MC_CHANNEL_ID` sea correcto

---

## 🎵 Probar: Reproductor de Música

### Comandos Disponibles:

#### `/play <canción>`
Reproduce música desde cualquier canal de Discord.

**Ejemplos:**
- `/play Bohemian Rhapsody`
- `/play https://open.spotify.com/track/...`
- `/play https://www.youtube.com/watch?v=...`

**Pasos:**
1. **Únete a un canal de voz** en Discord
2. **Desde cualquier canal de texto**, escribe `/play` seguido de la canción
3. **El bot se unirá automáticamente** a tu canal de voz
4. **Aparecerá un panel con botones** para controlar la música

### Panel de Control

Cuando uses `/play`, verás un mensaje con botones:

- **⏸️ Pausar / ▶️ Reanudar** - Pausa o reanuda la reproducción
- **⏹️ Detener** - Detiene la música y limpia la cola
- **⏭️ Siguiente** - Salta a la siguiente canción (si hay más en la cola)
- **📋 Cola** - Muestra las próximas canciones

### Funcionalidades:

1. **Reproducción Automática:**
   - El bot se une al canal de voz donde estás
   - Funciona desde cualquier canal de texto
   - No necesitas estar en el mismo canal que el bot

2. **Cola de Reproducción:**
   - Puedes agregar múltiples canciones
   - Usa `/play` varias veces para agregar a la cola
   - El bot reproducirá automáticamente la siguiente canción

3. **Control con Botones:**
   - Haz clic en los botones para controlar la música
   - No necesitas escribir comandos cada vez
   - El panel se actualiza automáticamente

### Ejemplo de Uso:

```
1. Únete a un canal de voz
2. En cualquier canal de texto, escribe: /play Never Gonna Give You Up
3. El bot se une a tu canal de voz y reproduce la canción
4. Aparece un panel con botones
5. Haz clic en "⏸️ Pausar" para pausar
6. Haz clic en "▶️ Reanudar" para continuar
7. Haz clic en "⏭️ Siguiente" para saltar (si hay más canciones)
8. Haz clic en "📋 Cola" para ver qué sigue
```

### Solución de Problemas:

- **❌ "Debes estar en un canal de voz":**
  - Únete a un canal de voz primero
  - El bot necesita saber a qué canal unirse

- **❌ "No pude unirme al canal de voz":**
  - Verifica que el bot tenga permisos para conectarse
  - Verifica que el bot tenga permisos para hablar
  - Asegúrate de que no haya otro bot ocupando el canal

- **❌ "No se encontraron resultados":**
  - Intenta con una URL directa de Spotify o YouTube
  - Verifica que el nombre de la canción sea correcto
  - Algunas canciones pueden no estar disponibles

- **❌ La música no suena:**
  - Verifica que FFmpeg esté instalado
  - Revisa los logs del bot para errores
  - Asegúrate de que el bot tenga permisos de audio

---

## 🔧 Comandos Adicionales

### `/stop`
Detiene la música y limpia la cola completamente.

### `/pause`
Pausa o reanuda la reproducción (alterna).

### `/queue`
Muestra las próximas 10 canciones en la cola.

---

## ✅ Checklist de Pruebas

### Mensajes Discord → Minecraft:
- [ ] RCON configurado en el servidor
- [ ] Variables de entorno configuradas
- [ ] Mensaje enviado desde el canal correcto
- [ ] Mensaje aparece en Minecraft con formato correcto
- [ ] Reacción ✅ aparece en Discord

### Reproductor de Música:
- [ ] Bot tiene permisos de voz
- [ ] Usuario en canal de voz
- [ ] Comando `/play` funciona
- [ ] Bot se une al canal de voz
- [ ] Panel de control aparece
- [ ] Botones funcionan correctamente
- [ ] Música se reproduce
- [ ] Cola funciona correctamente

---

## 📝 Notas Importantes

1. **RCON:** Solo funciona si el servidor Minecraft tiene RCON habilitado y el bot puede acceder al puerto
2. **Música:** El bot puede reproducir desde Spotify y YouTube automáticamente
3. **Permisos:** Asegúrate de que el bot tenga todos los permisos necesarios
4. **FFmpeg:** Necesario para la reproducción de música (se instala automáticamente en GitHub Actions)

---

¡Disfruta probando las nuevas funcionalidades! 🎉

