# 🔐 GitHub Secrets - Configuración Completa

## 📋 Secrets Necesarios para el Deploy

Después de hacer push, necesitas agregar estos secrets en GitHub:

### Secrets Requeridos (Ya deberías tenerlos)

1. **DISCORD_TOKEN**
   - Valor: `tu_token_del_bot` (obtenerlo de Discord Developer Portal)

2. **MC_HOST**
   - Valor: `sadistic.holy.gg`

3. **MC_PORT**
   - Valor: `25621`

4. **CHANNEL_ID**
   - Valor: `1450170104514871307`

### Secrets Nuevos (Agregar estos)

5. **RCON_HOST** ⭐ NUEVO
   - Valor: `na36.holy.gg`
   - Descripción: Host/IP para conexión RCON

6. **RCON_PORT** ⭐ NUEVO
   - Valor: `26318`
   - Descripción: Puerto RCON

7. **RCON_PASSWORD** ⭐ NUEVO
   - Valor: `BotMC2025!Discord`
   - Descripción: Contraseña RCON

8. **DISCORD_TO_MC_CHANNEL_ID** ⭐ NUEVO
   - Valor: `1049464791959339078`
   - Descripción: Canal donde los mensajes se envían a Minecraft

### Secrets Opcionales

9. **UPDATE_INTERVAL** (Opcional)
   - Valor: `60000`
   - Descripción: Intervalo de actualización en ms

10. **NOTIFICATION_CHANNEL_ID** (Opcional)
    - Valor: `1450170104514871307`
    - Descripción: Canal para notificaciones

## 🚀 Cómo Agregar los Secrets

1. Ve a tu repositorio: https://github.com/Vicente-FD/botsadistic
2. Haz clic en **Settings** > **Secrets and variables** > **Actions**
3. Haz clic en **"New repository secret"**
4. Agrega cada uno de los secrets nuevos (marcados con ⭐)
5. Guarda cada uno

## ✅ Checklist

- [ ] RCON_HOST agregado
- [ ] RCON_PORT agregado
- [ ] RCON_PASSWORD agregado
- [ ] DISCORD_TO_MC_CHANNEL_ID agregado
- [ ] Todos los secrets anteriores siguen configurados

## 🔄 Después de Agregar los Secrets

Una vez agregados, el workflow se ejecutará automáticamente en el próximo push, o puedes ejecutarlo manualmente desde **Actions** > **"Run workflow"**.

---

¡Listo para el deploy! 🚀

