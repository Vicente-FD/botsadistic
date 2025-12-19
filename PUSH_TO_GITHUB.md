# 🚀 Instrucciones para Subir el Código a GitHub

## Paso 1: Crear el Repositorio en GitHub

1. Ve a https://github.com/new
2. **Repository name:** `discord-minecraft-status-bot` (o el nombre que prefieras)
3. **Description:** "Bot de Discord para monitorear servidor Minecraft"
4. Elige **Public** o **Private**
5. **NO marques** "Initialize this repository with a README" (ya tenemos uno)
6. Haz clic en **"Create repository"**

## Paso 2: Copiar la URL del Repositorio

Después de crear el repositorio, GitHub te mostrará una página con instrucciones. Copia la URL que aparece, será algo como:
```
https://github.com/tu-usuario/discord-minecraft-status-bot.git
```

## Paso 3: Conectar y Hacer Push

Abre PowerShell o Terminal en la carpeta del proyecto y ejecuta:

```bash
# Reemplaza TU_URL_AQUI con la URL que copiaste
git remote add origin TU_URL_AQUI
git branch -M main
git push -u origin main
```

**Ejemplo:**
```bash
git remote add origin https://github.com/tu-usuario/discord-minecraft-status-bot.git
git branch -M main
git push -u origin main
```

## Paso 4: Verificar

1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos del proyecto
3. Ve a la pestaña **Actions** para ver el workflow

## ⚠️ Si te pide autenticación

Si GitHub te pide usuario y contraseña:
- **Usuario:** Tu nombre de usuario de GitHub
- **Contraseña:** Necesitarás un **Personal Access Token** (no tu contraseña normal)

### Crear Personal Access Token:

1. Ve a https://github.com/settings/tokens
2. Haz clic en **"Generate new token"** > **"Generate new token (classic)"**
3. Dale un nombre (ej: "Bot MC")
4. Selecciona el scope **`repo`** (todos los permisos)
5. Haz clic en **"Generate token"**
6. **Copia el token** (solo lo verás una vez)
7. Úsalo como contraseña cuando git te lo pida

## ✅ Listo

Una vez hecho el push, el repositorio estará en GitHub y el workflow se ejecutará automáticamente en cada commit.

