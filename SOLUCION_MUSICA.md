# 🎵 Solución: Problemas con la Música

## ❌ Problemas Comunes

### 1. FFmpeg no está instalado

FFmpeg es **necesario** para reproducir música. Sin él, el bot no puede procesar el audio.

**Solución en Windows:**

1. **Opción A: Instalar FFmpeg manualmente**
   - Descarga desde: https://ffmpeg.org/download.html
   - Extrae y agrega a PATH
   - O usa: `choco install ffmpeg` (si tienes Chocolatey)

2. **Opción B: Usar ffmpeg-static (más fácil)**
   ```bash
   npm install ffmpeg-static
   ```
   Luego actualiza el código para usar ffmpeg-static.

### 2. Extractors no cargados

El warning `[NoExtractors]` indica que los extractors no están cargados.

**Solución:**
- Ya está corregido en el código
- Los extractors se cargan automáticamente
- Si persiste, reinstala: `npm install @discord-player/extractor`

### 3. Permisos del Bot

El bot necesita permisos para:
- ✅ Conectarse a canales de voz
- ✅ Hablar en canales de voz

**Verificar:**
1. Configuración del servidor > Roles > @Bot
2. Permisos de voz:
   - ✅ Conectar
   - ✅ Hablar

### 4. Error al buscar música

Si aparece "No se encontraron resultados":
- Intenta con una URL directa de YouTube
- Usa nombres más específicos (canción + artista)
- Verifica tu conexión a internet

## 🔧 Pasos para Solucionar

### Paso 1: Instalar FFmpeg

**Windows (PowerShell como Administrador):**
```powershell
# Con Chocolatey
choco install ffmpeg

# O descarga manual desde https://ffmpeg.org/download.html
```

**Verificar instalación:**
```bash
ffmpeg -version
```

### Paso 2: Reinstalar Dependencias

```bash
npm install
```

### Paso 3: Verificar Permisos del Bot

1. Ve a Configuración del Servidor > Roles
2. Selecciona el rol del bot
3. Permisos de Voz:
   - ✅ Conectar
   - ✅ Hablar
   - ✅ Usar Actividad de Voz (opcional)

### Paso 4: Probar

1. Únete a un canal de voz
2. Escribe: `/play Never Gonna Give You Up`
3. El bot debería unirse y reproducir

## 🧪 Pruebas

### Prueba 1: URL de YouTube
```
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Prueba 2: Búsqueda por nombre
```
/play Bohemian Rhapsody Queen
```

### Prueba 3: URL de Spotify
```
/play https://open.spotify.com/track/...
```

## 📊 Logs Útiles

Cuando uses `/play`, revisa la consola:

**Si funciona:**
```
🎵 Reproduciendo: Nombre de la Canción - Artista
```

**Si hay error:**
```
❌ Error del reproductor: [mensaje de error]
```

## 🆘 Si Aún No Funciona

1. **Revisa los logs** del bot cuando uses `/play`
2. **Verifica FFmpeg:** `ffmpeg -version`
3. **Verifica permisos** del bot en el canal de voz
4. **Prueba con URL directa** de YouTube primero

---

¡Sigue estos pasos y la música debería funcionar! 🎶

