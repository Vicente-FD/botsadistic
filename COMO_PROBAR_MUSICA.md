# 🎵 Cómo Probar el Reproductor de Música

## ❓ ¿Necesito una cuenta de Spotify?

**NO**, no necesitas una cuenta de Spotify. El bot puede reproducir música de varias formas:

1. **YouTube** - Funciona directamente, sin configuración
2. **Spotify (URLs)** - Puedes usar URLs de Spotify, el bot buscará el audio en YouTube
3. **Búsqueda por nombre** - El bot busca en YouTube automáticamente
4. **Otras fuentes** - SoundCloud, Bandcamp, etc.

## 🚀 Cómo Probar

### Paso 1: Preparación

1. **Asegúrate de estar en un canal de voz** en Discord
2. **El bot necesita permisos:**
   - Conectarse a canales de voz
   - Hablar en canales de voz
   - Usar comandos slash

### Paso 2: Probar con YouTube (Más Fácil)

**Opción A: URL de YouTube**
```
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Opción B: Buscar por nombre**
```
/play Never Gonna Give You Up
```

### Paso 3: Probar con Spotify

**Opción A: URL de Spotify**
```
/play https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC
```

**Opción B: URL de playlist de Spotify**
```
/play https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
```

**Nota:** El bot tomará la URL de Spotify y buscará el audio en YouTube automáticamente.

### Paso 4: Usar el Panel de Control

Después de usar `/play`, verás un mensaje con botones:

- **⏸️ Pausar** - Pausa la reproducción
- **▶️ Reanudar** - Continúa la reproducción (aparece cuando está pausado)
- **⏹️ Detener** - Detiene todo y limpia la cola
- **⏭️ Siguiente** - Salta a la siguiente canción (si hay más en la cola)
- **📋 Cola** - Muestra las próximas canciones

## 📝 Ejemplos Prácticos

### Ejemplo 1: Reproducir una canción de YouTube
```
1. Únete a un canal de voz
2. Escribe: /play Bohemian Rhapsody
3. El bot se une y reproduce
4. Usa los botones para controlar
```

### Ejemplo 2: Reproducir desde Spotify
```
1. Únete a un canal de voz
2. Copia una URL de Spotify (canción o playlist)
3. Escribe: /play [pega la URL]
4. El bot busca y reproduce
```

### Ejemplo 3: Agregar múltiples canciones
```
1. /play Canción 1
2. /play Canción 2
3. /play Canción 3
4. El bot reproducirá todas en orden
5. Usa "⏭️ Siguiente" para saltar
```

## 🔧 Solución de Problemas

### ❌ "Debes estar en un canal de voz"
- **Solución:** Únete a un canal de voz primero

### ❌ "No se encontraron resultados"
- **Solución:** 
  - Intenta con una URL directa de YouTube
  - Verifica que el nombre de la canción sea correcto
  - Algunas canciones pueden no estar disponibles

### ❌ "No pude unirme al canal de voz"
- **Solución:**
  - Verifica permisos del bot (Conectar + Hablar)
  - Asegúrate de que no haya otro bot ocupando el canal
  - Verifica que el canal de voz no esté lleno

### ❌ La música no suena
- **Solución:**
  - Verifica que FFmpeg esté instalado
  - Revisa los logs del bot
  - Asegúrate de que el bot tenga permisos de audio

### ❌ Spotify no funciona
- **Solución:**
  - Usa URLs de Spotify (no búsquedas)
  - El bot buscará el audio en YouTube automáticamente
  - Si no encuentra, intenta buscar directamente en YouTube

## 🎯 Mejores Prácticas

1. **Para mejor calidad:** Usa URLs directas de YouTube
2. **Para playlists:** Usa URLs de playlists de Spotify o YouTube
3. **Para búsquedas:** Busca por nombre de canción + artista
4. **Para control:** Usa los botones del panel en lugar de comandos

## 📊 Fuentes Soportadas

El bot puede reproducir desde:
- ✅ YouTube (URLs y búsquedas)
- ✅ Spotify (URLs de canciones y playlists)
- ✅ SoundCloud (URLs)
- ✅ Bandcamp (URLs)
- ✅ Otras fuentes soportadas por discord-player

## 💡 Tips

- **Playlists largas:** El bot puede tardar un momento en cargar todas las canciones
- **Calidad:** La calidad depende de la fuente, YouTube generalmente ofrece buena calidad
- **Cola:** Puedes agregar hasta 100 canciones en la cola
- **Panel:** El panel se actualiza automáticamente cuando cambias el estado

---

¡Disfruta de la música! 🎶

